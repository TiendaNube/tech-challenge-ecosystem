# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module schemas for incoming messages """

from pydantic import BaseModel, Field
from ..enums.payments import PaymentsMethodEnum


class MessageBodySchema(BaseModel):
    """ Incoming message schema validator"""
    transaction_id: int = Field(gt=0)
    payment_method: PaymentsMethodEnum
