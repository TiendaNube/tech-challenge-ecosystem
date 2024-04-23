# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Handler for incoming messages """

import json
from logging import Logger
from aio_pika.abc import AbstractIncomingMessage
from ..interfaces.message_handle_interface import MessageHandlerInterface
from ..models.schemas.message_schema import MessageBodySchema
from ..repositories.transaction_repository import TransactionRepository
from ..repositories.payable_repository import PayableRepository
from ..models.schemas.payable_schemas import CreatePayableRequestSchema
from ..models.enums.payments import PayableStatusEnum, PaymentsMethodEnum


class IncomingMessageHandler(MessageHandlerInterface):
    """Class handler for incoming messages"""

    def __init__(self,
                 transaction_repository: TransactionRepository,
                 payable_repository: PayableRepository,
                 logger: Logger = None):
        self.transaction_repository = transaction_repository
        self.payable_repository = payable_repository
        self.logger = logger

    async def process_message(self, message_body: MessageBodySchema) -> None:
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
        new_payable_id = await self.payable_repository.create(create_payable_schema)
        if self.logger:
            self.logger.info(
                'Payable ( %s ) created by transaction id ( %s )', new_payable_id, transaction.id)

    async def handle_message(self, message: AbstractIncomingMessage) -> None:
        async with message.process():
            message_body = MessageBodySchema(
                **json.loads(message.body))
            if self.logger:
                self.logger.info('Received new message with id: %s', message.message_id)
            await self.process_message(message_body)
