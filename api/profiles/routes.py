from typing import List, Annotated

from fastapi import APIRouter, Depends, Body
from fastapi import Request
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.exceptions import (
    ClaimValidationError, raise_invalid_claims_exception)
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.userroles import PermissionClaim, UserRoleClaim
from supertokens_python.recipe.userroles.asyncio import (add_role_to_user)

from database.profiles_connector import (retrieve_profile_by_supertokens_id, list_db_departments, create_db_profiles,
                                         retrieve_db_department)
from profiles.api_models import DepartmentOut, ProfileInCreate, ProfileOut
from template.models import Response, BaseResponse
from utils.error_handlers import async_error_handlers

router = APIRouter()


# department operations ################################################################################################
class ResponseDepartmentList(BaseResponse):
    data: List[DepartmentOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([
            DepartmentOut.dummy(), DepartmentOut.dummy()
        ])


@router.get(
    "/departments/",
    response_description="List all departments, no paging support",
    response_model=ResponseDepartmentList
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
        "data": out_departments
    }


class ResponseDepartment(BaseResponse):
    data: DepartmentOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(DepartmentOut.dummy())


@router.get(
    "/department/{handle}",
    response_description="Get a department by its handle",
    response_model=ResponseDepartment
)
@async_error_handlers
async def get_department(request: Request, handle: str) -> ResponseDepartment:
    db_model = retrieve_db_department(request.app.state.sql_engine, handle)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved Department successfully",
        "data": DepartmentOut.from_db_model(db_model)
    }


# profile operations ###################################################################################################

class ResponseProfileList(BaseResponse):
    data: List[ProfileOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([
            ProfileOut.dummy(),
            ProfileOut.dummy(),
        ])


# TODO rate limits?
@router.post(
    "/profiles/",
    response_description="Batch add profiles",
    response_model=ResponseProfileList
)
@async_error_handlers
async def add_profiles(
        request: Request,
        data: Annotated[ProfileInCreate, Body(embed=True)],
        # session: SessionContainer = Depends(verify_session())
):
    # TODO test and enable the commented out code
    # roles = await session.get_claim_value(UserRoleClaim)
    # if roles is None or "ADMIN" not in roles:
    #     raise_invalid_claims_exception("User is not an admin", [
    #         ClaimValidationError(UserRoleClaim.key, None)])
    # else:

    new_db_profiles = create_db_profiles(request.app.state.sql_engine, [data])
    new_profiles = [ProfileOut.from_db_model(p) for p in new_db_profiles]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": f"Created profiles",
        "data": new_profiles,
    }


##############################################################################################
# TODO UPDATE ALL FUNCTIONS BELOW! ###########################################################
##############################################################################################


@router.get(
    "/department/{handle}",
    response_description="Get a department by its handle",
    response_model=ResponseDepartment
)
@async_error_handlers
async def get_department(request: Request, handle: str) -> ResponseDepartment:
    with Session(request.app.state.sql_engine) as session:
        out_department: DepartmentOut = DepartmentOut.from_handle(session, handle)
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Created...",
            "data": out_department
        }


# ######################################################################################################################

@router.get(
    "/profiles/",
    response_description="List all profiles of department and role",
    response_model=Response
)
async def list_public_profiles(
        department_handle: str,
        role: str = None
):
    # profiles = await retrieve_public_profiles(department=department, role=role)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "List of public profiles",
        # "data": profiles,
    }


# TODO PATCH multiple profiles
# TODO DELETE multiple profiles

# single profile operations --------------------------------------------------#
@router.post(
    "/profile/",
    response_description="Add new profile",
    response_model=Response
)
async def add_profile(
        # profile: Profile = Body(...), session: SessionContainer = Depends(verify_session())
):
    # roles = await session.get_claim_value(UserRoleClaim)

    # if roles is None or "ADMIN" not in roles:
    #     raise_invalid_claims_exception("User is not an admin", [
    #         ClaimValidationError(UserRoleClaim.key, None)])
    # else:
    #     new_profile = await create_profile(profile)
    #     return {
    #         "status_code": 200,
    #         "response_type": "success",
    #         "description": f"Created profile with id {id(new_profile)}.",
    #         "data": new_profile,
    #     }

    raise_invalid_claims_exception("Not implemented!", [])


@router.get(
    "/profile/me",
    response_description="Retrieve the complete profile of the user currently logged in with SuperTokens",
    response_model=Response,
)
async def show_current_profile(session: SessionContainer = Depends(verify_session())):
    supertokens_user_id = session.get_user_id()
    profile = await retrieve_profile_by_supertokens_id(supertokens_user_id)
    if profile:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Complete internally visible Profile",
            "data": profile,
        }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "Profile not found",
        "data": None,
    }


@router.get(
    "/profile/{id_}",
    response_description="Retrieve a complete profile",
    response_model=Response,
)
async def show_profile(
        # id_: PydanticObjectId,
        # session: SessionContainer = Depends(verify_session())
):
    # profile = await retrieve_profile(id_)
    # if profile:
    #     return {
    #         "status_code": 200,
    #         "response_type": "success",
    #         "description": "Complete internally visible Profile",
    #         "data": profile,
    #     }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "Profile not found",
        "data": None,
    }


@router.delete(
    "/profile/{id_}",
    response_description="Remove profile",
    response_model=Response,
)
async def remove_profile(
        # id_: PydanticObjectId, session: SessionContainer = Depends(verify_session())
):
    # roles = await session.get_claim_value(UserRoleClaim)
    # if roles is None or "ADMIN" not in roles:
    #     raise_invalid_claims_exception("User is not an admin", [
    #         ClaimValidationError(UserRoleClaim.key, None)])
    # else:
    #     await delete_profile(id_)
    #     return {
    #         "status_code": 200,
    #         "response_type": "success",
    #         "description": "Profile deleted",
    #         "data": None,
    #     }

    raise_invalid_claims_exception("Not implemented!", [])


# TODO: uncomment it and fix it. If this is uncommented, the PATCH request below (/profile/me) doesnt work
# @router.patch(
#     "/profile/{id_}",
#     response_description="Update profile",
#     response_model=Response,
# )
# async def update_profile(
#     profile_id: PydanticObjectId, data: dict, session : SessionContainer = Depends(verify_session())
# ) -> Union[bool, Profile]:
#     roles = await session.get_claim_value(UserRoleClaim)

#     if roles is None or "admin" not in roles:
#         raise_invalid_claims_exception("User is not an admin", [
#                                        ClaimValidationError(UserRoleClaim.key, None)])
#     else:
#         update_body = {k: v for k, v in data.items() if v is not None}
#         update_query = {"$set": {field: value for field, value in update_body.items()}}
#         profile = await Profile.get(profile_id)

#         if profile:
#             await profile.update(update_query)
#             return profile
#         else:
#             return False

@router.patch(
    "/profile/me",
    response_description="Update my profile",
    response_model=Response,
)
async def update_my_profile(
        data: dict, session: SessionContainer = Depends(verify_session())
):  # -> Union[bool, Profile]:
    # supertokens_user_id = session.get_user_id()
    # update_body = {k: v for k, v in data.items() if v is not None}
    # update_query = {"$set": {field: value for field, value in update_body.items()}}
    # profile = await retrieve_profile_by_supertokens_id(supertokens_user_id)
    #
    # if profile:
    #     await profile.update(update_query)
    #     return {
    #         "status_code": 200,
    #         "response_type": "success",
    #         "description": "Profile edited",
    #         "data": data,
    #     }
    # else:
    #     return False

    raise_invalid_claims_exception("Not implemented!", [])


# testing for frontend connection---------------------------------------------#
@router.post(
    "/test/checkrole",
    response_description="Test if role is added to session",
    response_model=Response
)
async def test1(session: SessionContainer = Depends(verify_session())):
    # print(session.__dict__)
    roles = await session.get_claim_value(UserRoleClaim)

    if roles is None or "ADMIN" not in roles:
        raise_invalid_claims_exception("User is not an admin", [
            ClaimValidationError(UserRoleClaim.key, None)])
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
    "/profiles/role",
    response_description="Add role to user",
    response_model=Response
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
    '''if isinstance(res, UnknownRoleError):
        # No such role exists
        
        return

    if res.did_user_already_have_role:
        # User already had this role
        pass'''
