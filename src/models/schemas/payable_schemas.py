# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for payable schemas """

from datetime import datetime, timedelta
from decimal import Decimal
from pydantic import BaseModel, Field, AliasChoices, computed_field
from ..enums.payments import PayableStatusEnum, PayableDiscountEnum, PayableDaysForPayEnum

TWOPLACES = Decimal(10) ** -2


class SearchPayableRequestSchema(BaseModel):
    """ Request creation transaction schema """
    merchant_id: int = Field(gt=0)
    from_date: datetime
    to_date: datetime


class PayableSchema(BaseModel):
    """Payable repository Schema"""
    id: int
    transaction_id: int
    merchant_id: int
    status: PayableStatusEnum
    create_date: datetime
    subtotal: Decimal = Field(
        decimal_places=2, validation_alias=AliasChoices('amount', 'subtotal'))
    discount_fee: Decimal = Field(
        decimal_places=2, serialization_alias='discount',
        validation_alias=AliasChoices('fee', 'discount_fee', "discount")
    )
    total: Decimal = Field(decimal_places=2)
    created_at: datetime = Field(exclude=True)

    @computed_field
    @property
    def discount_calculated(self) -> Decimal:
        """ Calculate total with subtotal - discount_fee """
        discount_fee = PayableDiscountEnum.CREDIT_CARD if self.status == PayableStatusEnum.WAITING_FUNDS else PayableDiscountEnum.DEBIT_CARD
        return Decimal(self.subtotal * Decimal(discount_fee)).quantize(TWOPLACES)

    @computed_field
    @property
    def total_calculated(self) -> Decimal:
        """ Calculate total with subtotal - discount_fee """
        return Decimal(self.subtotal - self.discount_calculated).quantize(TWOPLACES)


class PayableSummarySchema(BaseModel):
    """Payable summary repositry schema"""
    status: PayableStatusEnum
    subtotal: Decimal = Field(decimal_places=2, alias='amount',
                              serialization_alias='subtotal',
                              validation_alias=AliasChoices('amount', 'subtotal'))
    discount: Decimal = Field(alias='fee',
                              decimal_places=2, serialization_alias='discount',
                              validation_alias=AliasChoices('fee', 'discount_fee', "discount"))

    @computed_field
    @property
    def total(self) -> Decimal:
        """ Calculate total with subtotal - discount_fee """
        return self.subtotal - self.discount


class CreatePayableRequestSchema(BaseModel):
    """Payable creation schema"""
    transaction_id: int
    merchant_id: int
    status: PayableStatusEnum
    subtotal: Decimal = Field(
        decimal_places=2, validation_alias=AliasChoices('amount', 'subtotal'))

    @computed_field
    @property
    def create_date(self) -> datetime:
        """ Calculate total with subtotal - discount_fee """
        days = PayableDaysForPayEnum.PAID if self.status == PayableStatusEnum.PAID else PayableDaysForPayEnum.WAITING_FUNDS
        return datetime.now() + timedelta(days=days)

    @computed_field
    @property
    def discount_fee(self) -> float:
        """ Calculate total with subtotal - discount_fee """
        discount_fee = PayableDiscountEnum.CREDIT_CARD if self.status == PayableStatusEnum.WAITING_FUNDS else PayableDiscountEnum.DEBIT_CARD
        return Decimal(self.subtotal * Decimal(discount_fee)).quantize(TWOPLACES)

    @computed_field
    @property
    def total(self) -> float:
        """ Calculate total with subtotal - discount_fee """
        return Decimal(self.subtotal - self.discount_fee).quantize(TWOPLACES)
