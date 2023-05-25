from functools import (
    wraps,
)


def response_error(code: int, description: str):
    return {
        "status_code": code,
        "response_type": "error",
        "description": description,
    }


def error_handlers(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KeyError:
            return response_error(404, "Item not found")

    return wrapper
