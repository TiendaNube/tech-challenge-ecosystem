import asyncio
from logging import Logger
from aio_pika import connect
from aio_pika.abc import AbstractChannel, AbstractQueue
from ..utils.configuration import AppConfig
from ..interfaces.message_handle_interface import MessageHandlerInterface



class AmqpConsumer:
    """ Amqp Consumer """

    def __init__(self, logger: Logger = None) -> None:
        self.connection = None
        self.logger = logger

    async def inicialize_consumer(self, queue_name: str, message_hander: MessageHandlerInterface) -> None:
        """ Use for inicialize reader using a custom handler """
        if not self.connection:
            self.connection = await connect(AppConfig.AMQP_URI)
        self.logger.info('AMQP Consumer inicialized')
        async with self.connection:
            # Creating channel
            channel: AbstractChannel = await self.connection.channel()
            # Declaring queue
            queue: AbstractQueue = await channel.declare_queue(
                queue_name,
                auto_delete=True,
                durable=True
            )
            # Consume messages
            await queue.consume(message_hander.handle_message, no_ack=False)
            await asyncio.Future()
