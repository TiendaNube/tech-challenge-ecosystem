# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" lifespan for web server for graceful """

from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from src.infrastructure.cache import Cache


@asynccontextmanager
async def lifespan(app: FastAPI):
    """ Lifespan function """
    # Include here a code to run before system up
    yield
    # Include here a code to run when system shutdown
    # use it for gracefully shutdown
    await app.dependencies.get(Cache).close_conn()
