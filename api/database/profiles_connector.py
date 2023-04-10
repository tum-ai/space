import datetime
from typing import List, Union

from sqlalchemy.orm import Session

from profiles.api_models import ProfileInCreate, SocialNetworkIn
from profiles.db_models import Department, Profile, Role, SocialNetwork  # PublicProfile


# department operations ################################################################################################

def list_db_departments(sql_engine) -> List[Department]:
    with Session(sql_engine) as db_session:
        db_departments: List[Department] = db_session.query(Department).limit(100).all()
        return db_departments


def retrieve_db_department(sql_engine, handle: str) -> Department:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Department).get(handle)
        if not db_model:
            raise KeyError
        return db_model


# profile operations ###################################################################################################

def create_db_profiles(
    sql_engine,
    new_profiles: List[ProfileInCreate],
) -> List[Profile]:
    created_db_profiles = []
    with Session(sql_engine) as db_session:
        for new_profile in new_profiles:
            job_history_encoded = Profile.encode_job_history(new_profile.job_history)

            db_profile = Profile(
                email=new_profile.email,
                phone=new_profile.phone,

                first_name=new_profile.first_name,
                last_name=new_profile.last_name,
                birthday=new_profile.birthday,
                nationality=new_profile.nationality,
                description=new_profile.description,
                activity_status=new_profile.activity_status,
                degree_level=new_profile.degree_level,
                degree_name=new_profile.degree_name,
                degree_semester=new_profile.degree_semester,
                degree_semester_last_change_date=datetime.datetime.now(),
                university=new_profile.university,
                job_history=job_history_encoded,
                time_joined=new_profile.time_joined,
            )
            db_session.add(db_profile)
            db_session.flush()

            for sn in new_profile.social_networks:
                db_profile.social_networks.append(SocialNetwork(
                        profile_id=db_profile.id,
                        type=sn.type,
                        handle=sn.handle if sn.handle and len(sn.handle) > 0 else None,
                        link=sn.link if sn.link and len(sn.link) > 0 else None
                    ))
            created_db_profiles.append(db_profile)

        db_session.commit()

        # asserts presence of id, triggers a db refresh
        for db_profile in created_db_profiles:
            if not db_profile.id:
                raise KeyError

            for sn in db_profile.social_networks:
                if not sn.profile_id:
                    raise KeyError

    return created_db_profiles

##############################################################################################
# TODO UPDATE ALL FUNCTIONS BELOW! ###########################################################
##############################################################################################

async def create_profile(
        new_profile: Profile,
) -> Profile:
    pass
# TODO


# TODO
async def retrieve_profile(
        # profile_id: PydanticObjectId,
) -> Union[bool, Profile]:
    # profile = await Profile.get(profile_id)
    # if profile:
    #     return profile
    # else:
    #     return False
    return False


# TODO
def retrieve_profile_by_supertokens_id(
        supertokensId: str,
) -> Union[bool, Profile]:
    profile = Profile.find_one(
        Profile.supertokensId == supertokensId,
    )
    if profile:
        return profile
    else:
        return False


# TODO
async def delete_profile(
        # profile_id: PydanticObjectId
) -> bool:
    # retrieved_profile = await Profile.get(profile_id)
    # if retrieved_profile:
    #     await retrieved_profile.delete()
    #     log.debug(f"Deleted profile with id {profile_id}")
    #     return True
    # else:
    #     log.debug(f"Could not delete profile with id {profile_id} - profile not found.")
    #     return False

    # await Profile.get(profile_id).delete()
    return False


# batched operations ---------------------------------------------------------#
async def retrieve_public_profiles(
        department: Department,
        role: Role
):  # -> List[PublicProfile] TODO
    # query = {}
    # if department:
    #     query["department"] = department
    # if role:
    #     query["role"] = role
    # profiles = await Profile.find(
    #     query
    # ).project(PublicProfile).to_list()
    # return profiles
    return []

