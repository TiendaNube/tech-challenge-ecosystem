# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Load environment variables and populate a class for app configuration"""

from decouple import config


class AppConfig:
    """ Class for app configuration """
    DEBUG: bool = config('DEBUG', default=False, cast=bool)
    ENVIRONMENT: str = config('ENVIRONMENT', default='production', cast=str)
    LOG_LEVEL: str = config('LOG_LEVEL', default='INFO', cast=str)
    FACILITY: str = config('FACILITY', default='payables', cast=str)
    WEB_SERVER_PORT: int = config('WEB_SERVER_PORT', default=8101, cast=int)
    WEB_SERVER_HOST: str = config(
        'WEB_SERVER_HOST', default='0.0.0.0', cast=str)
    WEB_SERVER_WORKERS: int = config('WEB_SERVER_WORKERS', default=1, cast=int)
    WEB_SERVER_ADMIN_PASSWORD: str = config(
        'WEB_SERVER_ADMIN_PASSWORD', cast=str)
    WEB_SERVER_ADMIN_USERNAME: str = config(
        'WEB_SERVER_ADMIN_USERNAME', cast=str)
    REDIS_URI: str = config(
        'REDIS_URI', default='redis://redis?decode_responses=True&max_connections=10', cast=str)
    POSTGRES_USER: str = config('POSTGRES_USER', cast=str)
    POSTGRES_PASSWORD: str = config('POSTGRES_PASSWORD', cast=str)
    POSTGRES_DB: str = config('POSTGRES_DB', default='payable_db', cast=str)
    POSTGRES_HOST: str = config('POSTGRES_HOST', default='postgres', cast=str)
    POSTGRES_PORT: int = config('POSTGRES_PORT', default=5432, cast=int)
    AMQP_URI: str = config(
        'AMQP_URI', default='amqp://guest:guest@rabbitmq/', cast=str)
    AMQP_QUEUE: str = config(
        'AMQP_QUEUE', default='transacions', cast=str)

    @staticmethod
    def is_production() -> bool:
        """
            Check if is a prodution environment
            How: env ENVIRONMENT is equal a `production` and env DEBUG is `False`
        """
        return AppConfig.ENVIRONMENT.lower() == "production" and not AppConfig.DEBUG
