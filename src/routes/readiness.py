# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" readiness to verify a server and external dependencies are healthy """

from json import dumps
from fastapi import APIRouter, Response
from starlette.requests import Request
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from ..infrastructure.cache import Cache
from ..infrastructure.postgres import PostgresConnection

router = APIRouter(tags=["Health"], prefix="")


@router.get("/readiness")
async def readiness(request: Request):
    """ Check external dependencies are healthy """
    # Get external dependencies health
    redis_ready: bool = await request.app.dependencies.get(Cache).healthcheck()
    postgres_ready: bool = await request.app.dependencies.get(PostgresConnection).healthcheck()

    # Check if all external dependencies are healthy in one variable
    ready_status: bool = redis_ready and postgres_ready

    status_code = HTTP_200_OK if ready_status else HTTP_400_BAD_REQUEST
    return Response(
        content=dumps({"status": "Ready" if ready_status else "Not Ready"}),
        media_type="json",
        status_code=status_code,
    )
