# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Handler for incoming messages """

import json
from aio_pika.abc import AbstractIncomingMessage
from ..interfaces.message_handle_interface import MessageHandlerInterface
from ..models.schemas.incoming_message_schema import IncomingMessageBodySchema
from ..infrastructure.postgres import PostgresConnection
from ..repositories.transaction_repository import TransactionRepository
from ..repositories.payable_repository import PayableRepository
from ..models.schemas.payable_schemas import CreatePayableRequestSchema
from ..models.enums.payments import PayableStatusEnum, PaymentsMethodEnum


class IncomingMessageHandler(MessageHandlerInterface):
    """Class handler for incoming messages"""

    async def __init__(self,
                       conn: PostgresConnection,
                       transaction_repository: TransactionRepository,
                       payable_repository: PayableRepository):
        self.conn = conn
        self.transaction_repository = transaction_repository
        self.payable_repository = payable_repository

    async def process_message(self, message_body: IncomingMessageBodySchema) -> None:
        transaction = await self.transaction_repository.get(message_body.transaction_id)
        if transaction.payment_method == PaymentsMethodEnum.DEBIT_CARD:
            payable_status = PayableStatusEnum.PAID
        else:
            payable_status = PayableStatusEnum.WAITING_FUNDS

        create_payable_schema = CreatePayableRequestSchema(
            transaction_id=transaction.id,
            merchant_id=transaction.merchant_id,
            status=payable_status,
            subtotal=transaction.amount
        )
        await self.payable_repository.create(create_payable_schema)

    async def handle_message(self, message: AbstractIncomingMessage) -> None:
        async with message.process():
            message_body = IncomingMessageBodySchema(
                **json.loads(message.body))
            await self.process_message(message_body)
