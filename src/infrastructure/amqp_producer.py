# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Module for AMQP producer messages """

from logging import Logger
from aio_pika import Message, connect
from ..utils.configuration import AppConfig
from ..models.schemas.message_schema import MessageBodySchema


class AmqpProducer:
    """ Amqp Producer """

    def __init__(self, logger: Logger = None) -> None:
        self.connection = None
        self.logger = logger

    async def send_message(self, message: MessageBodySchema, queue: str) -> None:
        """ Send message to AMQP server """
        # Perform connection
        if not self.connection or self.connection.is_closed:
            self.connection = await connect(AppConfig.AMQP_URI)

        async with self.connection:
            # Creating a channel
            channel = await self.connection.channel()

            # Declaring queue
            queue = await channel.declare_queue(queue, durable=True, auto_delete=True)

            # Sending the message
            await channel.default_exchange.publish(
                Message(message.model_dump_json().encode()),
                routing_key=queue.name,
            )
            if self.logger:
                self.logger.info('Send message to AMQP')
