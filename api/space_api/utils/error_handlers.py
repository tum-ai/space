from collections.abc import Callable
from functools import wraps
from typing import Any

from space_api.utils.error import RESPONSE_NOT_FOUND


def error_handlers(func: Callable) -> Any:

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return func(*args, **kwargs)
        except KeyError:
            raise RESPONSE_NOT_FOUND

    return wrapper
