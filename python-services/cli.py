#!/usr/bin/env python3
"""
IoT Hub Enterprise Automation - Unified Python Telecom & Billing Engine CLI
Entry point for Playwright TypeScript Bridge and Server REST endpoints:
- bulk-sims: Generates N ISO/IEC 7812 Luhn-valid SIM/eSIM profiles
- cdr-audit: Runs high-throughput CDR rating and tariff variance verification
- invoice-audit: Audits line items and cross-reconciles against rating ledgers
- full-audit: Complete end-to-end telecom rating & invoice reconciliation
"""

import argparse
import json
import os
import sys
from dataclasses import asdict

from bulk_sim_engine import BulkSimEngine
from cdr_rating_engine import CdrRatingEngine, TariffPlan
from invoice_reconciler import InvoiceReconciler


def cmd_generate_sims(args):
    engine = BulkSimEngine(country_code=args.country, issuer_id=args.issuer)
    profiles = engine.generate_batch(
        count=args.count,
        esim_ratio=args.esim_ratio,
        apn=args.apn,
        rate_plan=args.rate_plan
    )

    out_file = args.out
    if out_file:
        os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
        if out_file.endswith(".xlsx"):
            engine.export_to_excel(profiles, out_file)
        else:
            engine.export_to_csv(profiles, out_file)

    result = {
        "success": True,
        "count": len(profiles),
        "exported_file": out_file,
        "sample_profiles": [asdict(p) for p in profiles[:5]]
    }
    print(json.dumps(result, indent=2))
    return 0


def cmd_cdr_audit(args):
    engine = CdrRatingEngine()
    records = engine.generate_synthetic_cdr_sample(count=args.count)
    audit = engine.audit_cdr_batch(records)

    out_file = args.out
    if out_file:
        os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(audit, f, indent=2)

    result = {
        "success": True,
        "audit": audit,
        "exported_file": out_file
    }
    print(json.dumps(result, indent=2))
    return 0


def cmd_invoice_audit(args):
    reconciler = InvoiceReconciler()
    invoice = reconciler.generate_sample_invoice(account_name=args.account, total_sims=args.sims)
    audit = reconciler.reconcile_invoice(invoice)

    out_file = args.out
    if out_file:
        os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(audit, f, indent=2)

    result = {
        "success": True,
        "audit": audit,
        "exported_file": out_file
    }
    print(json.dumps(result, indent=2))
    return 0


def cmd_full_audit(args):
    # 1. Generate SIM fleet
    sim_engine = BulkSimEngine()
    sims = sim_engine.generate_batch(count=args.sims)

    # 2. Run CDR Rating Engine
    cdr_engine = CdrRatingEngine()
    cdrs = cdr_engine.generate_synthetic_cdr_sample(count=args.sims * 2)
    cdr_audit = cdr_engine.audit_cdr_batch(cdrs)

    # 3. Cross-reconcile Invoice
    reconciler = InvoiceReconciler()
    invoice = reconciler.generate_sample_invoice(total_sims=args.sims)
    invoice_audit = reconciler.reconcile_invoice(invoice, cdr_audit_summary=cdr_audit)

    full_report = {
        "timestamp": int(sys.modules["time"].time() * 1000),
        "fleet_sim_count": len(sims),
        "cdr_records_audited": len(cdrs),
        "cdr_audit_summary": cdr_audit["summary"],
        "cdr_service_breakdown": cdr_audit.get("service_breakdown", {}),
        "invoice_audit": invoice_audit,
        "reconciliation_verdict": invoice_audit["verdict"],
        "overall_status": "EXCELLENT" if invoice_audit["verdict"] == "PASSED" and cdr_audit["summary"]["accuracy_rate_pct"] >= 95.0 else "ATTENTION_REQUIRED"
    }

    out_file = args.out or "reports/python-audit/executive_telecom_audit.json"
    os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(full_report, f, indent=2)

    full_report["exported_file"] = out_file
    print(json.dumps(full_report, indent=2))
    return 0


def main():
    parser = argparse.ArgumentParser(description="IoT Hub Python Telecom Engine CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand: generate-sims
    p_sims = subparsers.add_parser("generate-sims", help="Generate bulk ISO/IEC 7812 Luhn SIMs")
    p_sims.add_argument("--count", type=int, default=50, help="Number of SIMs to generate")
    p_sims.add_argument("--esim-ratio", type=float, default=0.5, help="Ratio of eSIM vs Physical")
    p_sims.add_argument("--country", type=str, default="1", help="Country code")
    p_sims.add_argument("--issuer", type=str, default="404", help="Issuer ID")
    p_sims.add_argument("--apn", type=str, default="iot.carrier.com", help="APN group")
    p_sims.add_argument("--rate-plan", type=str, default="Enterprise-5G-Tier1", help="Rate plan")
    p_sims.add_argument("--out", type=str, default="reports/python-audit/bulk_sims.csv", help="Output path")
    p_sims.set_defaults(func=cmd_generate_sims)

    # Subcommand: cdr-audit
    p_cdr = subparsers.add_parser("cdr-audit", help="Audit CDR usage and rating math")
    p_cdr.add_argument("--count", type=int, default=150, help="Number of CDR records")
    p_cdr.add_argument("--out", type=str, default="reports/python-audit/cdr_audit.json", help="Output path")
    p_cdr.set_defaults(func=cmd_cdr_audit)

    # Subcommand: invoice-audit
    p_inv = subparsers.add_parser("invoice-audit", help="Audit invoice line items and tax")
    p_inv.add_argument("--account", type=str, default="Enterprise IoT Logistics Corp", help="Account name")
    p_inv.add_argument("--sims", type=int, default=100, help="Total active SIMs")
    p_inv.add_argument("--out", type=str, default="reports/python-audit/invoice_audit.json", help="Output path")
    p_inv.set_defaults(func=cmd_invoice_audit)

    # Subcommand: full-audit
    p_full = subparsers.add_parser("full-audit", help="Full end-to-end telecom rating & invoice audit")
    p_full.add_argument("--sims", type=int, default=100, help="Number of SIMs to simulate")
    p_full.add_argument("--out", type=str, default="reports/python-audit/executive_telecom_audit.json", help="Output path")
    p_full.set_defaults(func=cmd_full_audit)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
