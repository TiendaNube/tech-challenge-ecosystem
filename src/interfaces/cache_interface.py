# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Interface for cache service"""

from abc import ABC, abstractmethod


class CacheInterface(ABC):
    """Class for cache service interface"""
    @abstractmethod
    async def get(self, key: str) -> dict | str:
        """Get data from cache"""

    @abstractmethod
    async def set(self, key: str, value: dict | str, ttl: int = None) -> bool:
        """Set data on cache"""

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """Delete data on cache"""

    @abstractmethod
    async def healthcheck(self) -> bool:
        """ Check if connection is healthly """

    @abstractmethod
    async def close_conn(self) -> None:
        """Close all cache connections"""
