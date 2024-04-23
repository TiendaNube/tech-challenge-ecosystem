# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Utilities module"""

from .configuration import AppConfig


def validate_credentials(credentials: object) -> bool:
    """Basic credentials validation """
    return credentials.username == AppConfig.WEB_SERVER_ADMIN_USERNAME and AppConfig.WEB_SERVER_ADMIN_PASSWORD == credentials.password
