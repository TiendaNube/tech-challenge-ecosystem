# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" readiness to verify a server and external dependencies are healthy """

from json import dumps
from fastapi import APIRouter, Response
from starlette.requests import Request
from ..infrastructure.cache import Cache
from ..infrastructure.postgres import PostgresConnection

router = APIRouter(tags=["Readiness"], prefix="/readiness")


@router.get("")
async def readiness(request: Request):
    """ Check external dependencies are healthy """
    redis_ready = await request.app.dependencies.get(Cache).healthcheck()
    postgres_ready = await request.app.dependencies.get(PostgresConnection).healthcheck()
    ready = redis_ready and postgres_ready
    status_code = 200 if ready else 400
    return Response(
        content=dumps({"Status": "Ready" if ready else "Not Ready"}),
        media_type="json",
        status_code=status_code,
    )
