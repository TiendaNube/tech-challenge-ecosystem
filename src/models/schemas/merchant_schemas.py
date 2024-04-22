# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for mechant schemas """

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class MerchantBaseSchema(BaseModel):
    name: str
    document: str


class CreateMerchantRequestSchema(MerchantBaseSchema):
    """ Request Creation merchant schema """


class CreateMerchantData(MerchantBaseSchema):
    """ Data Creation merchant schema """



class MerchantSchema(BaseModel):
    """Merchant Validation Schema"""
    id: int
    name: str
    document: str
    created_at: datetime
