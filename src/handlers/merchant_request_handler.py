# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Handler for merchant request"""

from typing import Union
from fastapi import Request, Response
from .base_request_handler import BaseRequestHandler
from ..utils.decorators import can_handle


class MerchantRequestHandler(BaseRequestHandler):
    def __init__(self):
    
    @can_handle
    async def handle(self, request: Union[Request, Response]):
        