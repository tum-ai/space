from functools import (
    wraps,
)
from typing import (
    Callable,
)

from fastapi import (
    HTTPException,
)


def error_handlers(func: Callable):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KeyError:
            raise HTTPException(status_code=404, detail="Item not found")
        # TODO extend for different error types

    return wrapper


def async_error_handlers(func: Callable):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except KeyError:
            raise HTTPException(status_code=404, detail="Item not found")
        # TODO extend for different error types

    return wrapper
