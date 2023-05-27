from functools import (
    wraps,
)
from typing import (
    Callable,
    List,
    Optional,
    Tuple,
)

from fastapi import (
    Request,
)

from database.db_models import (
    Role,
)
from database.profiles_connector import (
    profile_has_one_of_roles,
    retrieve_or_create_db_profile_by_firebase_uid,
)
from security.firebase_auth import (
    verify_id_token,
)

RESPONSE_NO_AUTH_TOKEN = {
    "status_code": 401,
    "response_type": "error",
    "description": "No auth token supplied!",
}
RESPONSE_AUTH_FAILED = {
    "status_code": 401,
    "response_type": "error",
    "description": "Auth test: failed!",
}
RESPONSE_UNAUTHORIZED = {
    "status_code": 401,
    "response_type": "error",
    "description": "You are not authorized to access this resource!",
}


def __ensure_auth(func: Callable, request: Request, *args, **kwargs):
    headers = request.headers
    jwt = headers.get("authorization")
    if jwt is None:
        return RESPONSE_NO_AUTH_TOKEN

    fb_user = verify_id_token(jwt)
    if fb_user is None:
        return RESPONSE_AUTH_FAILED

    profile = retrieve_or_create_db_profile_by_firebase_uid(
        request.app.state.sql_engine, fb_user
    )
    if profile is None:
        return RESPONSE_AUTH_FAILED

    request.state.fb_user = fb_user
    request.state.profile = profile

    any_of: List[Tuple[Optional[Role], Optional[str]]] = kwargs.pop("any_of", [])
    if len(any_of) > 0:
        succeeded = profile_has_one_of_roles(
            request.app.state.sql_engine, profile.id, any_of
        )

    else:
        succeeded = True

    if not succeeded:
        return RESPONSE_UNAUTHORIZED

    return func(request, *args, **kwargs)


def ensure_authenticated(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(request: Request, *args, **kwargs):
        return __ensure_auth(func, request, *args, **kwargs)

    return wrapper


def ensure_role(any_of: List[Tuple[Optional[Role], Optional[str]]]) -> Callable:
    """
    Args:
        any_of: ensures the logged in user to have one of the certain authorization
            privileges: tuple(role, department_handle); null values in one of the
            tuple elements are interpreted as wildcards.
            (None, None) means any role in any department --> e.g. not an applicant
    """

    def outer_wrapper(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(request: Request, *args, **kwargs):
            kwargs["any_of"] = any_of
            return __ensure_auth(func, request, *args, **kwargs)

        return wrapper

    return outer_wrapper
