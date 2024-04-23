# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Worker for message consume"""

import asyncio
from src.utils.configuration import AppConfig
from src.infrastructure.amqp_consumer import AmqpConsumer
from src.infrastructure.postgres import PostgresConnection
from src.handlers.message_handler import IncomingMessageHandler
from src.infrastructure.logger import get_logger
from src.repositories.transaction_repository import TransactionRepository
from src.repositories.payable_repository import PayableRepository

logger = get_logger(f'{AppConfig.FACILITY}-worker')

async def main() -> None:
    """Main function for call courotines """
    consumer = AmqpConsumer(logger)
    postgres_conn = await PostgresConnection(logger=logger).get_conn()
    transaction_repo = TransactionRepository(postgres_conn, logger)
    payable_repo = PayableRepository(postgres_conn, logger)
    message_handler = IncomingMessageHandler(transaction_repo, payable_repo, logger)
    await consumer.inicialize_consumer(AppConfig.AMQP_QUEUE, message_handler)

if __name__ == '__main__':
    asyncio.run(main())
