from beanie import PydanticObjectId
from typing import List, Union

from fastapi import APIRouter, Body, Depends

from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.userroles.asyncio import get_roles_for_user

from database.profiles_connector import (
    retrieve_public_profiles,
    retrieve_profile,
    create_profiles,
    create_profile,
    delete_profile
)
from template.models import Response
from profiles.models import Profile, Department, Role

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
    # TODO role permissions management
    new_profiles = await create_profiles(profiles)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": f"Created profiles with ids {[id(profile) for profile in new_profiles]}",
        "data": new_profiles,
    }


@router.get(
    "/profiles/",
    response_description="List all profiles of department and role",
    response_model=Response
)
async def list_public_profiles(department: Department, role=Role):
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
    # TODO role permissions management
    new_profile = await create_profile(profile)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": f"Created profile with id {id(new_profile)}.",
        "data": new_profile,
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
    # TODO role permissions management
    await delete_profile(id_)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Profile deleted",
        "data": None,
    }


@router.patch(
    "/profile/{id_}",
    response_description="Update profile",
    response_model=Response,
)
async def update_profile(
    profile_id: PydanticObjectId, data: dict
) -> Union[bool, Profile]:
    # TODO role permissions management
    update_body = {k: v for k, v in data.items() if v is not None}
    update_query = {"$set": {field: value for field, value in update_body.items()}}
    profile = await Profile.get(profile_id)

    if profile:
        await profile.update(update_query)
        return profile
    else:
        return False
