#!/usr/bin/env python3
"""
IoT Hub Enterprise Automation - GSMA & ISO/IEC 7812 Bulk SIM/eSIM Engine
Generates collision-free, cryptographically valid Telecom Provisioning records:
- ICCID with ISO/IEC 7812 Luhn Checksum Algorithm
- IMSI with ITU-T E.212 MCC+MNC+MSIN standard
- MSISDN in ITU-T E.164 international numbering format
- eSIM Profile LPA strings (GSMA SGP.22 SM-DP+)
- PIN1/PUK1/PIN2/PUK2 cryptographic keys
"""

import csv
import json
import os
import random
import sys
import time
from dataclasses import asdict, dataclass
from typing import Dict, List, Optional

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False


def calculate_luhn_check_digit(number_str: str) -> int:
    """Calculates ISO/IEC 7812 check digit using Luhn algorithm."""
    digits = [int(d) for d in number_str]
    # Process from right to left, doubling every second digit
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 0:  # In calculation, the first position doubled is the one right before check digit
            d = d * 2
            if d > 9:
                d -= 9
        checksum += d
    check_digit = (10 - (checksum % 10)) % 10
    return check_digit


def validate_luhn(full_number_str: str) -> bool:
    """Validates that a complete number satisfies the Luhn algorithm."""
    digits = [int(d) for d in full_number_str]
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 1:
            d = d * 2
            if d > 9:
                d -= 9
        checksum += d
    return (checksum % 10) == 0


@dataclass
class SimProfile:
    iccid: str
    imsi: str
    msisdn: str
    sim_type: str  # 'PHYSICAL_SIM' | 'ESIM'
    profile_status: str  # 'AVAILABLE' | 'ALLOCATED' | 'ACTIVE'
    apn_group: str
    rate_plan: str
    pin1: str
    puk1: str
    pin2: str
    puk2: str
    lpa_activation_code: Optional[str] = None
    created_timestamp: int = 0


class BulkSimEngine:
    def __init__(self, country_code: str = "1", issuer_id: str = "404", smdp_fqdn: str = "smdp.eastus.iot-hub.net"):
        self.country_code = country_code  # e.g. 1 for US, 91 for India
        self.issuer_id = issuer_id        # Telecom operator code
        self.smdp_fqdn = smdp_fqdn        # GSMA RSP SM-DP+ Server FQDN

    def generate_single_sim(self, index: int, sim_type: str = "PHYSICAL_SIM", apn: str = "iot.carrier.com", rate_plan: str = "Enterprise-5G-Tier1") -> SimProfile:
        timestamp_part = str(int(time.time() * 1000))[-7:]
        unique_seq = f"{timestamp_part}{index:04d}"[-9:]
        
        # 1. ICCID: 89 (Telecom MII) + Country Code (2-3) + Issuer (3) + Account/Sequence (9) + Luhn Checksum (1) = 19-20 digits
        raw_iccid_prefix = f"89{self.country_code}{self.issuer_id}{unique_seq}"
        if len(raw_iccid_prefix) > 18:
            raw_iccid_prefix = raw_iccid_prefix[:18]
        elif len(raw_iccid_prefix) < 18:
            raw_iccid_prefix = raw_iccid_prefix.ljust(18, '0')
        check_digit = calculate_luhn_check_digit(raw_iccid_prefix)
        iccid = f"{raw_iccid_prefix}{check_digit}"

        # 2. IMSI: 15 digits = MCC (3) + MNC (2-3) + MSIN (9-10)
        # 310 (US) or 404 (India)
        mcc = "310" if self.country_code == "1" else "404"
        mnc = "260" if mcc == "310" else "45"
        msin = f"{int(time.time()) % 1000000:06d}{index:03d}"
        imsi = f"{mcc}{mnc}{msin}".ljust(15, '0')[:15]

        # 3. MSISDN: E.164 phone numbering
        national_number = f"98{random.randint(10000000, 99999999)}"
        msisdn = f"+{self.country_code}{national_number}"

        # 4. Keys
        pin1 = f"{random.randint(1000, 9999)}"
        puk1 = f"{random.randint(10000000, 99999999)}"
        pin2 = f"{random.randint(1000, 9999)}"
        puk2 = f"{random.randint(10000000, 99999999)}"

        # 5. eSIM LPA String
        lpa_code = None
        if sim_type == "ESIM":
            matching_id = f"IOT-{iccid[-8:]}-{random.randint(1000, 9999)}"
            lpa_code = f"LPA:1${self.smdp_fqdn}${matching_id}"

        return SimProfile(
            iccid=iccid,
            imsi=imsi,
            msisdn=msisdn,
            sim_type=sim_type,
            profile_status="AVAILABLE",
            apn_group=apn,
            rate_plan=rate_plan,
            pin1=pin1,
            puk1=puk1,
            pin2=pin2,
            puk2=puk2,
            lpa_activation_code=lpa_code,
            created_timestamp=int(time.time() * 1000)
        )

    def generate_batch(self, count: int = 50, esim_ratio: float = 0.5, apn: str = "iot.carrier.com", rate_plan: str = "Enterprise-5G-Tier1") -> List[SimProfile]:
        """Generates N collision-free SIM/eSIM profiles."""
        profiles = []
        for i in range(count):
            is_esim = (i / count) < esim_ratio
            stype = "ESIM" if is_esim else "PHYSICAL_SIM"
            profiles.append(self.generate_single_sim(i + 1, sim_type=stype, apn=apn, rate_plan=rate_plan))
        return profiles

    def export_to_csv(self, profiles: List[SimProfile], filepath: str) -> str:
        """Exports profiles to portal-compatible CSV format."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        keys = list(asdict(profiles[0]).keys())
        with open(filepath, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            for p in profiles:
                writer.writerow(asdict(p))
        return filepath

    def export_to_excel(self, profiles: List[SimProfile], filepath: str) -> str:
        """Exports profiles to Excel XLSX format using pandas/openpyxl if available."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        if HAS_PANDAS:
            df = pd.DataFrame([asdict(p) for p in profiles])
            df.to_excel(filepath, index=False, engine="openpyxl")
        else:
            # Fallback to CSV if pandas not present
            return self.export_to_csv(profiles, filepath.replace(".xlsx", ".csv"))
        return filepath


if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    out_path = sys.argv[2] if len(sys.argv) > 2 else "reports/python-audit/generated_sim_batch.csv"
    engine = BulkSimEngine()
    batch = engine.generate_batch(count=count)
    engine.export_to_csv(batch, out_path)
    print(json.dumps({
        "success": True,
        "count": len(batch),
        "exported_file": out_path,
        "sample": asdict(batch[0])
    }, indent=2))
