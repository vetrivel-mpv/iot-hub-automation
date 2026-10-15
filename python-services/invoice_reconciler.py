#!/usr/bin/env python3
"""
IoT Hub Enterprise Automation - Enterprise Invoice & Billing Ledger Reconciler
Audits enterprise invoice line items against telecom rating ledgers:
- Subtotal mathematical checksum
- Tiered tax (VAT / GST) calculation verification
- Credit notes & account discounts balance verification
- Cross-reconciliation against rated CDR usage totals
- Generates executive reconciliation certificates
"""

import json
import os
import sys
import time
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False


@dataclass
class InvoiceLineItem:
    item_id: str
    description: str
    category: str  # 'RECURRING_FEE' | 'DATA_USAGE' | 'VOICE_USAGE' | 'SMS_USAGE' | 'DEVICE_FEE'
    quantity: float
    unit_price: float
    total_amount: float
    cdr_usage_reference: Optional[str] = None


@dataclass
class EnterpriseInvoice:
    invoice_id: str
    account_id: str
    account_name: str
    billing_period: str
    currency: str
    line_items: List[InvoiceLineItem] = field(default_factory=list)
    subtotal: float = 0.0
    tax_rate_pct: float = 18.0  # 18% VAT/GST
    tax_amount: float = 0.0
    discounts_credit_notes: float = 0.0
    total_due: float = 0.0


class InvoiceReconciler:
    def __init__(self, tolerance: float = 0.02):
        self.tolerance = tolerance  # $0.02 acceptable rounding threshold

    def reconcile_invoice(self, invoice: EnterpriseInvoice, cdr_audit_summary: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Audits an enterprise invoice against mathematical formulas and CDR usage ledger."""
        discrepancies = []

        # 1. Line Items Sum Check
        computed_subtotal = round(sum(item.total_amount for item in invoice.line_items), 2)
        subtotal_delta = round(invoice.subtotal - computed_subtotal, 2)
        if abs(subtotal_delta) > self.tolerance:
            discrepancies.append({
                "type": "SUBTOTAL_MISMATCH",
                "message": f"Invoice subtotal ({invoice.currency} {invoice.subtotal}) does not match sum of line items ({invoice.currency} {computed_subtotal})",
                "delta": subtotal_delta
            })

        # 2. Tax Calculation Check
        computed_tax = round(computed_subtotal * (invoice.tax_rate_pct / 100.0), 2)
        tax_delta = round(invoice.tax_amount - computed_tax, 2)
        if abs(tax_delta) > self.tolerance:
            discrepancies.append({
                "type": "TAX_CALCULATION_ERROR",
                "message": f"Tax amount ({invoice.currency} {invoice.tax_amount}) does not match {invoice.tax_rate_pct}% of subtotal ({invoice.currency} {computed_tax})",
                "delta": tax_delta
            })

        # 3. Total Due Check
        computed_total_due = round(computed_subtotal + computed_tax - invoice.discounts_credit_notes, 2)
        total_delta = round(invoice.total_due - computed_total_due, 2)
        if abs(total_delta) > self.tolerance:
            discrepancies.append({
                "type": "TOTAL_DUE_MISMATCH",
                "message": f"Total due ({invoice.currency} {invoice.total_due}) does not equal subtotal + tax - discounts ({invoice.currency} {computed_total_due})",
                "delta": total_delta
            })

        # 4. Cross-Reconciliation against Rated CDR Ledger (if provided)
        cdr_reconciliation = None
        if cdr_audit_summary and "summary" in cdr_audit_summary:
            expected_usage_total = cdr_audit_summary["summary"].get("total_expected", 0.0)
            invoice_usage_total = sum(
                item.total_amount for item in invoice.line_items
                if item.category in ("DATA_USAGE", "VOICE_USAGE", "SMS_USAGE")
            )
            usage_delta = round(invoice_usage_total - expected_usage_total, 2)
            cdr_reconciliation = {
                "cdr_expected_usage_total": expected_usage_total,
                "invoice_billed_usage_total": round(invoice_usage_total, 2),
                "usage_delta": usage_delta,
                "match": abs(usage_delta) <= (self.tolerance * 10)
            }
            if not cdr_reconciliation["match"]:
                discrepancies.append({
                    "type": "CDR_LEDGER_MISMATCH",
                    "message": f"Billed usage ({invoice.currency} {invoice_usage_total}) differs from raw CDR rating ledger ({invoice.currency} {expected_usage_total})",
                    "delta": usage_delta
                })

        verdict = "PASSED" if len(discrepancies) == 0 else "FAILED"

        return {
            "invoice_id": invoice.invoice_id,
            "account_id": invoice.account_id,
            "account_name": invoice.account_name,
            "billing_period": invoice.billing_period,
            "currency": invoice.currency,
            "verdict": verdict,
            "audit_timestamp": int(time.time() * 1000),
            "verified_values": {
                "reported_subtotal": invoice.subtotal,
                "computed_subtotal": computed_subtotal,
                "reported_tax": invoice.tax_amount,
                "computed_tax": computed_tax,
                "discounts_applied": invoice.discounts_credit_notes,
                "reported_total_due": invoice.total_due,
                "computed_total_due": computed_total_due,
            },
            "discrepancies_count": len(discrepancies),
            "discrepancies": discrepancies,
            "cdr_cross_reconciliation": cdr_reconciliation
        }

    def generate_sample_invoice(self, account_name: str = "Enterprise IoT Logistics Corp", total_sims: int = 250) -> EnterpriseInvoice:
        """Generates a realistic enterprise invoice for testing."""
        recurring_fee = total_sims * 5.00   # $5/SIM active maintenance fee
        data_usage = round(total_sims * 18.50, 2)
        voice_usage = round(total_sims * 2.10, 2)
        sms_usage = round(total_sims * 0.85, 2)

        items = [
            InvoiceLineItem("LI-01", f"Active SIM Fleet Service Fee ({total_sims} endpoints)", "RECURRING_FEE", total_sims, 5.00, recurring_fee),
            InvoiceLineItem("LI-02", "Aggregated 5G Enterprise Data Usage (High-Volume Tier)", "DATA_USAGE", total_sims, 18.50, data_usage),
            InvoiceLineItem("LI-03", "Voice Operational Minutes", "VOICE_USAGE", total_sims, 2.10, voice_usage),
            InvoiceLineItem("LI-04", "Machine-to-Machine SMS Signaling Units", "SMS_USAGE", total_sims, 0.85, sms_usage),
        ]

        subtotal = round(sum(i.total_amount for i in items), 2)
        tax_rate = 18.0
        tax = round(subtotal * (tax_rate / 100.0), 2)
        discount = 150.00  # Loyalty discount
        total = round(subtotal + tax - discount, 2)

        return EnterpriseInvoice(
            invoice_id=f"INV-{int(time.time())}",
            account_id="ACC-ENTERPRISE-001",
            account_name=account_name,
            billing_period="2026-10-01 to 2026-10-31",
            currency="USD",
            line_items=items,
            subtotal=subtotal,
            tax_rate_pct=tax_rate,
            tax_amount=tax,
            discounts_credit_notes=discount,
            total_due=total
        )


if __name__ == "__main__":
    reconciler = InvoiceReconciler()
    sample_inv = reconciler.generate_sample_invoice()
    result = reconciler.reconcile_invoice(sample_inv)
    print(json.dumps(result, indent=2))
