# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Router module usage for transaction  """

from logging import Logger
from fastapi import APIRouter, Request, Response
from starlette.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_404_NOT_FOUND
from ..infrastructure.postgres import PostgresConnection
from ..repositories.transaction_repository import TransactionRepository
from ..models.schemas.transaction_schemas import CreateTransactionRequestSchema

router = APIRouter(tags=["Transaction"], prefix="/transaction")

@router.get("/{transaction_id}")
async def get_transaction_by_id(request: Request, transaction_id: int):
    """ GET transaction by id """
    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    transaction_repository = TransactionRepository(conn=conn, logger=logger)
    transaction = await transaction_repository.get(transaction_id=transaction_id)
    status_code = HTTP_200_OK if transaction else HTTP_404_NOT_FOUND
    return Response(
        content=transaction.model_dump_json(by_alias=True),
        media_type='json',
        status_code=status_code
    )
