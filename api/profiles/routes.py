from typing import (
    Annotated,
    List,
)

from fastapi import (
    APIRouter,
    Body,
    Depends,
    Request,
)
from supertokens_python.recipe.session import (
    SessionContainer,
)
from supertokens_python.recipe.session.exceptions import (
    ClaimValidationError,
    raise_invalid_claims_exception,
)
from supertokens_python.recipe.session.framework.fastapi import (
    verify_session,
)
from supertokens_python.recipe.userroles import (
    PermissionClaim,
    UserRoleClaim,
)
from supertokens_python.recipe.userroles.asyncio import (
    add_role_to_user,
)

from database.profiles_connector import (
    create_db_profile,
    create_db_profiles,
    debug_db_query,
    delete_db_profile,
    delete_db_profiles,
    list_db_departments,
    list_db_profiles,
    retrieve_db_department,
    retrieve_db_profile,
    retrieve_db_profile_by_supertokens_id,
    update_db_profile,
)
from profiles.api_models import (
    DepartmentOut,
    ProfileInCreate,
    ProfileInUpdate,
    ProfileOut,
    ProfileOutPublic,
)
from profiles.db_models import (
    Profile,
)
from template.models import (
    BaseResponse,
    Response,
    ResponseDeletedIntList,
)
from utils.error_handlers import (
    async_error_handlers,
)
from utils.paging import (
    enable_paging,
)

router = APIRouter()


# department operations ##################################################################
class ResponseDepartmentList(BaseResponse):
    data: List[DepartmentOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [DepartmentOut.dummy(), DepartmentOut.dummy()]
        )


@router.get(
    "/departments/",
    response_description="List all departments, no paging support",
    response_model=ResponseDepartmentList,
)
@async_error_handlers
async def list_departments(request: Request) -> ResponseDepartmentList:
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


class ResponseDepartment(BaseResponse):
    data: DepartmentOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(DepartmentOut.dummy())


@router.get(
    "/department/{handle}",
    response_description="Get a department by its handle",
    response_model=ResponseDepartment,
)
@async_error_handlers
async def get_department(request: Request, handle: str) -> ResponseDepartment:
    db_model = retrieve_db_department(request.app.state.sql_engine, handle)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved Department successfully",
        "data": DepartmentOut.from_db_model(db_model),
    }


# profile operations #####################################################################
# TODO: department memberships to profile responses


class ResponseProfileList(BaseResponse):
    data: List[ProfileOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                ProfileOut.dummy(),
                ProfileOut.dummy(),
            ]
        )


# TODO rate limits?
@router.post(
    "/profiles/",
    response_description="Batch add profiles",
    response_model=ResponseProfileList,
)
@async_error_handlers
async def add_profiles(
    request: Request,
    data: Annotated[List[ProfileInCreate], Body(embed=True)],
    # session: SessionContainer = Depends(verify_session())
):
    # TODO test and enable the commented out code
    # roles = await session.get_claim_value(UserRoleClaim)
    # if roles is None or "ADMIN" not in roles:
    #     raise_invalid_claims_exception("User is not an admin", [
    #         ClaimValidationError(UserRoleClaim.key, None)])
    # else:

    new_db_profiles = create_db_profiles(request.app.state.sql_engine, data)
    new_profiles = [ProfileOut.from_db_model(p) for p in new_db_profiles]
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Created profiles",
        "data": new_profiles,
    }


class ResponseProfile(BaseResponse):
    data: ProfileOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOut.dummy())


@router.post(
    "/profile/", response_description="Add profile", response_model=ResponseProfile
)
@async_error_handlers
async def add_profile(
    request: Request,
    data: Annotated[ProfileInCreate, Body(embed=True)],
    # session: SessionContainer = Depends(verify_session())
) -> ResponseProfile:
    # TODO test and enable the commented out code
    # roles = await session.get_claim_value(UserRoleClaim)
    # if roles is None or "ADMIN" not in roles:
    #     raise_invalid_claims_exception("User is not an admin", [
    #         ClaimValidationError(UserRoleClaim.key, None)])
    # else:

    new_db_profile = create_db_profile(request.app.state.sql_engine, data)
    new_profile = ProfileOut.from_db_model(new_db_profile)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Created profile",
        "data": new_profile,
    }


@router.get(
    "/profiles/admin",
    response_description="List all profiles, paging support",
    response_model=ResponseProfileList,
)
@async_error_handlers
@enable_paging(max_page_size=100)
def list_profiles(
    request: Request, page: int = 1, page_size: int = 100
) -> ResponseProfileList:
    # TODO authorization: only presidents / team leads
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_profiles: List[ProfileOut] = [ProfileOut.from_db_model(p) for p in db_profiles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Admin Profile list successfully received",
        "data": out_profiles,
    }


class ResponsePublicProfileList(BaseResponse):
    data: List[ProfileOutPublic]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                ProfileOutPublic.dummy(),
                ProfileOutPublic.dummy(),
            ]
        )


@router.get(
    "/profiles/",
    response_description="List all profiles, paging support",
    response_model=ResponsePublicProfileList,
)
@async_error_handlers
@enable_paging(max_page_size=100)
def list_public_profiles(
    request: Request, page: int = 1, page_size: int = 100
) -> ResponsePublicProfileList:
    db_profiles = list_db_profiles(request.app.state.sql_engine, page, page_size)
    out_public_profiles: List[ProfileOutPublic] = [
        ProfileOutPublic.from_db_model(p) for p in db_profiles
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "data": out_public_profiles,
    }


class ResponsePublicProfile(BaseResponse):
    data: ProfileOutPublic

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ProfileOutPublic.dummy())


@router.get(
    "/profile/{profile_id}",
    response_description="Get a public profile by its profile_id",
    response_model=ResponsePublicProfile,
)
@async_error_handlers
async def get_public_profile(
    request: Request, profile_id: str
) -> ResponsePublicProfile:
    db_model = retrieve_db_profile(request.app.state.sql_engine, profile_id)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved public profile successfully",
        "data": ProfileOutPublic.from_db_model(db_model),
    }


@router.get(
    "/profile/{profile_id}/admin",
    response_description="Get a profile by its profile_id",
    response_model=ResponseProfile,
)
@async_error_handlers
async def get_profile(request: Request, profile_id: str) -> ResponseProfile:
    # TODO access control
    db_model = retrieve_db_profile(request.app.state.sql_engine, profile_id)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved profile successfully",
        "data": ProfileOut.from_db_model(db_model),
    }


# TODO test & logic to init profile with supertokens id
@router.get(
    "/profile/",
    response_description="Retrieve the complete profile of the user "
    + "currently logged in with SuperTokens",
    response_model=ResponseProfile,
)
async def show_current_profile(
    request: Request, session: SessionContainer = Depends(verify_session())
) -> ResponseProfile:
    supertokens_user_id = session.get_user_id()
    db_profile: Profile = retrieve_db_profile_by_supertokens_id(
        request.app.state.sql_engine, supertokens_user_id
    )
    profile: ProfileOut = ProfileOut.from_db_model(db_profile)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Complete internally visible Profile",
        "data": profile,
    }


@router.delete(
    "/profiles/",
    response_description="delete all profiles",
    response_model=ResponseDeletedIntList,
)
@async_error_handlers
async def delete_profiles(
    request: Request, profile_ids: List[int]
) -> ResponseDeletedIntList:
    # TODO authorization
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
    response_model=Response,
)
@async_error_handlers
async def delete_profile(request: Request, profile_id: int) -> Response:
    # TODO authorization (myself or admin)
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


@router.patch(
    "/profile/{profile_id}",
    response_description="Update profile",
    response_model=ResponseProfile,
)
@async_error_handlers
async def update_profile(
    request: Request,
    profile_id: int,
    data: Annotated[ProfileInUpdate, Body(embed=True)],
    # session: SessionContainer = Depends(verify_session())
) -> ResponseProfile:
    # TODO authorization
    updated_db_profile = update_db_profile(
        request.app.state.sql_engine, profile_id, data
    )
    # TODO: handle 404
    udpated_profile = ProfileOut.from_db_model(updated_db_profile)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Updated profile",
        "data": udpated_profile,
    }


# TODO test endpoint
@router.patch(
    "/profile/",
    response_description="Update logged in users profile",
    response_model=ResponseProfile,
)
@async_error_handlers
async def update_current_profile(
    request: Request,
    data: Annotated[ProfileInUpdate, Body(embed=True)],
    session: SessionContainer = Depends(verify_session()),
) -> ResponseProfile:
    supertokens_user_id = session.get_user_id()
    db_profile: Profile = retrieve_db_profile_by_supertokens_id(
        request.app.state.sql_engine, supertokens_user_id
    )
    updated_db_profile = update_db_profile(
        request.app.state.sql_engine, db_profile.id, data
    )
    # TODO: handle 404
    udpated_profile = ProfileOut.from_db_model(updated_db_profile)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Updated current profile",
        "data": udpated_profile,
    }


##########################################################################################
# TODO UPDATE ALL FUNCTIONS BELOW! #######################################################
##########################################################################################


# testing for frontend connection---------------------------------------------#
@router.post(
    "/test/checkrole",
    response_description="Test if role is added to session",
    response_model=Response,
)
async def test1(session: SessionContainer = Depends(verify_session())):
    # print(session.__dict__)
    roles = await session.get_claim_value(UserRoleClaim)

    if roles is None or "ADMIN" not in roles:
        raise_invalid_claims_exception(
            "User is not an admin", [ClaimValidationError(UserRoleClaim.key, None)]
        )
    else:
        return {
            "status": 200,
            "status_code": 200,
            "response_type": "success",
            "description": "check role",
            "data": "check completed",
        }


# add role to session user for testing ---------------------------------------#
@router.post(
    "/profiles/role", response_description="Add role to user", response_model=Response
)
async def add_role_to_user_func(session: SessionContainer = Depends(verify_session())):
    user_id = session.user_id
    role = "ADMIN"
    res = await add_role_to_user(user_id, role)

    # add the user's roles to the user's session
    await session.fetch_and_set_claim(UserRoleClaim)
    # add the user's permissions to the user's session
    await session.fetch_and_set_claim(PermissionClaim)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "attempted role add",
        "data": res,
    }
    # '''if isinstance(res, UnknownRoleError):
    #     # No such role exists

    #     return

    # if res.did_user_already_have_role:
    #     # User already had this role
    #     pass'''


# TODO: DEBUG ####
@router.get(
    "/debug",
    response_description="Retrieve a complete profile",
    # response_model=Response,
)
async def debug(request: Request):
    return debug_db_query(request.app.state.sql_engine)
