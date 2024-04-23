# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Interface for request handlers"""

from abc import ABC, abstractmethod
from typing import Any, Union
from fastapi import Request, Response


class RequestHandlerInterface(ABC):
    """Class to map interface for request handlers"""

    @abstractmethod
    async def set_next(self, handler: Any) -> Any:
        """ Function defines next handler """

    @abstractmethod
    async def handle(self, request: Union[Request, Response]) -> Union[Request, Response]:
        """ Function to handle request"""
