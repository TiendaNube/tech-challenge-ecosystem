# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Interface for cache service"""

from logging import Logger
import asyncpg
from ..utils.configuration import AppConfig
from ..interfaces.postgres_interface import PostgresConnInterface


class PostgresConnection(PostgresConnInterface):
    """Postgres Connection class"""

    def __init__(self, logger: Logger) -> None:
        super().__init__()
        self.logger: Logger = logger
        self.conn: asyncpg.Connection = None

    async def get_conn(self) -> asyncpg.Connection:
        """Get connection if exists else create one"""
        if self.conn is not None and not self.conn.is_closed():
            return self.conn
        self.conn = await asyncpg.connect(
            user=AppConfig.POSTGRES_USER,
            password=AppConfig.POSTGRES_PASSWORD,
            database=AppConfig.POSTGRES_DB,
            host=AppConfig.POSTGRES_HOST,
            port=AppConfig.POSTGRES_PORT
        )
        return self.conn

    async def close_conn(self) -> None:
        """Close connection"""
        try:
            if self.conn is not None and not self.conn.is_closed():
                await self.conn.close()
            self.logger.info('Closed Postgres Connection')
        except Exception as err:
            self.logger.error('Error closing postgres connection: %s', err)

    async def healthcheck(self) -> bool:
        result = False
        try:
            conn = await self.get_conn()
            await conn.execute('SELECT 1')
            result = True
        except Exception as err:
            self.logger.error('Postgres connection error: %s', err)
        return result
