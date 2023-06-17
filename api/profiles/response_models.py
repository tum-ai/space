from typing import Any, List

from profiles.api_models import (
    DepartmentOut,
    ProfileOut,
    ProfileOutPublic,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
    RoleInOut,
)
from utils.response import BaseResponse


class ResponseDepartmentList(BaseResponse):
    data: List[DepartmentOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [DepartmentOut.dummy(), DepartmentOut.dummy()]
        )


class ResponseDepartment(BaseResponse):
    data: DepartmentOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(DepartmentOut.dummy())


class ResponseRoleList(BaseResponse):
    data: List[RoleInOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [RoleInOut.dummy(), RoleInOut.dummy()]
        )


class ResponseRoleHoldershipList(BaseResponse):
    data: List[RoleHoldershipInOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [RoleHoldershipInOut.dummy(), RoleHoldershipInOut.dummy()]
        )


class ResponseRoleHoldershipUpdateList(BaseResponse):
    succeeded: List[RoleHoldershipUpdateInOut]
    failed: List[Any]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])  # TODO


class ResponseProfile(BaseResponse):
    data: ProfileOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOut.dummy())


class ResponsePublicProfile(BaseResponse):
    data: ProfileOutPublic

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOutPublic.dummy())


class ResponseInviteProfilesList(BaseResponse):
    succeeded: List[ProfileOut]
    failed: List[Any]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])  # TODO


class ResponseProfileList(BaseResponse):
    data: List[ProfileOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [ProfileOut.dummy(), ProfileOut.dummy()]
        )


class ResponsePublicProfileList(BaseResponse):
    data: List[ProfileOutPublic]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                ProfileOutPublic.dummy(),
                ProfileOutPublic.dummy(),
            ]
        )


class ResponseDeletedProfileList(BaseResponse):
    """data contains ids of deleted profiles"""

    data: List[int]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([43, 32])

