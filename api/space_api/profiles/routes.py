import datetime
from typing import (
    Annotated,
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from space_api.database.db_models import (
    PositionType,
)
from space_api.database.profiles_connector import (
    create_db_department_memberships,
    delete_db_department_memberships,
    delete_db_profile,
    delete_db_profiles,
    get_db_department_memberships,
    invite_new_members,
    list_db_department_memberships,
    list_db_departments,
    list_db_profiles,
    list_db_roleholderships,
    list_db_roles,
    retrieve_db_department,
    retrieve_db_profile,
    update_db_department_memberships,
    update_db_profile,
    update_db_roleholderships,
)
from space_api.profiles.api_models import (
    DepartmentMembershipInCreate,
    DepartmentMembershipInUpdate,
    DepartmentMembershipWithShortProfileOut,
    DepartmentOut,
    ProfileInUpdate,
    ProfileMemberInvitation,
    ProfileOut,
    ProfileOutPublic,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
    RoleInOut,
)
from space_api.profiles.response_models import (
    ResponseDeletedIntPKList,
    ResponseDepartment,
    ResponseDepartmentList,
    ResponseDepartmentMembershipCreateUpdateList,
    ResponseDepartmentMembershipWithProfile,
    ResponseDepartmentMembershipWithProfileList,
    ResponseInviteProfilesList,
    ResponseProfile,
    ResponseProfileList,
    ResponsePublicProfile,
    ResponsePublicProfileList,
    ResponseRoleHoldershipList,
    ResponseRoleHoldershipUpdateList,
    ResponseRoleList,
)
from space_api.security.decorators import (
    ensure_authenticated,
    ensure_authorization,
)
from space_api.utils.error_handlers import (
    error_handlers,
)
from space_api.utils.paging import (
    enable_paging,
)
from space_api.utils.response import (
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
    response_model=ResponseDepartmentList | ErrorResponse,
)
@error_handlers
def list_departments(request: Request) -> dict:
    db_departments = list_db_departments(request.app.state.sql_engine)
    out_departments: list[DepartmentOut] = [
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
    response_model=ResponseDepartment | ErrorResponse,
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

# profile operations ############################################################


@router.get(
    "/role/holderships",
    response_description="List all role assignments in TUM.ai Space",
    response_model=ResponseRoleHoldershipList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["admin"],
)
def list_role_holderships(
    request: Request,
    profile_id: int | None = None,
) -> dict:
    db_role_holderships = list_db_roleholderships(
        request.app.state.sql_engine, profile_id
    )
    out_roles = [RoleHoldershipInOut.from_db_model(rh) for rh in db_role_holderships]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Role holderships successfully retrieved",
        "data": out_roles,
    }


@router.get(
    "/me/role/holderships",
    response_description="List all role assignments to user",
    response_model=ResponseRoleHoldershipList | ErrorResponse,
)
@ensure_authenticated
def list_user_role_holderships(
    request: Request,
) -> dict:
    db_role_holderships = list_db_roleholderships(
        request.app.state.sql_engine, request.state.profile.id
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
    response_model=ResponseRoleHoldershipUpdateList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["admin"],
)
def update_role_holderships(
    request: Request,
    data: Annotated[list[RoleHoldershipUpdateInOut], Body(embed=True)],
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
    response_model=ResponseProfileList | ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def list_profiles(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_profiles: list[ProfileOut] = [ProfileOut.from_db_model(p) for p in db_profiles]
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
    response_model=ResponsePublicProfileList | ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
def list_public_profiles(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_public_profiles: list[ProfileOutPublic] = [
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
    response_model=ResponseProfile | ErrorResponse,
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
    response_model=ResponsePublicProfile | ErrorResponse,
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
    response_model=ResponseProfile | ErrorResponse,
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
    response_model=ResponseDeletedIntPKList | ErrorResponse,
)
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def delete_profiles(request: Request, profile_ids: list[int]) -> dict:
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
    response_model=BaseResponse | ErrorResponse,
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
    response_model=BaseResponse | ErrorResponse,
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
    response_model=ResponseProfile | ErrorResponse,
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
    response_model=ResponseProfile | ErrorResponse,
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
    response_model=ResponseInviteProfilesList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, "community"), (None, "board")],
    any_of_roles=["invite_members"],
)
def invite_members(
    request: Request,
    data: Annotated[list[ProfileMemberInvitation], Body(embed=True)],
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
    response_model=ResponseRoleList | ErrorResponse,
)
@error_handlers
@ensure_authenticated
def list_roles(request: Request) -> dict:
    db_roles = list_db_roles(request.app.state.sql_engine)
    out_roles: list[RoleInOut] = [RoleInOut.from_db_model(r) for r in db_roles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Members invited successfully",
        "data": out_roles,
    }


# ------------------------------------------------------------------------------------ #
#                       DepartmemtMembership management endpoints                      #
# ------------------------------------------------------------------------------------ #


@router.get(
    "/department-memberships",
    response_description="List department memberships that meet the filter criteria",
    response_model=ResponseDepartmentMembershipWithProfileList | ErrorResponse,
)
@enable_paging(max_page_size=200)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["departmemt_membership_management"],
)
def list_department_memberships(
    request: Request,
    page: int = 1,
    page_size: int = 100,
    profile_id: int | None = None,
    department_handle: str | None = None,
    position: str | None = None,
    started_before: datetime.datetime | None = None,
    started_after: datetime.datetime | None = None,
    ended_before: datetime.datetime | None = None,
    ended_after: datetime.datetime | None = None,
) -> dict:
    db_department_memberships = list_db_department_memberships(
        request.app.state.sql_engine,
        page,
        page_size,
        profile_id,
        department_handle,
        position,
        started_before,
        started_after,
        ended_before,
        ended_after,
    )
    out_department_memberships = [
        DepartmentMembershipWithShortProfileOut.from_db_model(rh)
        for rh in db_department_memberships
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Department memberships successfully retrieved",
        "data": out_department_memberships,
    }


@router.get(
    "/department-membership/{department_membership_id}",
    response_description="Retrieve a department membership by its id",
    response_model=ResponseDepartmentMembershipWithProfile | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["departmemt_membership_management"],
)
def get_department_membership(request: Request, department_membership_id: int) -> dict:
    db_department_membership = get_db_department_memberships(
        request.app.state.sql_engine, department_membership_id
    )
    out_department_membership = DepartmentMembershipWithShortProfileOut.from_db_model(
        db_department_membership
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Department membership successfully retrieved",
        "data": out_department_membership,
    }


@router.post(
    "/department-memberships",
    response_description="Create department memberships in TUM.ai Space",
    response_model=ResponseDepartmentMembershipCreateUpdateList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["departmemt_membership_management"],
)
def create_department_memberships(
    request: Request,
    data: Annotated[list[DepartmentMembershipInCreate], Body(embed=True)],
) -> dict:
    db_memberships, failed_memberships = create_db_department_memberships(
        request.app.state.sql_engine, data
    )
    out_memberships = [
        DepartmentMembershipWithShortProfileOut.from_db_model(db_m)
        for db_m in db_memberships
    ]
    failed_memberships_out = [
        {"data": err_data, "error": err} for err_data, err in failed_memberships
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Create department memberships successfully",
        "succeeded": out_memberships,
        "failed": failed_memberships_out,
    }


@router.patch(
    "/department-memberships",
    response_description="Update department memberships in TUM.ai Space",
    response_model=ResponseDepartmentMembershipCreateUpdateList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["departmemt_membership_management"],
)
def update_department_memberships(
    request: Request,
    data: Annotated[list[DepartmentMembershipInUpdate], Body(embed=True)],
) -> dict:
    db_memberships, failed_memberships = update_db_department_memberships(
        request.app.state.sql_engine, data
    )
    out_memberships = [
        DepartmentMembershipWithShortProfileOut.from_db_model(db_m)
        for db_m in db_memberships
    ]
    failed_memberships_out = [
        {"data": err_data, "error": err} for err_data, err in failed_memberships
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Updated department memberships successfully",
        "succeeded": out_memberships,
        "failed": failed_memberships_out,
    }


@router.delete(
    "/department-memberships",
    response_description="Delete department memberships by their ids",
    response_model=ResponseDeletedIntPKList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["departmemt_membership_management"],
)
def delete_department_membership(
    request: Request, department_membership_ids: list[int]
) -> dict:
    deleted_ids = delete_db_department_memberships(
        request.app.state.sql_engine, department_membership_ids
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Department memberships successfully deleted",
        "data": deleted_ids,
    }
