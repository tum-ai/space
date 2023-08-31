from typing import Any

from fastapi import HTTPException


class HttpError(HTTPException):
    """Base Error type for HTTP errors."""

    def __init__(self, status_code: int, description: Any = None) -> None:
        super().__init__(
            status_code,
            detail={
                "status_code": status_code,
                "description": description,
            },
        )


# ------------------------------------------------------------------------------------ #
#                              List of custom http errors                              #
# ------------------------------------------------------------------------------------ #

RESPONSE_NO_AUTH_TOKEN = HttpError(
    status_code=401,
    description="No auth token supplied!",
)
RESPONSE_AUTH_FAILED = HttpError(
    status_code=401,
    description="Auth test: failed!",
)
RESPONSE_UNAUTHORIZED = HttpError(
    status_code=401,
    description="You are not authorized to access this resource!",
)

RESPONSE_NOT_FOUND = HttpError(
    status_code=404,
    description="Item not found!",
)
