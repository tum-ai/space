from typing import (
    Annotated,
    List,
    Optional,
    Union,
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)
from profiles.response_models import (
    ResponseDepartmentList,
    ResponseDepartment,
    ResponseRoleList,
    ResponseRoleHoldershipList,
    ResponseRoleHoldershipUpdateList,
    ResponseProfile,
    ResponsePublicProfile,
    ResponseInviteProfilesList,
    ResponseProfileList,
    ResponsePublicProfileList,
    ResponseDeletedProfileList,
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
    list_db_roleholderships,
    list_db_roles,
    retrieve_db_department,
    retrieve_db_profile,
    update_db_profile,
    update_db_roleholderships,
)
from profiles.api_models import (
    DepartmentOut,
    ProfileInUpdate,
    ProfileMemberInvitation,
    ProfileOut,
    ProfileOutPublic,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
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


# ------------------------------------------------------------------------------------ #
#                                 Department Endpoints                                 #
# ------------------------------------------------------------------------------------ #


@router.get(
    "/departments/",
    response_description="List all departments, no paging support",
    response_model=Union[ResponseDepartmentList, ErrorResponse],
)
@error_handlers
def list_departments(request: Request) -> dict:
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
def get_department(request: Request, handle: str) -> dict:
    db_model = retrieve_db_department(request.app.state.sql_engine, handle)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved Department successfully",
        "data": DepartmentOut.from_db_model(db_model),
    }


# UPDATE and DELETE via direct db access

# profile operations #####################################################################


@router.post(
    "/profiles/invite/members",
    response_description="Create Profiles for new members and sendout invitation emails",
    response_model=Union[ResponseInviteProfilesList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_roles=["invite_members"],
)
@ensure_authenticated
def invite_members(
    request: Request,
    data: Annotated[List[ProfileMemberInvitation], Body(embed=True)],
) -> dict:
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
@ensure_authenticated
def list_roles(request: Request) -> dict:
    db_roles = list_db_roles(request.app.state.sql_engine)
    out_roles: List[RoleInOut] = [RoleInOut.from_db_model(r) for r in db_roles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Members invited successfully",
        "data": out_roles,
    }


@router.get(
    "/role/holderships",
    response_description="List all role assignments in TUM.ai Space",
    response_model=Union[ResponseRoleHoldershipList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["role_assignment"],
)
def list_role_holderships(
    request: Request,
    profile_id: Optional[int] = None,
    role_handle: Optional[str] = None,
) -> dict:
    db_role_holderships = list_db_roleholderships(
        request.app.state.sql_engine, profile_id, role_handle
    )
    out_roles = [RoleHoldershipInOut.from_db_model(rh) for rh in db_role_holderships]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Role holderships successfully retrieved",
        "data": out_roles,
    }


@router.patch(
    "/role/holderships",
    response_description="Update role assignments in TUM.ai Space",
    response_model=Union[ResponseRoleHoldershipUpdateList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["role_assignment"],
)
def update_role_holderships(
    request: Request,
    data: Annotated[List[RoleHoldershipUpdateInOut], Body(embed=True)],
) -> dict:
    out_holdersips, failed_holderships = update_db_roleholderships(
        request.app.state.sql_engine, data
    )
    failed_holderships_out = [
        {"data": err_data, "error": err} for err_data, err in failed_holderships
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Updated role holderships successfully",
        "succeeded": out_holdersips,
        "failed": failed_holderships_out,
    }


@router.get(
    "/profiles/admin",
    response_description="List all profiles, paging support",
    response_model=Union[ResponseProfileList, ErrorResponse],
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def list_profiles(request: Request, page: int = 1, page_size: int = 100) -> dict:
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
def list_public_profiles(request: Request, page: int = 1, page_size: int = 100) -> dict:
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
def get_profile(request: Request, profile_id: int) -> dict:
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
def get_public_profile(request: Request, profile_id: int) -> dict:
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
def show_current_profile(request: Request) -> dict:
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
def delete_profiles(request: Request, profile_ids: List[int]) -> dict:
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
def delete_profile(request: Request, profile_id: int) -> dict:
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
def delete_own_profile(request: Request) -> dict:
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
) -> dict:
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
) -> dict:
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


# ------------------------------------------------------------------------------------ #
#                              Member Management endpoints                             #
# ------------------------------------------------------------------------------------ #


@router.post(
    "/profiles/invite/members",
    response_description="Create Profiles for new members and sendout \
        invitation emails",
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
) -> dict:
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


# ------------------------------------------------------------------------------------ #
#                          Authorization Management Endpoints                          #
# ------------------------------------------------------------------------------------ #


@router.get(
    "/roles",
    response_description="List all roles availlable in TUM.ai Space",
    response_model=Union[ResponseRoleList, ErrorResponse],
)
@error_handlers
@ensure_authenticated
def list_roles(request: Request) -> dict:
    db_roles = list_db_roles(request.app.state.sql_engine)
    out_roles: List[RoleInOut] = [RoleInOut.from_db_model(r) for r in db_roles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Members invited successfully",
        "data": out_roles,
    }


@router.get(
    "/role/holderships",
    response_description="List all role assignments in TUM.ai Space",
    response_model=Union[ResponseRoleHoldershipList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["role_assignment"],
)
def list_role_holderships(
    request: Request,
    profile_id: Optional[int] = None,
    role_handle: Optional[str] = None,
) -> dict:
    db_role_holderships = list_db_roleholderships(
        request.app.state.sql_engine, profile_id, role_handle
    )
    out_roles = [RoleHoldershipInOut.from_db_model(rh) for rh in db_role_holderships]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Role holderships successfully retrieved",
        "data": out_roles,
    }


@router.patch(
    "/role/holderships",
    response_description="Update role assignments in TUM.ai Space",
    response_model=Union[ResponseRoleHoldershipUpdateList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["role_assignment"],
)
def update_role_holderships(
    request: Request,
    data: Annotated[List[RoleHoldershipUpdateInOut], Body(embed=True)],
) -> dict:
    out_holdersips, failed_holderships = update_db_roleholderships(
        request.app.state.sql_engine, data
    )
    failed_holderships_out = [
        {"data": err_data, "error": err} for err_data, err in failed_holderships
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Updated role holderships successfully",
        "succeeded": out_holdersips,
        "failed": failed_holderships_out,
    }


# ------------------------------------------------------------------------------------ #
#                       DepartmemtMembership management endpoints                      #
# ------------------------------------------------------------------------------------ #

# TODO
