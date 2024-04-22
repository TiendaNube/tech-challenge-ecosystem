
from aio_pika import connect
from aio_pika.abc import AbstractChannel, AbstractQueue, AbstractIncomingMessage
from ..utils.configuration import AppConfig

# async def on_message(message: AbstractIncomingMessage) -> None:
#     """
#     on_message doesn't necessarily have to be defined as async.
#     Here it is to show that it's possible.
#     """
#     print(" [x] Received message %r" % message)
#     print("Message body is: %r" % message.body)

#     print("Before sleep!")
#     await asyncio.sleep(5)  # Represents async I/O operations
#     print("After sleep!")


class AmqpConsumer:
    async def __init__(self) -> None:
        self.connection = await connect(AppConfig.AMQP_URI)

    async def inicialize_consumer(self, queue_name: str, message_hander) -> None:
        """ Use for inicialize reader using a custom handler """
        async with self.connection:

            # Creating channel
            channel: AbstractChannel = await self.connection.channel()

            # Declaring queue
            queue: AbstractQueue = await channel.declare_queue(
                queue_name,
                auto_delete=True,
                durable=True
            )
            await queue.consume(message_hander, no_ack=True)
