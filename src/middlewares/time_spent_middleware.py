# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Middleware returns on log a time elapsed for requests """

from logging import Logger
from time import time
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from fastapi import Request, Response


class ResponseTimeSpentMiddleware(BaseHTTPMiddleware):
    """
    This class middleware returns on log a time elapsed for requests 
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time()
        response = await call_next(request)
        elapsed_time = round(time() - start_time, 3)
        logger = request.app.dependencies.get(Logger)
        logger.info("%s %s | status: %s | elapsed_time: %s",
                    request.method,
                    request.url.path,
                    response.status_code,
                    elapsed_time,
                    extra={"elapsed_time": elapsed_time}
                    )

        return response
