# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Load environment variables and populate a class for app configuration"""

from decouple import config


class AppConfig:
    """ Class for app configuration """
    DEBUG = config('DEBUG', default=False, cast=bool)
    ENVIRONMENT = config('ENVIRONMENT', default='production', cast=str)
    LOG_LEVEL = config('LOG_LEVEL', default='INFO', cast=str)
    FACILITY = config('FACILITY', default='payables', cast=str)
    WEB_SERVER_PORT = config('WEB_SERVER_PORT', default=8001, cast=int)
    WEB_SERVER_HOST = config('WEB_SERVER_HOST', default='0.0.0.0', cast=str)
    WEB_SERVER_WORKERS = config('WEB_SERVER_WORKERS', default=1, cast=int)
    REDIS_URI = config(
        'REDIS_URI', default='redis://redis?decode_responses=True&max_connections=10', cast=str)
    POSTGRES_USER = config('POSTGRES_USER', cast=str)
    POSTGRES_PASSWORD = config('POSTGRES_PASSWORD', cast=str)
    POSTGRES_DB = config('POSTGRES_DB', default='payable_db', cast=str)
    POSTGRES_HOST = config('POSTGRES_HOST', default='postgres', cast=str)
    POSTGRES_PORT = config('POSTGRES_PORT', default=5432, cast=int)

    @staticmethod
    def is_production():
        """
            Check if is a prodution environment
            How: env ENVIRONMENT is equal a `production` and env DEBUG is `False`
        """
        return AppConfig.ENVIRONMENT.lower() == "production" and not AppConfig.DEBUG
