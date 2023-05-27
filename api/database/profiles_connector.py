import datetime
from typing import (
    Any,
    List,
    Optional,
    Tuple,
)

from sqlalchemy import (
    Engine,
    and_,
    delete,
    or_,
)
from sqlalchemy.orm import (
    Session,
)

from database.db_models import (  # PublicProfile
    Department,
    DepartmentMembership,
    Profile,
    Role,
    SocialNetwork,
)
from database.setup import (
    setup_db_client_appless,
)
from profiles.api_models import (
    ProfileInCreate,
    ProfileInUpdate,
    SocialNetworkIn,
)

# department operations ##################################################################


def list_db_departments(sql_engine) -> List[Department]:
    with Session(sql_engine) as db_session:
        db_departments: List[Department] = db_session.query(Department).limit(100).all()
        return db_departments


def retrieve_db_department(sql_engine: Engine, handle: str) -> Department:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Department).get(handle)
        if not db_model:
            raise KeyError
        return db_model


# profile operations #####################################################################


def create_db_profiles_form_fb_user(
    sql_engine: Engine,
    fb_user: Any,
) -> List[Profile]:
    with Session(sql_engine) as db_session:
        names = fb_user["name"].split(" ", 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ""

        # TODO: how handle email_verified?
        # TODO use picture
        # TODO: update requiredness of fields

        db_profile = Profile(
            firebase_uid=fb_user["uid"],
            email=fb_user["email"],
            phone="",
            first_name=first_name,
            last_name=last_name,
            # birthday=,
            # nationality=new_profile.nationality,
            # description=new_profile.description,
            # activity_status=new_profile.activity_status,
            # degree_level=new_profile.degree_level,
            # degree_name=new_profile.degree_name,
            # degree_semester=new_profile.degree_semester,
            # degree_semester_last_change_date=datetime.datetime.now(),
            # university=new_profile.university,
            # job_history=job_history_encoded,
            # time_joined=,
        )
        db_session.add(db_profile)
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        assert db_profile.id
        for sn in db_profile.social_networks:
            assert sn.profile_id

        return db_profile


def retrieve_or_create_db_profile_by_firebase_uid(
    sql_engine: Engine,
    fb_user: Any,
) -> Profile:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(Profile)
            .filter(Profile.firebase_uid == fb_user["uid"])
            .one_or_none()
        )
        if db_model is None:
            return create_db_profiles_form_fb_user(sql_engine, fb_user)
        else:
            if not db_model:
                raise KeyError

            for sn in db_model.social_networks:
                if not sn.profile_id:
                    raise KeyError

            return db_model


def retrieve_db_profile_by_firebase_uid(
    sql_engine: Engine,
    firebase_uid: str,
) -> Profile:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(Profile).filter(Profile.firebase_uid == firebase_uid).one()
        )

        # asserts presence values
        if not db_model:
            raise KeyError

        for sn in db_model.social_networks:
            if not sn.profile_id:
                raise KeyError

        return db_model


def create_db_profiles(
    sql_engine: Engine,
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
                db_profile.social_networks.append(
                    SocialNetwork(
                        profile_id=db_profile.id,
                        type=sn.type,
                        handle=sn.handle if sn.handle and len(sn.handle) > 0 else None,
                        link=sn.link if sn.link and len(sn.link) > 0 else None,
                    )
                )
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


def create_db_profile(
    sql_engine: Engine,
    new_profile: ProfileInCreate,
):
    new_db_profile = create_db_profiles(sql_engine, [new_profile])
    if len(new_db_profile) >= 1:
        return new_db_profile[0]
    else:
        raise ValueError


def create_empty_db_profile(firebase_uid: str, email: str) -> Profile:
    with Session(setup_db_client_appless()) as db_session:
        db_profile = Profile(
            firebase_uid=firebase_uid,
            email=email,
            phone="",
            first_name="",
            last_name="",
            birthday=datetime.datetime(2000, 1, 1),
            nationality="German",
            description="",
            activity_status="",
            degree_level="",
            degree_name="",
            degree_semester=1,
            degree_semester_last_change_date=datetime.datetime.now(),
            university="TUM",
            job_history="",
            time_joined=datetime.datetime.now(),
        )
        db_session.add(db_profile)
        db_session.commit()

        if not db_profile.id:
            raise KeyError

        return db_profile


def update_db_profile(
    sql_engine: Engine,
    profile_id: int,
    profile_to_update: ProfileInUpdate,
) -> Profile:
    with Session(sql_engine) as db_session:
        job_history_encoded = Profile.encode_job_history(profile_to_update.job_history)

        db_profile: Profile = db_session.query(Profile).get(profile_id)

        db_profile.email = profile_to_update.email
        db_profile.phone = profile_to_update.phone

        db_profile.first_name = profile_to_update.first_name
        db_profile.last_name = profile_to_update.last_name
        db_profile.birthday = profile_to_update.birthday
        db_profile.nationality = profile_to_update.nationality
        db_profile.description = profile_to_update.description

        db_profile.activity_status = profile_to_update.activity_status

        db_profile.degree_level = profile_to_update.degree_level
        db_profile.degree_name = profile_to_update.degree_name

        if db_profile.degree_semester != profile_to_update.degree_semester:
            db_profile.degree_semester = profile_to_update.degree_semester
            db_profile.degree_semester_last_change_date = datetime.datetime.now()

        db_profile.university = profile_to_update.university
        db_profile.job_history = job_history_encoded

        db_profile.time_joined = profile_to_update.time_joined

        # social network change computation:
        # - pk of social network: profile_id (fixed here), type
        # build hashset by type (find removed, changed & added social networks)
        old_sn_types = {sn.type: sn for sn in db_profile.social_networks}
        new_sn_types = {sn.type: sn for sn in profile_to_update.social_networks}

        # process all old social networks (remove, update, leave)
        for old_k in old_sn_types:
            old_sn: SocialNetwork = old_sn_types[old_k]
            if old_k in new_sn_types:
                # still in use: detect changes
                new_sn: SocialNetworkIn = new_sn_types[old_k]
                if (old_sn.link != new_sn.link) or (old_sn.handle != new_sn.handle):
                    # values changed
                    # old_sn.link = new_sn.link
                    old_sn.handle = new_sn.handle
                    db_session.add(old_sn)
                # else: nothing changed, leave

                # remove from new_sn_types, so that new items remain in dict
                new_sn_types.pop(old_k)

            else:  # not in use anymore -> delete
                db_session.delete(old_sn)

        # create objects for new social networks
        for new_k in new_sn_types:
            sn: SocialNetworkIn = new_sn_types[new_k]
            db_profile.social_networks.append(
                SocialNetwork(
                    profile_id=db_profile.id,
                    type=new_k,
                    handle=sn.handle if sn.handle and len(sn.handle) > 0 else None,
                    link=sn.link if sn.link and len(sn.link) > 0 else None,
                )
            )

        db_session.add(db_profile)
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        if not db_profile.id:
            raise KeyError

        for sn in db_profile.social_networks:
            if not sn.profile_id:
                raise KeyError

    return db_profile


def list_db_profiles(sql_engine: Engine, page: int, page_size: int) -> List[Profile]:
    with Session(sql_engine) as db_session:
        db_profiles: List[Profile] = (
            db_session.query(Profile)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        # asserts presence of id, triggers a db refresh
        for db_profile in db_profiles:
            if not db_profile.id:
                raise KeyError

            for sn in db_profile.social_networks:
                if not sn.profile_id:
                    raise KeyError

        return db_profiles


def retrieve_db_profile(sql_engine: Engine, profile_id: int) -> Profile:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Profile).get(profile_id)

        # asserts presence values
        if not db_model:
            raise KeyError

        for sn in db_model.social_networks:
            if not sn.profile_id:
                raise KeyError

        return db_model


def delete_db_profiles(sql_engine: Engine, profile_ids: List[int]) -> List[int]:
    with Session(sql_engine) as db_session:
        stmt = delete(Profile).where(Profile.id.in_(profile_ids))
        db_session.execute(stmt)
        db_session.commit()
        return profile_ids


def delete_db_profile(sql_engine: Engine, profile_id: int) -> bool:
    print(f"deleting {profile_id}!")
    with Session(sql_engine) as db_session:
        stmt = delete(Profile).where(Profile.id == profile_id)
        db_session.execute(stmt)
        db_session.commit()
        return True


def profile_has_one_of_roles(
    sql_engine: Engine,
    profile_id: int,
    any_of: List[Tuple[Optional[Role], Optional[str]]],
) -> bool:
    or_statement = False
    for role, department_handle in any_of:
        if (role is None) and (department_handle is None):
            or_statement = True
            break

        if role is None:
            or_statement = or_(
                or_statement,
                (DepartmentMembership.department_handle == department_handle),
            )

        elif department_handle is None:
            or_statement = or_(or_statement, (DepartmentMembership.role == role))

        else:
            or_statement = or_(
                or_statement,
                and_(
                    (DepartmentMembership.department_handle == department_handle),
                    (DepartmentMembership.role == role),
                ),
            )

    with Session(sql_engine) as db_session:
        found = (
            db_session.query(DepartmentMembership)
            .filter(and_(DepartmentMembership.profile_id == profile_id, or_statement))
            .count()
        )
        return found >= 1


# TODO: debug #########
def debug_db_query(sql_engine):
    with Session(sql_engine) as db_session:
        # db_models = db_session\
        #     .query(DepartmentMembership)\
        #     .where(
        #         # DepartmentMembership.department_handle == 'dev'
        #         (DepartmentMembership.time_from <= datetime.datetime.now())
        #         &
        #         ((DepartmentMembership.time_to >= datetime.datetime.now()) |
        #       (DepartmentMembership.time_to is None))
        #     ) \
        #     .limit(100)\
        #     .all()

        # print("")
        obj = DepartmentMembership(
            role=Role.TEAMLEAD,
            time_from=datetime.datetime.now() - datetime.timedelta(days=180),
            time_to=datetime.datetime.now() + datetime.timedelta(days=180),
            profile_id=42,
            department_handle="dev",
        )
        db_session.add(obj)
        db_session.commit()
