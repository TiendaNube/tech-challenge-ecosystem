"""Simple payment processing utility."""

import hashlib
import json
import os
from datetime import datetime, timedelta


def mask_card_number(card_number: str) -> str:
    """Return only the last 4 digits of a card number."""
    if not card_number or len(card_number) < 4:
        raise ValueError("Invalid card number")
    return card_number[-4:]


def calculate_payable(amount: float, payment_method: str) -> dict:
    """Calculate payable based on payment method and fee rules."""
    fees = {"debit_card": 0.02, "credit_card": 0.04}

    if payment_method not in fees:
        raise ValueError(f"Unsupported payment method: {payment_method}")

    fee_rate = fees[payment_method]
    discount = round(amount * fee_rate, 2)
    total = round(amount - discount, 2)
    created_at = datetime.utcnow()

    if payment_method == "debit_card":
        status = "paid"
        payment_date = created_at
    else:
        status = "waiting_funds"
        payment_date = created_at + timedelta(days=30)

    return {
        "status": status,
        "create_date": created_at.isoformat(),
        "payment_date": payment_date.isoformat(),
        "subtotal": amount,
        "discount": discount,
        "total": total,
    }


def hash_sensitive_data(data: str) -> str:
    """Hash sensitive data using SHA-256."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def process_transaction(payload: dict) -> dict:
    """Process a transaction and return the created payable."""
    required_fields = [
        "merchant_id",
        "description",
        "payment_method",
        "card_number",
        "card_holder",
        "card_expiration",
        "card_cvv",
        "amount",
    ]

    for field in required_fields:
        if field not in payload:
            raise ValueError(f"Missing required field: {field}")

    amount = float(payload["amount"])
    if amount <= 0:
        raise ValueError("Amount must be positive")

    masked_card = mask_card_number(payload["card_number"])
    payable = calculate_payable(amount, payload["payment_method"])
    payable["merchant_id"] = payload["merchant_id"]

    return {
        "transaction": {
            "merchant_id": payload["merchant_id"],
            "description": payload["description"],
            "payment_method": payload["payment_method"],
            "card_number": masked_card,
            "card_holder": payload["card_holder"],
            "card_expiration": payload["card_expiration"],
            "amount": amount,
        },
        "payable": payable,
    }


if __name__ == "__main__":
    sample = {
        "merchant_id": "2441",
        "description": "T-Shirt Black/M",
        "payment_method": "credit_card",
        "card_number": "4111111111114338",
        "card_holder": "John Smith",
        "card_expiration": "12/2028",
        "card_cvv": "123",
        "amount": 100.00,
    }
    result = process_transaction(sample)
    print(json.dumps(result, indent=2))
