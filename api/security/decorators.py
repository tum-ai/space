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
    PositionType,
)
from database.profiles_connector import (
    profile_has_one_of_positions,
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

    any_of_positions: Optional[
        List[Tuple[Optional[PositionType], Optional[str]]]
    ] = kwargs.pop("any_of_positions", None)
    any_of_roles: Optional[List[str]] = kwargs.pop("any_of_roles", None)

    succeeded = False
    if any_of_positions is None and any_of_roles is None:
        succeeded = True
    if not succeeded and len(any_of_positions or []) > 0:
        succeeded = profile_has_one_of_positions(
            request.app.state.sql_engine, profile.id, any_of_positions or []
        )
    if not succeeded and len(any_of_roles or []) > 0:
        succeeded = profile_has_one_of_roles(
            request.app.state.sql_engine, profile.id, any_of_roles or []
        )

    if not succeeded:
        return RESPONSE_UNAUTHORIZED

    return func(request, *args, **kwargs)


def ensure_authenticated(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(request: Request, *args, **kwargs):
        return __ensure_auth(func, request, *args, **kwargs)

    return wrapper


def ensure_authorization(
    any_of_positions: List[Tuple[Optional[PositionType], Optional[str]]] = [],
    any_of_roles: List[str] = [],
) -> Callable:
    """
    If any in on of any_of_position or any_of_role is found for
    the user, authorization is granted

    Args:
        any_of_position: ensures the logged in user to have one
            of the certain authorization privileges: tuple(position, department_handle);
            null values in one of the
            tuple elements are interpreted as wildcards.
            (None, None) means any position in any department --> e.g. not an applicant
        any_of_role (List[role_handle]): ensures that the user has any of the
            given authorization roles, no wildcard behavior here
    """

    def outer_wrapper(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(request: Request, *args, **kwargs):
            kwargs["any_of_positions"] = any_of_positions
            kwargs["any_of_roles"] = any_of_roles
            return __ensure_auth(func, request, *args, **kwargs)

        return wrapper

    return outer_wrapper
