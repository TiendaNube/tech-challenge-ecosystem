# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for transaction repository """

from logging import Logger
from ..infrastructure.postgres import PostgresConnection
from ..models.schemas.transaction_schemas import TransactionSchema, TransactionRequestCreateSchema


class TransactionRepository:
    """ Class for use with transaction repository """

    def __init__(self, conn: PostgresConnection, logger: Logger = None):
        self.conn = conn
        self.logger = logger

    async def get(self, transaction_id: int) -> TransactionSchema:
        """ Get one transaction by id on database """
        try:
            transaction_row = await self.conn.fetchrow(
                """ SELECT * FROM transactions WHERE id = $1; """,
                transaction_id)
            return TransactionSchema(**transaction_row)
        except Exception as err:
            if self.logger:
                self.logger.error('Error get transaction on database: %s', err)
        return None

    async def create(self, transaction_schema: TransactionRequestCreateSchema) -> int:
        """ Persisti a new transaction on database"""
        new_id: int = None
        try:
            async with self.conn.transaction():
                new_id = await self.conn.fetchval(
                    """
                    INSERT INTO transactions
                    (merchant_id, description, payment_method, card_number, card_owner,
                    card_expiration_date, card_cvv, amount)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id;
                    """,
                    transaction_schema.merchant_id,
                    transaction_schema.description,
                    transaction_schema.payment_method,
                    transaction_schema.card_number,
                    transaction_schema.card_owner,
                    transaction_schema.card_expiration_date,
                    transaction_schema.card_cvv,
                    transaction_schema.amount
                )
        except Exception as err:
            if self.logger:
                self.logger.error('Error creating transaction on database: %s', err)
        return new_id