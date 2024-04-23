# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for transaction schemas """

from typing import Optional
from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, Field, AliasChoices
from ..enums.payments import PaymentsMethodEnum


class TransactionSchemaBase(BaseModel):
    """ Transaction base schema """
    merchant_id: int
    description: Optional[str]
    payment_method: PaymentsMethodEnum
    card_number: str = Field(max_length=4)
    card_owner: str = Field(serialization_alias='card_holder',
                            validation_alias=AliasChoices('card_holder', 'card_owner'))
    card_expiration_date: date
    card_cvv: str = Field(max_length=3)
    amount: Decimal = Field(decimal_places=2)


class TransactionRequestCreateSchema(TransactionSchemaBase):
    """ Request creation transaction schema """

class TransactionSchema(TransactionSchemaBase):
    """Transaction Validation Schema"""
    id: int
    created_at: datetime
