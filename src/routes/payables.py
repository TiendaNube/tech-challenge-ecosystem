# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Router module usage for payable  """

import json
from logging import Logger
from datetime import date
from typing import Annotated
from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from starlette.status import (HTTP_201_CREATED, HTTP_200_OK,
                              HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY)
from ..infrastructure.postgres import PostgresConnection
from ..infrastructure.cache import Cache
from ..repositories.payable_repository import PayableRepository
from ..models.schemas.payable_schemas import SearchPayableRequestSchema, CreatePayableRequestSchema

router = APIRouter(tags=["Payable"], prefix="/payable")


@router.get("", response_class=JSONResponse, status_code=HTTP_200_OK)
async def get_payables_per_merchant_by_period(
    request: Request,
    merchant_id: Annotated[int, Query(gt=0)] ,
    from_date: Annotated[date, Query(example="2024-01-01")],
    to_date: Annotated[date, Query(example="2024-12-31")]
) -> JSONResponse:
    """ GET payables by merchant_id and period date """

    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    payable_repository = PayableRepository(conn=conn, logger=logger)
    search_schema = SearchPayableRequestSchema(
        merchant_id=merchant_id, from_date=from_date, to_date=to_date)
    result: list = {}
    summaries = await payable_repository.get_summary_by_merchant_per_period(**search_schema.model_dump())
    result.update(
        {"summary": [json.loads(summary.model_dump_json()) for summary in summaries]})
    payables = await payable_repository.get_payables_by_merchant_per_period(**search_schema.model_dump())
    if payables:
        status_code = HTTP_200_OK
        result.update(
            {'payables': [json.loads(payable.model_dump_json()) for payable in payables]})
    else:
        status_code = HTTP_404_NOT_FOUND
    return JSONResponse(content=result, status_code=status_code)


@router.get("/{payable_id}", response_class=JSONResponse, status_code=HTTP_200_OK)
async def get_payable_by_id(request: Request, payable_id: int) -> JSONResponse:
    """ Get payable by id """
    logger = request.app.dependencies.get(Logger)
    cache = request.app.dependencies.get(Cache)
    payable_cached = await cache.get(f"payable::{payable_id}")
    if payable_cached:
        logger.info('Returning payable %s from cache', payable_id)
    else:
        conn = await request.app.dependencies.get(PostgresConnection).get_conn()
        payable_repository = PayableRepository(conn=conn, logger=logger)
        payable = await payable_repository.get(payable_id)
        payable_cached = payable.model_dump_json()
        await cache.set(f"payable::{payable_id}", payable_cached)
        payable_cached = json.loads(payable_cached)
    status_code = HTTP_200_OK if payable_cached else HTTP_404_NOT_FOUND
    return JSONResponse(content=payable_cached, status_code=status_code)


@router.post("",
             response_class=JSONResponse,
             response_model=CreatePayableRequestSchema,
             status_code=HTTP_201_CREATED)
async def create_payable(request: Request, create_payable_schema: CreatePayableRequestSchema) -> JSONResponse:
    """ Create a new payable """
    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    payable_repository = PayableRepository(conn=conn, logger=logger)
    payable_id = await payable_repository.create(create_payable_schema)
    status_code = HTTP_201_CREATED if payable_id else HTTP_422_UNPROCESSABLE_ENTITY
    return JSONResponse(content={'payable_id': payable_id}, status_code=status_code)
