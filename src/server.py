# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Web server"""

from fastapi import FastAPI
from uvicorn import run

from src.lifespan import lifespan
from src.routes import healthcheck, readiness, merchant, transaction, payables
from src.utils.configuration import AppConfig
from src.infrastructure.logger import get_logger, get_log_level
from src.infrastructure.cache import Cache
from src.utils.fastapi_injector import Injector
from src.infrastructure.postgres import PostgresConnection
from src.middlewares.time_spent_middleware import ResponseTimeSpentMiddleware
from src.infrastructure.amqp_producer import AmqpProducer

appOptions = {
    'lifespan': lifespan,
    'log_level': 3,
    'debug': AppConfig.DEBUG
}

"""
If return of function `is_production` is True, swagger will be deactivated
"""
if AppConfig.is_production():
    appOptions.update({
        'docs_url': None,
        'redoc_url': None,
        'openapi_url': None
    })

app = FastAPI(**appOptions)
injector = Injector(app)

logger = get_logger(AppConfig.FACILITY)
postgres_conn = PostgresConnection(logger=logger)
cache = Cache(logger=logger)
amqp = AmqpProducer(logger)

dependencies = [
    injector.add(cache),
    injector.add(logger),
    injector.add(postgres_conn),
    injector.add(amqp)
]

app.router.include_router(healthcheck.router)
app.router.include_router(readiness.router)
app.router.include_router(merchant.router)
app.router.include_router(transaction.router)
app.router.include_router(payables.router)
app.add_middleware(ResponseTimeSpentMiddleware)

if __name__ == "__main__":
    run(
        app=app,
        log_level=get_log_level(),
        reload=True,
        host=AppConfig.WEB_SERVER_HOST,
        port=AppConfig.WEB_SERVER_PORT,
        workers=AppConfig.WEB_SERVER_WORKERS,
    )
