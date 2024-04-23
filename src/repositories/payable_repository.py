# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for payable repository """

from logging import Logger
from datetime import datetime
from ..infrastructure.postgres import PostgresConnection
from ..models.schemas.payable_schemas import PayableSchema, PayableSummarySchema, CreatePayableRequestSchema


class PayableRepository:
    """ Class for use with payable repository """

    def __init__(self, conn: PostgresConnection, logger: Logger = None):
        self.conn = conn
        self.logger = logger

    async def get_payables_by_merchant_per_period(
        self,
        merchant_id: str,
        from_date: datetime,
        to_date: datetime
    ) -> list[PayableSchema]:
        """ Get all payables by merchant_id per period on database """
        try:
            self.logger.debug(
                f'merchant_id: {merchant_id}, from_date: {from_date}, to_date: {to_date}')
            payables = await self.conn.fetch(
                """
                    SELECT * FROM payables
                    WHERE  merchant_id = $1
                    AND create_date BETWEEN $2 AND $3
                """,
                merchant_id,
                from_date,
                to_date
            )
            payables = [PayableSchema(**payable) for payable in payables]
            self.logger.debug(payables)
            return payables
        except Exception as err:
            if self.logger:
                self.logger.error('Error get payables on database: %s', err)
        return None

    async def get_summary_by_merchant_per_period(
        self,
        merchant_id: str,
        from_date: datetime,
        to_date: datetime
    ) -> list[PayableSummarySchema]:
        """ Get summary payables by merchant_id per period on database """
        try:
            self.logger.debug(
                f'merchant_id: {merchant_id}, from_date: {from_date}, to_date: {to_date}')
            summaries = await self.conn.fetch(
                """
            SELECT status, SUM(subtotal) AS amount, SUM(discount_fee) AS fee
            FROM payables p
            WHERE merchant_id = $1
            AND create_date between $2 AND $3
            GROUP BY status;
                """,
                merchant_id,
                from_date,
                to_date
            )
            self.logger.debug(summaries)
            summaries = [PayableSummarySchema(
                **summary) for summary in summaries]
            return summaries
        except Exception as err:
            if self.logger:
                self.logger.error(
                    'Error get summary payables on database: %s', err)
        return None

    async def get(self, payable_id: int) -> PayableSchema:
        """ Get one payable by id on database """
        try:
            payable_row = await self.conn.fetchrow(' SELECT * FROM payables WHERE id = $1; ', payable_id)
            return PayableSchema(**payable_row)
        except Exception as err:
            if self.logger:
                self.logger.error(
                    'Error get payable id %s on database: %s', payable_id, err)
        return None

    async def create(self, create_schema: CreatePayableRequestSchema) -> int:
        """ Get one payable by id on database """
        new_id = None
        try:
            async with self.conn.transaction():
                new_id = await self.conn.fetchval(
                    """
                    INSERT INTO payables 
                    (transaction_id, merchant_id, status, create_date, subtotal, discount_fee, total)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
                    """,
                    create_schema.transaction_id,
                    create_schema.merchant_id,
                    create_schema.status,
                    create_schema.create_date,
                    create_schema.subtotal,
                    create_schema.discount_fee,
                    create_schema.total
                )
        except Exception as err:
            if self.logger:
                self.logger.error('Error creating a payable: %s', err)
        return new_id
