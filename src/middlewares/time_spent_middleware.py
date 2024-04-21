# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Middleware returns on log a time elapsed for requests  """

from logging import Logger
from time import time

from starlette.middleware.base import (
    BaseHTTPMiddleware,
    RequestResponseEndpoint,
)
from starlette.requests import Request
from starlette.responses import Response


class ResponseTimeSpentMiddleware(BaseHTTPMiddleware):
    """
    This class middleware returns on log a time elapsed for requests 
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        initial_time = time()
        response = await call_next(request)
        final_time = time() - initial_time
        elapsed_time = round(final_time, 3)
        msg = f"{request.method}-{request.url.path} - Response: {elapsed_time}"
        logger = request.app.dependencies.get(Logger)
        logger.info(msg, extra={"elapsed_time": elapsed_time})

        return response
