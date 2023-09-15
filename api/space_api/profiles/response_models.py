from typing import Any

from pydantic import ConfigDict

from space_api.utils.response import BaseResponse

from .api_models import (
    DepartmentMembershipWithShortProfileOut,
    DepartmentOut,
    ProfileOut,
    ProfileOutPublic,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
    RoleInOut,
)

# ------------------------------------------------------------------------------------ #
#                              Department Response Models                              #
# ------------------------------------------------------------------------------------ #


class ResponseDepartmentList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        [DepartmentOut.dummy(), DepartmentOut.dummy()]))

    data: list[DepartmentOut]


class ResponseDepartment(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper(DepartmentOut.dummy()))

    data: DepartmentOut


# ------------------------------------------------------------------------------------ #
#                                Profile Response Models                               #
# ------------------------------------------------------------------------------------ #


class ResponseProfile(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper(ProfileOut.dummy()))

    data: ProfileOut


class ResponsePublicProfile(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        ProfileOutPublic.dummy()))

    data: ProfileOutPublic


class ResponseProfileList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        [ProfileOut.dummy(), ProfileOut.dummy()]))

    data: list[ProfileOut]


class ResponsePublicProfileList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        [ProfileOutPublic.dummy(),
         ProfileOutPublic.dummy()]))

    data: list[ProfileOutPublic]


class ResponseDeletedIntPKList(BaseResponse):
    """data contains ids of deleted profiles"""

    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper([43, 32]))

    data: list[int]


# ------------------------------------------------------------------------------------ #
#                           Member Management Response Models                          #
# ------------------------------------------------------------------------------------ #


class ResponseInviteProfilesList(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper([]))

    succeeded: list[ProfileOut]
    failed: list[Any]


# ------------------------------------------------------------------------------------ #
#                       Authorization Management Response Models                       #
# ------------------------------------------------------------------------------------ #


class ResponseRoleList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        [RoleInOut.dummy(), RoleInOut.dummy()]))

    data: list[RoleInOut]


class ResponseRoleHoldershipList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper(
        [RoleHoldershipInOut.dummy(),
         RoleHoldershipInOut.dummy()]))

    data: list[RoleHoldershipInOut]


class ResponseRoleHoldershipUpdateList(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper([]))

    succeeded: list[RoleHoldershipUpdateInOut]
    failed: list[Any]


class ResponseResetPassword(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper([]))


# ------------------------------------------------------------------------------------ #
#                         DepartmemtMembership Response Models                         #
# ------------------------------------------------------------------------------------ #


class ResponseDepartmentMembershipWithProfileList(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([
        DepartmentMembershipWithShortProfileOut.dummy(),
    ]))

    data: list[DepartmentMembershipWithShortProfileOut]


class ResponseDepartmentMembershipWithProfile(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([
        DepartmentMembershipWithShortProfileOut.dummy(),
    ]))

    data: DepartmentMembershipWithShortProfileOut


class ResponseDepartmentMembershipCreateUpdateList(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra=BaseResponse.schema_wrapper([]))

    succeeded: list[DepartmentMembershipWithShortProfileOut]
    failed: list[Any]
