# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Interface for message service handler"""

from abc import ABC, abstractmethod
from aio_pika.abc import AbstractIncomingMessage
from ..models.schemas.message_schema import MessageBodySchema


class MessageHandlerInterface(ABC):
    """Class for message handler interface"""
    @abstractmethod
    async def process_message(self, message_body: MessageBodySchema) -> None:
        """Process messages body"""
    @abstractmethod
    async def handle_message(self, message: AbstractIncomingMessage) -> None:
        """Handle message waiting process"""
