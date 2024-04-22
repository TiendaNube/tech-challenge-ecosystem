# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for payments enums """

from enum import Enum


class PaymentsMethodEnum(str, Enum):
    """ Enum for Payments method """
    DEBIT_CARD: str = 'debit_card'
    CREDIT_CARD: str = 'credit_card'

    @staticmethod
    def list():
        """Convert enum class to list"""
        enum_list = list(map(lambda c: c.value, PaymentsMethodEnum))
        return enum_list


class PayableDaysForPayEnum(int, Enum):
    """ Enum for payment status """
    PAID: int = 0
    WAITING_FUNDS: int = 30

    @staticmethod
    def list():
        """Convert enum class to list"""
        enum_list = list(map(lambda c: c.value, PayableDaysForPayEnum))
        return enum_list


class PayableStatusEnum(str, Enum):
    """ Enum for payment status """
    PAID: str = 'paid'
    WAITING_FUNDS: str = 'waiting_funds'

    @staticmethod
    def list():
        """Convert enum class to list"""
        enum_list = list(map(lambda c: c.value, PayableStatusEnum))
        return enum_list


class PayableDiscountEnum(str, Enum):
    """ Enum for calc discount """
    DEBIT_CARD: float = 0.02
    CREDIT_CARD: float = 0.04

    @staticmethod
    def list():
        """Convert enum class to list"""
        enum_list = list(map(lambda c: c.value, PayableDiscountEnum))
        return enum_list
