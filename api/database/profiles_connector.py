from typing import List, Union

from beanie import PydanticObjectId
from profiles.models import Department, Profile, PublicProfile, Role


# operation on single profiles -----------------------------------------------#
async def create_profile(
    new_profile: Profile,
) -> Profile:
    profile = await new_profile.create()
    return profile


async def retrieve_profile(
    profile_id: PydanticObjectId,
) -> Union[bool, Profile]:
    profile = await Profile.get(profile_id)
    if profile:
        return profile
    else:
        return False


async def delete_profile(profile_id: PydanticObjectId) -> None:
    await Profile.get(profile_id).delete()


# batched operations ---------------------------------------------------------#
async def retrieve_public_profiles(
    department: Department,
    role: Role
) -> List[PublicProfile]:
    query = {}
    if department:
        query["department"] = department
    if role:
        query["role"] = role
    profiles = await Profile.find(
        query
    ).project(PublicProfile).to_list()
    return profiles


async def create_profiles(
    new_profiles: List[Profile],
) -> List[Profile]:
    profile = await Profile.insert_many(new_profiles)
    return profile
