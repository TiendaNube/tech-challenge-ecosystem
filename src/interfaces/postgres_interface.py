# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Interface for postgres database service"""

from abc import ABC, abstractmethod

class PostgresConnInterface(ABC):
    """Class for postgres database interface"""
    @abstractmethod
    async def get_conn(self) -> any:
        """Get a postgres connection"""

    @abstractmethod
    async def close_conn(self) -> None:
        """Close a postgres connection"""
    
    @abstractmethod
    async def healthcheck(self) -> bool:
        """ Check if connection is healthly """
