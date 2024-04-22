# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for transaction repository """

from logging import Logger
from ..infrastructure.postgres import PostgresConnection
from ..models.schemas.transaction_schemas import TransactionSchema


class TransactionRepository:
    """ Class for use with transaction repository """

    def __init__(self, conn: PostgresConnection, logger: Logger = None):
        self.conn = conn
        self.logger = logger

    async def get(self, transaction_id: int) -> TransactionSchema:
        """ Get one transaction by id on database """
        try:
            transaction_row = await self.conn.fetchrow(' SELECT * FROM transactions WHERE id = $1 ', transaction_id)
            return TransactionSchema(**transaction_row)
        except Exception as err:
            if self.logger:
                self.logger.error('Error get transaction on database: %s', err)
        return None
