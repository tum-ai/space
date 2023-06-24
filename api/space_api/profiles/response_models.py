from typing import Any

from space_api.profiles.api_models import (
    DepartmentMembershipWithShortProfileOut,
    DepartmentOut,
    ProfileOut,
    ProfileOutPublic,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
    RoleInOut,
)
from space_api.utils.response import BaseResponse

# ------------------------------------------------------------------------------------ #
#                              Department Response Models                              #
# ------------------------------------------------------------------------------------ #


class ResponseDepartmentList(BaseResponse):
    data: list[DepartmentOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [DepartmentOut.dummy(), DepartmentOut.dummy()]
        )


class ResponseDepartment(BaseResponse):
    data: DepartmentOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(DepartmentOut.dummy())


# ------------------------------------------------------------------------------------ #
#                                Profile Response Models                               #
# ------------------------------------------------------------------------------------ #


class ResponseProfile(BaseResponse):
    data: ProfileOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOut.dummy())


class ResponsePublicProfile(BaseResponse):
    data: ProfileOutPublic

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOutPublic.dummy())


class ResponseProfileList(BaseResponse):
    data: list[ProfileOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [ProfileOut.dummy(), ProfileOut.dummy()]
        )


class ResponsePublicProfileList(BaseResponse):
    data: list[ProfileOutPublic]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                ProfileOutPublic.dummy(),
                ProfileOutPublic.dummy(),
            ]
        )


class ResponseDeletedIntPKList(BaseResponse):
    """data contains ids of deleted profiles"""

    data: list[int]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([43, 32])


# ------------------------------------------------------------------------------------ #
#                           Member Management Response Models                          #
# ------------------------------------------------------------------------------------ #


class ResponseInviteProfilesList(BaseResponse):
    succeeded: list[ProfileOut]
    failed: list[Any]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])  # TODO


# ------------------------------------------------------------------------------------ #
#                       Authorization Management Response Models                       #
# ------------------------------------------------------------------------------------ #


class ResponseRoleList(BaseResponse):
    data: list[RoleInOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [RoleInOut.dummy(), RoleInOut.dummy()]
        )


class ResponseRoleHoldershipList(BaseResponse):
    data: list[RoleHoldershipInOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [RoleHoldershipInOut.dummy(), RoleHoldershipInOut.dummy()]
        )


class ResponseRoleHoldershipUpdateList(BaseResponse):
    succeeded: list[RoleHoldershipUpdateInOut]
    failed: list[Any]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])  # TODO


# ------------------------------------------------------------------------------------ #
#                         DepartmemtMembership Response Models                         #
# ------------------------------------------------------------------------------------ #


class ResponseDepartmentMembershipWithProfileList(BaseResponse):
    data: list[DepartmentMembershipWithShortProfileOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                DepartmentMembershipWithShortProfileOut.dummy(),
            ]
        )


class ResponseDepartmentMembershipWithProfile(BaseResponse):
    data: DepartmentMembershipWithShortProfileOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            DepartmentMembershipWithShortProfileOut.dummy(),
        )


class ResponseDepartmentMembershipCreateUpdateList(BaseResponse):
    succeeded: list[DepartmentMembershipWithShortProfileOut]
    failed: list[Any]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
