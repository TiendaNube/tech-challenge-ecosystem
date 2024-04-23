# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Router module usage for transaction  """

import json
from logging import Logger
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from starlette.status import (HTTP_201_CREATED,
                              HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY)
from src.utils.configuration import AppConfig
from ..infrastructure.postgres import PostgresConnection
from ..infrastructure.cache import Cache
from ..repositories.transaction_repository import TransactionRepository
from ..models.schemas.transaction_schemas import TransactionRequestCreateSchema
from ..infrastructure.amqp_producer import AmqpProducer, MessageBodySchema

router = APIRouter(tags=["Transaction"], prefix="/transaction")


@router.get("/{transaction_id}",
            status_code=HTTP_200_OK,
            response_class=JSONResponse)
async def get_transaction_by_id(request: Request, transaction_id: int) -> JSONResponse:
    """ GET transaction by id """
    logger = request.app.dependencies.get(Logger)
    cache = request.app.dependencies.get(Cache)
    transaction_cached = await cache.get(f'transacion::{transaction_id}')
    if not transaction_cached:
        conn = await request.app.dependencies.get(PostgresConnection).get_conn()
        transaction_repository = TransactionRepository(conn=conn, logger=logger)
        transaction = await transaction_repository.get(transaction_id=transaction_id)
        if transaction:
            transaction_cached = transaction.model_dump_json(by_alias=True)
            await cache.set(f'transacion::{transaction_id}', transaction_cached)
            transaction_cached = json.loads(transaction_cached)
    status_code = HTTP_200_OK if transaction else HTTP_404_NOT_FOUND
    return JSONResponse(
        content=transaction_cached,
        media_type='json',
        status_code=status_code
    )


@router.post("",
             status_code=HTTP_201_CREATED,
             response_class=JSONResponse,
             response_model=TransactionRequestCreateSchema
             )
async def create_transaction(request: Request, transaction_schema: TransactionRequestCreateSchema) -> JSONResponse:
    """ Create a new transaction """
    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    transaction_repo = TransactionRepository(conn=conn, logger=logger)
    transaction_id = await transaction_repo.create(transaction_schema)
    amqp = request.app.dependencies.get(AmqpProducer)
    message = MessageBodySchema(transaction_id=transaction_id, payment_method=transaction_schema.payment_method)
    await amqp.send_message(message, AppConfig.AMQP_QUEUE)
    status_code = HTTP_201_CREATED if transaction_id else HTTP_422_UNPROCESSABLE_ENTITY
    return JSONResponse(content={'transaction_id': transaction_id}, status_code=status_code)
