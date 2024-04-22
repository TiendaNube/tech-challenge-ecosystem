# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for merchant repository """


from logging import Logger
from ..infrastructure.postgres import PostgresConnection
from ..models.schemas.merchant_schemas import MerchantSchema



class MerchantRepository:
    """ Class for use with merchant repository """

    def __init__(self, conn: PostgresConnection, logger: Logger = None):
        self.conn = conn
        self.logger = logger

    async def get(self, merchant_id: int) -> MerchantSchema:
        """ Get one merchant by id on database """
        try:
            merchant_row = await self.conn.fetchrow(' SELECT * FROM merchants WHERE id = $1 ', merchant_id)
            return MerchantSchema(**merchant_row)
        except Exception as err:
            if self.logger:
                self.logger.error('Error get merchant on database: %s', err)
        return None

    async def create(self, data: dict):
        """ Insert a new merchant on database """
        new_id = None
        try:
            async with self.conn.transaction():
                new_id = await self.conn.fetchval(
                    """
                    INSERT INTO merchants 
                    (name, document)
                    VALUES ($1, $2)
                    RETURNING id
                    """,
                    data.get('name'), data.get('document')
                )
        except Exception as err:
            self.logger.error('Error creating merchant on database: %s', err)
        return new_id
