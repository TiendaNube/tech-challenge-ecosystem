# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
""" Dependencies injector for fastApi """

from typing import TypeVar

T = TypeVar("T")


class Injector:
    """ Dependencies injector Class for fastApi """

    def __init__(self, app):
        self.app = app
        self.app.dependencies = {}

    def add(self, value: T):
        """ Inject dependency """
        type_ = type(value)
        self.app.dependencies[type_] = value
        return value

    def get(self, type_: T) -> T:
        """ Get dependency """
        value = self.app.dependencies[type_]
        if not isinstance(value, type_):
            raise ValueError("No dependency of type ${T} was found")
        return value
