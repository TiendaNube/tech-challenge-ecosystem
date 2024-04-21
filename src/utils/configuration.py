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
    SERVER_PORT = config('POSTGRES_PORT', default=8001, cast=int)
    SERVER_HOST = config('SERVER_HOST', default='0.0.0.0', cast=str)
    SERVER_WORKERS = config('SERVER_WORKERS', default=1, cast=int)
    REDIS_URI = config(
        'REDIS_URI', default='redis://redis?decode_responses=True&max_connections=10', cast=str)
    POSTGRES_USER = config('POSTGRES_USER', cast=str)
    POSTGRES_PASSWORD = config('POSTGRES_PASSWORD', cast=str)
    POSTGRES_DB = config('POSTGRES_DB', default='payable_db', cast=str)
    POSTGRES_HOST = config('POSTGRES_HOST', default='dbuser', cast=str)
    POSTGRES_PORT = config('POSTGRES_PORT', default=5432, cast=int)

    def is_production(self):
        """ Check if is a prodution environment"""
        return self.ENVIRONMENT.lower() == "production" and not self.DEBUG
