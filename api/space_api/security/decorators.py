from collections.abc import Callable
from functools import wraps
from typing import Any

from fastapi import Request

from space_api.database.db_models import PositionType
from space_api.database.profiles_connector import (
    profile_has_one_of_positions,
    profile_has_one_of_roles,
    retrieve_or_create_db_profile_by_firebase_uid,
)
from space_api.security.jwt import validate_jwt
from space_api.utils.error import (
    RESPONSE_AUTH_FAILED,
    RESPONSE_NO_AUTH_TOKEN,
    RESPONSE_UNAUTHORIZED,
)


def __ensure_auth(func: Callable, request: Request, *args: Any, **kwargs: Any) -> Any:
    headers = request.headers
    # ==========FOR TESTING USING THE FASTAPI DOCS WITHOUT AUTH===
    # class dotdict(dict):
    #     """dot.notation access to dictionary attributes"""
    #     __getattr__ = dict.get
    #     __setattr__ = dict.__setitem__
    #     __delattr__ = dict.__delitem__

    # mydict = {'val':'it works'}
    # request.state.profile = {"id": 1}
    # request.state.profile = dotdict(request.state.profile)
    # kwargs.pop("any_of_roles", None)
    # kwargs.pop(
    #     "any_of_positions", None
    # )
    # return func(request, *args, **kwargs)
    # ===========================================================
    token = headers.get("authorization")
    if token is None:
        raise RESPONSE_NO_AUTH_TOKEN
    auth0_user = validate_jwt(request.app.state.auth0, token)
    if auth0_user is None:
        raise RESPONSE_AUTH_FAILED

    profile = retrieve_or_create_db_profile_by_firebase_uid(
        request.app.state.sql_engine, auth0_user
    )
    if profile is None:
        raise RESPONSE_AUTH_FAILED

    request.state.auth0_user = auth0_user
    request.state.profile = profile

    any_of_positions: list[tuple[PositionType | None, str | None]] | None = kwargs.pop(
        "any_of_positions", None
    )
    any_of_roles: list[str] | None = kwargs.pop("any_of_roles", None)

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
        raise RESPONSE_UNAUTHORIZED

    return func(request, *args, **kwargs)


def ensure_authenticated(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(request: Request, *args: Any, **kwargs: Any):
        return __ensure_auth(func, request, *args, **kwargs)

    return wrapper


def ensure_authorization(
    any_of_positions: list[tuple[PositionType | None, str | None]] = [],
    any_of_roles: list[str] = [],
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
        def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:
            kwargs["any_of_positions"] = any_of_positions
            kwargs["any_of_roles"] = any_of_roles
            return __ensure_auth(func, request, *args, **kwargs)

        return wrapper

    return outer_wrapper
