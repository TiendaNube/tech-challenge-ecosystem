# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" healthcheck to verify a reponse from server """

from fastapi import APIRouter, status

router = APIRouter(tags=["Healthcheck"], prefix="/healthcheck")


@router.get("", status_code=status.HTTP_200_OK)
def healthcheck():
    """ Route to check application running """
    return {"Healthcheck": "Ok"}
