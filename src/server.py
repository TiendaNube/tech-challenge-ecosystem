# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Web server"""

from fastapi import FastAPI
from uvicorn import run

from src.lifespan import lifespan
from src.routes import healthcheck, readiness
from src.utils.configuration import AppConfig
from src.infrastructure.logger import get_logger
from src.infrastructure.cache import Cache
from src.utils.fastapi_injector import Injector
from src.infrastructure.postgres import PostgresConnection

logger = get_logger(AppConfig.FACILITY)
cache = Cache(logger=logger)

appOptions = {'lifespan': lifespan}
if AppConfig.is_production():
    appOptions.update({'docs_url': None, 'redoc_url': None})

app = FastAPI(**appOptions)
injector = Injector(app)
postgres_conn = PostgresConnection(logger=logger)
dependencies = [
    injector.add(cache),
    injector.add(logger),
    injector.add(postgres_conn)
]

# api_v1 = "/api/v1"
app.router.include_router(healthcheck.router)
app.router.include_router(readiness.router)
# app.include_router(currency_converter_router, prefix=api_v1)
# app.add_middleware(ResponseTimeMiddleware)

if __name__ == "__main__":
    run(
        app=app,
        host=AppConfig.SERVER_HOST,
        port=AppConfig.SERVER_PORT,
        reload=AppConfig.DEBUG,
        workers=AppConfig.SERVER_WORKERS,
    )
