# -*- coding: utf-8 -*-
# autor: Maycon Pimentel <maycon.pimentel@gmail.com>
"""Module providing a function to get default logger."""

import logging
from logging import Logger
import sys
from ..utils.configuration import AppConfig


def get_log_level():
    """ Function to return log level by env """
    return getattr(logging, AppConfig.LOG_LEVEL)


def get_logger(name) -> Logger:
    """ Function to return default logger """
    logger = logging.getLogger(name)
    _ch = logging.StreamHandler(sys.stdout)
    _ch.setLevel(get_log_level())
    _formatter = logging.Formatter(
        '[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s')
    _ch.setFormatter(_formatter)
    logger.addHandler(_ch)
    logger.setLevel(get_log_level())
    return logger
