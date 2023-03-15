from typing import List, Union

from beanie import PydanticObjectId
from database.profiles_connector import (create_profile, create_profiles,
                                         delete_profile, retrieve_profile,
                                         retrieve_profile_by_supertokens_id,
                                         retrieve_public_profiles)
from fastapi import APIRouter, Body, Depends
from profiles.models import Department, Profile, Role
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.exceptions import (
    ClaimValidationError, raise_invalid_claims_exception)
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.userroles import PermissionClaim, UserRoleClaim
from supertokens_python.recipe.userroles.asyncio import (add_role_to_user,
                                                         get_roles_for_user)
from supertokens_python.recipe.userroles.interfaces import UnknownRoleError
from template.models import Response

router = APIRouter()


# batch operations -----------------------------------------------------------#
@router.post(
    "/profiles/",
    response_description="Batch add profiles",
    response_model=Response
)
async def add_profiles(
        profiles: List[Profile] = Body(...),
        session: SessionContainer = Depends(verify_session())
):
    roles = await session.get_claim_value(UserRoleClaim)

    if roles is None or "ADMIN" not in roles:
        raise_invalid_claims_exception("User is not an admin", [
            ClaimValidationError(UserRoleClaim.key, None)])
    else:
        new_profiles = await create_profiles(profiles)
        return {
            "status_code": 200,
            "response_type": "success",
            "description": f"Created profiles with ids {[id(profile) for profile in new_profiles.inserted_ids]}",
        }


@router.get(
    "/profiles/",
    response_description="List all profiles of department and role",
    response_model=Response
)
async def list_public_profiles(department: Department = None, role: Role = None):
    profiles = await retrieve_public_profiles(department=department, role=role)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "List of public profiles",
        "data": profiles,
    }


# TODO PATCH multiple profiles
# TODO DELETE multiple profiles

# single profile operations --------------------------------------------------#
@router.post(
    "/profile/",
    response_description="Add new profile",
    response_model=Response
)
async def add_profile(profile: Profile = Body(...), session: SessionContainer = Depends(verify_session())):
    roles = await session.get_claim_value(UserRoleClaim)

    if roles is None or "ADMIN" not in roles:
        raise_invalid_claims_exception("User is not an admin", [
            ClaimValidationError(UserRoleClaim.key, None)])
    else:
        new_profile = await create_profile(profile)
        return {
            "status_code": 200,
            "response_type": "success",
            "description": f"Created profile with id {id(new_profile)}.",
            "data": new_profile,
        }


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
async def show_profile(id_: PydanticObjectId, session: SessionContainer = Depends(verify_session())):
    profile = await retrieve_profile(id_)
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


@router.delete(
    "/profile/{id_}",
    response_description="Remove profile",
    response_model=Response,
)
async def remove_profile(id_: PydanticObjectId, session: SessionContainer = Depends(verify_session())):
    roles = await session.get_claim_value(UserRoleClaim)
    if roles is None or "ADMIN" not in roles:
        raise_invalid_claims_exception("User is not an admin", [
            ClaimValidationError(UserRoleClaim.key, None)])
    else:
        await delete_profile(id_)
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Profile deleted",
            "data": None,
        }

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
    data: dict, session : SessionContainer = Depends(verify_session())
) -> Union[bool, Profile]:
    supertokens_user_id = session.get_user_id()
    update_body = {k: v for k, v in data.items() if v is not None}
    update_query = {"$set": {field: value for field, value in update_body.items()}}
    profile = await retrieve_profile_by_supertokens_id(supertokens_user_id)

    if profile:
        await profile.update(update_query)
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Profile edited",
            "data": data,
        }
    else:
        return False


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
