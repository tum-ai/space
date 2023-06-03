from functools import (
    wraps,
)
from typing import (
    Any,
    Callable,
)


def response_error(code: int, description: str) -> dict:
    return {
        "status_code": code,
        "response_type": "error",
        "description": description,
    }


def error_handlers(func: Callable) -> Any:
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return func(*args, **kwargs)
        except KeyError:
            return response_error(404, "Item not found")

    return wrapper
