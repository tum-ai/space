from typing import (
    Annotated,
    Any,
    List,
    Union,
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from database.db_models import (
    PositionType,
)
from database.profiles_connector import (
    delete_db_profile,
    delete_db_profiles,
    invite_new_members,
    list_db_departments,
    list_db_profiles,
    list_db_roles,
    retrieve_db_department,
    retrieve_db_profile,
    update_db_profile,
)
from profiles.api_models import (
    DepartmentOut,
    ProfileInUpdate,
    ProfileMemberInvitation,
    ProfileOut,
    ProfileOutPublic,
    RoleInOut,
)
from security.decorators import (
    ensure_authenticated,
    ensure_authorization,
)
from utils.error_handlers import (
    error_handlers,
)
from utils.paging import (
    enable_paging,
)
from utils.response import (
    BaseResponse,
    ErrorResponse,
)

router = APIRouter()

# response types #########################################################################


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


# department operations ##################################################################


@router.get(
    "/departments/",
    response_description="List all departments, no paging support",
    response_model=Union[ResponseDepartmentList, ErrorResponse],
)
@error_handlers
def list_departments(request: Request):
    db_departments = list_db_departments(request.app.state.sql_engine)
    out_departments: List[DepartmentOut] = [
        DepartmentOut.from_db_model(dep) for dep in db_departments
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Department list successfully received",
        "data": out_departments,
    }


@router.get(
    "/department/{handle}",
    response_description="Get a department by its handle",
    response_model=Union[ResponseDepartment, ErrorResponse],
)
@error_handlers
def get_department(request: Request, handle: str):
    db_model = retrieve_db_department(request.app.state.sql_engine, handle)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved Department successfully",
        "data": DepartmentOut.from_db_model(db_model),
    }


# UPDATE and DELETE via direct db access

# profile operations #####################################################################
# TODO: department memberships to profile responses


@router.get(
    "/profiles/invite/members",
    response_description="Create Profiles for new members and sendout invitation emails",
    response_model=Union[ResponseInviteProfilesList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, "community"), (None, "board")],
    any_of_roles=["invite_members"],
)
def invite_members(
    request: Request,
    data: Annotated[List[ProfileMemberInvitation], Body(embed=True)],
):
    created_profiles, error_profiles = invite_new_members(
        request.app.state.sql_engine, data
    )
    created_profiles_out = [ProfileOut.from_db_model(p) for p in created_profiles]
    error_profiles_out = [
        {"data": err_data, "error": err} for err_data, err in error_profiles
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Members invited successfully",
        "succeeded": created_profiles_out,
        "failed": error_profiles_out,
    }


@router.get(
    "/roles",
    response_description="List all roles availlable in TUM.ai Space",
    response_model=Union[ResponseRoleList, ErrorResponse],
)
@error_handlers
# @ensure_authenticated  # TODO: reenable
def list_roles(request: Request):
    db_roles = list_db_roles(request.app.state.sql_engine)
    out_roles: List[RoleInOut] = [RoleInOut.from_db_model(r) for r in db_roles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Members invited successfully",
        "data": out_roles,
    }


# TODO: GET /role/holderships (filter by profile_id, role_id)
# TODO: POST /role/holdership
# TODO: DELTE /role/holdership


@router.get(
    "/profiles/admin",
    response_description="List all profiles, paging support",
    response_model=Union[ResponseProfileList, ErrorResponse],
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def list_profiles(request: Request, page: int = 1, page_size: int = 100):
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_profiles: List[ProfileOut] = [ProfileOut.from_db_model(p) for p in db_profiles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Admin Profile list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_profiles,
    }


@router.get(
    "/profiles/",
    response_description="List all profiles, paging support",
    response_model=Union[ResponsePublicProfileList, ErrorResponse],
)
@enable_paging(max_page_size=100)
@error_handlers
def list_public_profiles(request: Request, page: int = 1, page_size: int = 100):
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_public_profiles: List[ProfileOutPublic] = [
        ProfileOutPublic.from_db_model(p) for p in db_profiles
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_public_profiles,
    }


@router.get(
    "/profile/{profile_id}/admin",
    response_description="Get a profile by its profile_id",
    response_model=Union[ResponseProfile, ErrorResponse],
)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def get_profile(request: Request, profile_id: int):
    db_model = retrieve_db_profile(request.app.state.sql_engine, profile_id)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved profile successfully",
        "data": ProfileOut.from_db_model(db_model),
    }


@router.get(
    "/profile/{profile_id}",
    response_description="Get a public profile by its profile_id",
    response_model=Union[ResponsePublicProfile, ErrorResponse],
)
@error_handlers
def get_public_profile(request: Request, profile_id: int):
    db_model = retrieve_db_profile(request.app.state.sql_engine, profile_id)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved public profile successfully",
        "data": ProfileOutPublic.from_db_model(db_model),
    }


@router.get(
    "/me",
    response_description="Retrieve the complete profile of the user currently \
    logged in with FireBase",
    response_model=Union[ResponseProfile, ErrorResponse],
)
@ensure_authenticated
def show_current_profile(request: Request):
    profile: ProfileOut = ProfileOut.from_db_model(request.state.profile)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Complete internally visible Profile",
        "data": profile,
    }


@router.delete(
    "/profiles/",
    response_description="delete all profiles",
    response_model=Union[ResponseDeletedProfileList, ErrorResponse],
)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def delete_profiles(request: Request, profile_ids: List[int]):
    deleted_profiles = delete_db_profiles(request.app.state.sql_engine, profile_ids)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Profile list successfully deleted",
        "data": deleted_profiles,
    }


@router.delete(
    "/profile/{profile_id}",
    response_description="delete a profile",
    response_model=Union[BaseResponse, ErrorResponse],
)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def delete_profile(request: Request, profile_id: int):
    if not delete_db_profile(request.app.state.sql_engine, profile_id):
        return {
            "status_code": 400,
            "response_type": "error",
            "description": "deletion was not possible!",
        }
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Profile successfully deleted",
    }


@router.delete(
    "/me",
    response_description="delete my own profile",
    response_model=Union[BaseResponse, ErrorResponse],
)
@error_handlers
@ensure_authenticated
def delete_own_profile(request: Request):
    if not delete_db_profile(request.app.state.sql_engine, request.state.profile.id):
        return {
            "status_code": 400,
            "response_type": "error",
            "description": "deletion was not possible!",
        }
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Profile successfully deleted",
    }


@router.patch(
    "/profile/{profile_id}",
    response_description="Update profile",
    response_model=Union[ResponseProfile, ErrorResponse],
)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def update_profile(
    request: Request,
    profile_id: int,
    data: Annotated[ProfileInUpdate, Body(embed=True)],
):
    updated_db_profile = update_db_profile(
        request.app.state.sql_engine, profile_id, data
    )
    udpated_profile = ProfileOut.from_db_model(updated_db_profile)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Updated profile",
        "data": udpated_profile,
    }


# TODO restrict name changes for own profile?
@router.patch(
    "/me",
    response_description="Update logged in users profile",
    response_model=Union[ResponseProfile, ErrorResponse],
)
@error_handlers
@ensure_authenticated
def update_current_profile(
    request: Request,
    data: Annotated[ProfileInUpdate, Body(embed=True)],
):
    updated_db_profile = update_db_profile(
        request.app.state.sql_engine, request.state.profile.id, data
    )
    udpated_profile = ProfileOut.from_db_model(updated_db_profile)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Updated current profile",
        "data": udpated_profile,
    }


# TODO department membership maintainance
