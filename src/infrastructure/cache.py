# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Module providing a class for use redis."""

import json
from logging import Logger
import redis.asyncio as redis
from ..interfaces.cache_interface import CacheInterface
from ..utils.configuration import AppConfig


class Cache(CacheInterface):
    """ Class for use redis cache server """

    def __init__(self, logger: Logger) -> None:
        self.pool = redis.ConnectionPool.from_url(AppConfig.REDIS_URI)
        self.client = redis.Redis.from_pool(self.pool)
        self.logger = logger

    async def get(self, key: str) -> str | dict:
        """ Get data in a key on redis cache server """
        value = None
        try:
            value: str = await self.client.get(key)
            if value:
                value = json.loads(value)
        except json.decoder.JSONDecodeError as err:
            self.logger.debug(
                'Error parsing value of %s to dict. Error: %s', key, err)
        except Exception as err:
            self.logger.error(
                'Error getting key %s from redis. Error: %s', key, err)
        return value

    async def set(self, key: str, value: str | dict, ttl: int = None) -> bool:
        """ Set data in a key on redis cache server """
        try:
            if isinstance(value, dict):
                value = json.dumps(value)
            await self.client.set(
                key,
                value,
                ex=ttl
            )
            return True
        except Exception as err:
            self.logger.error('Error setting key %s on cache: %s', key, err)
        return False

    async def delete(self, key: str) -> bool:
        """ Delete data in a key on redis cache server """
        try:
            await self.client.delete(key)
            return True
        except Exception as err:
            self.logger.error('Error deleting key %s on cache: %s', key, err)
        return False

    async def healthcheck(self) -> bool:
        """ Check if connection is healthly """
        result = False
        try:
            result = await self.client.ping()
        except Exception as err:
            self.logger.error('Redis connection error: %s', err)
        return result

    async def close_conn(self) -> None:
        """ Close all active connections for gracefull shutdown """
        await self.client.aclose()
        await self.pool.aclose()
