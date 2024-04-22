# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Router module usage for merchant  """

import json
from logging import Logger
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_404_NOT_FOUND
from ..infrastructure.postgres import PostgresConnection
# from ..middlewares.basic_authentication_middleware import BasicAuthenticationMiddleware
from ..repositories.merchant_repository import MerchantRepository
from ..models.schemas.merchant_schemas import CreateMerchantRequestSchema


router = APIRouter(tags=["Merchant"], prefix="/merchant")


# @router.post("")
# @safe_async_response
# async def create_merchant(request: Request, credentials=Depends(BasicAuthenticationMiddleware.get_credentials):
#     try:
#         body = await request.json()

@router.get("/{merchant_id}", response_class=JSONResponse, status_code=HTTP_200_OK)
async def get_merchant_by_id(request: Request, merchant_id: int):
    """ GET merchant by id """
    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    merchant_repository = MerchantRepository(conn=conn, logger=logger)
    merchant = await merchant_repository.get(merchant_id=merchant_id)
    status_code = HTTP_200_OK if merchant else HTTP_404_NOT_FOUND
    return JSONResponse(
        content=json.loads(merchant.model_dump_json()),
        status_code=status_code
    )


@router.post("/",
             status_code=HTTP_201_CREATED,
             response_class=JSONResponse,
             response_model=CreateMerchantRequestSchema
             )
async def create_merchant(request: Request, create_merchant_schema: CreateMerchantRequestSchema):
    """ Create a new merchant """
    logger = request.app.dependencies.get(Logger)
    conn = await request.app.dependencies.get(PostgresConnection).get_conn()
    merchant_repository = MerchantRepository(conn=conn, logger=logger)
    merchant_id = await merchant_repository.create(create_merchant_schema.model_dump())
    status_code = HTTP_201_CREATED if merchant_id else HTTP_404_NOT_FOUND
    return JSONResponse(
        content={'merchant_id': merchant_id},
        status_code=status_code
    )
