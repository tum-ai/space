import datetime
import traceback
from typing import (
    Any,
    List,
    Optional,
    Tuple,
)

import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from profiles.api_models import (
    DepartmentMembershipInCreate,
    DepartmentMembershipInUpdate,
    ProfileInCreate,
    ProfileInUpdate,
    ProfileMemberInvitation,
    RoleHoldershipInOut,
    RoleHoldershipUpdateInOut,
    SocialNetworkIn,
)
from security.firebase_auth import (
    create_invite_email_user,
)

from .db_models import (  # PublicProfile
    Department,
    DepartmentMembership,
    PositionType,
    Profile,
    Role,
    RoleHoldership,
    SocialNetwork,
)
from .setup import (
    setup_db_client_appless,
)

# ------------------------------------------------------------------------------------ #
#                                 department operations                                #
# ------------------------------------------------------------------------------------ #


def list_db_departments(sql_engine: sa.Engine) -> List[Department]:
    with Session(sql_engine) as db_session:
        db_departments: List[Department] = db_session.query(Department).limit(100).all()
        return db_departments


def retrieve_db_department(sql_engine: sa.Engine, handle: str) -> Department:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Department).get(handle)
        if not db_model:
            raise KeyError
        return db_model


# ------------------------------------------------------------------------------------ #
#                                  profile operations                                  #
# ------------------------------------------------------------------------------------ #


def create_db_profile_from_fb_user(
    sql_engine: sa.Engine,
    fb_user: Any,
) -> Profile:
    with Session(sql_engine) as db_session:
        print(fb_user)
        names = fb_user.get("name", "Unnamed Alien").split(" ", 1)
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
        )
        db_session.add(db_profile)
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        assert db_profile.id
        for sn in db_profile.social_networks:
            assert sn.profile_id

        return db_profile


def retrieve_or_create_db_profile_by_firebase_uid(
    sql_engine: sa.Engine,
    fb_user: Any,
) -> Profile:
    with Session(sql_engine) as db_session:
        db_model: Profile | None = (
            db_session.query(Profile)
            .filter(Profile.firebase_uid == fb_user["uid"])
            .one_or_none()
        )
        if db_model is None:
            return create_db_profile_from_fb_user(sql_engine, fb_user)
        else:
            if not db_model:
                raise KeyError
            db_model.force_load()
            return db_model


def retrieve_db_profile_by_firebase_uid(
    sql_engine: sa.Engine,
    firebase_uid: str,
) -> Profile:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(Profile).filter(Profile.firebase_uid == firebase_uid).one()
        )

        # asserts presence values
        if not db_model:
            raise KeyError

        db_model.force_load()
        return db_model


def create_db_profiles(
    sql_engine: sa.Engine,
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
                profile_picture=new_profile.profile_picture,
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
            db_profile.force_load()

    return created_db_profiles


def create_db_profile(
    sql_engine: sa.Engine,
    new_profile: ProfileInCreate,
) -> Profile:
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

        db_profile.force_load()
        return db_profile


def update_db_profile(
    sql_engine: sa.Engine,
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

        db_profile.profile_picture = profile_to_update.profile_picture

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
                    old_sn.link = new_sn.link
                    old_sn.handle = new_sn.handle
                    db_session.add(old_sn)
                # else: nothing changed, leave

                # remove from new_sn_types, so that new items remain in dict
                new_sn_types.pop(old_k)

            else:  # not in use anymore -> delete
                db_profile.social_networks = [
                    sn for sn in db_profile.social_networks if sn.type != old_k
                ]
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

        db_profile.force_load()

    return db_profile


def list_db_profiles(sql_engine: sa.Engine, page: int, page_size: int) -> List[Profile]:
    with Session(sql_engine) as db_session:
        db_profiles: List[Profile] = (
            db_session.query(Profile)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        for db_profile in db_profiles:
            db_profile.force_load()

        return db_profiles


def retrieve_db_profile(sql_engine: sa.Engine, profile_id: int) -> Profile:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Profile).get(profile_id)
        db_model.force_load()
        return db_model


def delete_db_profiles(sql_engine: sa.Engine, profile_ids: List[int]) -> List[int]:
    with Session(sql_engine) as db_session:
        stmt = sa.delete(Profile).where(Profile.id.in_(profile_ids))
        db_session.execute(stmt)
        db_session.commit()
        return profile_ids


def delete_db_profile(sql_engine: sa.Engine, profile_id: int) -> bool:
    print(f"deleting {profile_id}!")
    with Session(sql_engine) as db_session:
        stmt = sa.delete(Profile).where(Profile.id == profile_id)
        db_session.execute(stmt)
        db_session.commit()
        return True


def profile_has_one_of_positions(
    sql_engine: sa.Engine,
    profile_id: int,
    any_of: List[Tuple[Optional[PositionType], Optional[str]]],
) -> bool:
    or_statement = sa.and_(sa.false(), sa.false())
    for position, department_handle in any_of:
        if (position is None) and (department_handle is None):
            or_statement = sa.true()
            break

        if position is None:
            or_statement = sa.or_(
                or_statement,
                (DepartmentMembership.department_handle == department_handle),
            )

        elif department_handle is None:
            or_statement = sa.or_(
                or_statement, (DepartmentMembership.position == position)
            )

        else:
            or_statement = sa.or_(
                or_statement,
                sa.and_(
                    (DepartmentMembership.department_handle == department_handle),
                    (DepartmentMembership.position == position),
                ),
            )

    with Session(sql_engine) as db_session:
        found = (
            db_session.query(DepartmentMembership)
            .filter(
                sa.and_(
                    DepartmentMembership.profile_id == profile_id,
                    or_statement,
                    (DepartmentMembership.time_from < datetime.datetime.now()),
                    (DepartmentMembership.time_to > datetime.datetime.now()),
                )
            )
            .count()
        )
        return found >= 1


def profile_has_one_of_roles(
    sql_engine: sa.Engine,
    profile_id: int,
    any_of: List[str],
) -> bool:
    or_statement = sa.and_(sa.false(), sa.false())
    for role_handle in any_of:
        if role_handle is None:
            continue
        or_statement = sa.or_(RoleHoldership.role_handle == role_handle, or_statement)

    with Session(sql_engine) as db_session:
        found = (
            db_session.query(RoleHoldership)
            .where(sa.and_(RoleHoldership.profile_id == profile_id, or_statement))
            .count()
        )
        return found >= 1


# ------------------------------------------------------------------------------------ #
#                             Member Management operations                             #
# ------------------------------------------------------------------------------------ #


def invite_new_members(
    sql_engine: sa.Engine,
    new_profiles: List[ProfileMemberInvitation],
) -> Tuple[List[Profile], List[Tuple[ProfileMemberInvitation, str]]]:
    """
    Returns:
        List[Profile]: successfully created profiles
        List[Tuple[ProfileMemberInvitation, str]]: failed profiles with error message
    """
    created_profiles = []
    error_profiles = []

    for new_profile in new_profiles:
        display_name = f"{new_profile.first_name} {new_profile.last_name}"
        if len(new_profile.email) < 2 or len(display_name) < 3:
            error_profiles.append((new_profile, "Email or display name too short!"))
            continue

        created_fb_user_or_error = create_invite_email_user(
            display_name=display_name, email=new_profile.email
        )
        if isinstance(created_fb_user_or_error, str):
            error_profiles.append(
                (
                    new_profile,
                    "User with this email already exists!"
                    if created_fb_user_or_error == "UserAlreadyExists"
                    else "Unknown error while creating user!",
                )
            )
            continue

        else:
            created_fb_user = created_fb_user_or_error
            with Session(sql_engine) as db_session:
                print(created_fb_user)

                db_profile = Profile(
                    firebase_uid=created_fb_user.uid,
                    email=created_fb_user.email,
                    first_name=new_profile.first_name,
                    last_name=new_profile.last_name,
                )
                db_session.add(db_profile)
                db_session.commit()

                db_department_membership = DepartmentMembership(
                    profile_id=db_profile.id,
                    department_handle=new_profile.department_handle,
                    position=PositionType[new_profile.department_position],
                    time_from=datetime.datetime.now(),
                    time_to=None,
                )
                db_session.add(db_department_membership)
                db_session.commit()

                # asserts presence of id, triggers a db refresh
                assert db_profile.id
                for sn in db_profile.social_networks:
                    assert sn.profile_id
                for sn in db_profile.department_memberships:
                    assert sn.profile_id

                created_profiles.append(db_profile)

    return created_profiles, error_profiles


# ----------------------------------------------------------------------------------- #
#                         Authorization Management operations                         #
# ----------------------------------------------------------------------------------- #


def list_db_roles(sql_engine: sa.Engine) -> List[Role]:
    with Session(sql_engine) as db_session:
        db_roles: List[Role] = db_session.query(Role).all()

        # asserts presence of id, triggers a db refresh
        for db_role in db_roles:
            if not db_role.handle:
                raise KeyError

        return db_roles


def list_db_roleholderships(
    sql_engine: sa.Engine,
    profile_id: Optional[int] = None,
    role_handle: Optional[str] = None,
) -> List[RoleHoldership]:
    with Session(sql_engine) as db_session:
        filter = sa.and_(sa.true(), sa.true())
        if profile_id is not None:
            filter = sa.and_(filter, RoleHoldership.profile_id == profile_id)
        if role_handle is not None:
            filter = sa.and_(filter, RoleHoldership.role_handle == role_handle)
        db_role_holderships: List[RoleHoldership] = (
            db_session.query(RoleHoldership).filter(filter).all()
        )

        for db_rh in db_role_holderships:
            db_rh.force_load()

        return db_role_holderships


def update_db_roleholderships(
    sql_engine: sa.Engine, new_role_holderships: List[RoleHoldershipUpdateInOut]
) -> Tuple[List[RoleHoldershipUpdateInOut], List[Tuple[RoleHoldershipInOut, str]]]:
    """
    Returns:
        List[Profile]: successfully created role holderships
        List[Tuple[RoleHoldership, str]]: failed role holderships with error message
    """
    created_profiles = []
    error_profiles = []

    for new_role_holdership in new_role_holderships:
        try:
            with Session(sql_engine) as db_session:
                if new_role_holdership.method == "create":
                    created_role_holdership = RoleHoldership(
                        profile_id=new_role_holdership.profile_id,
                        role_handle=new_role_holdership.role_handle,
                    )
                    db_session.add(created_role_holdership)
                    db_session.commit()

                    created_profiles.append(
                        RoleHoldershipUpdateInOut.from_db_model(
                            created_role_holdership,
                            new_role_holdership.method,
                        )
                    )

                elif new_role_holdership.method == "delete":
                    db_session.query(RoleHoldership).filter(
                        sa.and_(
                            RoleHoldership.profile_id == new_role_holdership.profile_id,
                            RoleHoldership.role_handle
                            == new_role_holdership.role_handle,
                        )
                    ).delete()
                    db_session.commit()
                    created_profiles.append(new_role_holdership)

                else:
                    error_profiles.append(
                        (
                            new_role_holdership,
                            f"Method {new_role_holdership.method} does not exist!",
                        )
                    )

        except Exception as e:
            if "unique constraint" in str(e):
                error_profiles.append((new_role_holdership, "Already exists!"))
            else:
                traceback.print_exc()
                error_profiles.append(
                    (
                        new_role_holdership,
                        str(e) or "Unknown error while creating role holdership!",
                    )
                )
            continue

    return created_profiles, error_profiles


# ------------------------------------------------------------------------------------ #
#                      DepartmemtMembership management operations                      #
# ------------------------------------------------------------------------------------ #


def list_db_department_memberships(
    sql_engine: sa.Engine,
    page: int = 1,
    page_size: int = 100,
    profile_id: Optional[int] = None,
    department_handle: Optional[str] = None,
    position: Optional[str] = None,
    started_before: Optional[datetime.datetime] = None,
    started_after: Optional[datetime.datetime] = None,
    ended_before: Optional[datetime.datetime] = None,
    ended_after: Optional[datetime.datetime] = None,
) -> List[DepartmentMembership]:
    with Session(sql_engine) as db_session:
        # build filter
        filter = sa.and_(sa.true(), sa.true())
        if profile_id is not None:
            filter = sa.and_(filter, DepartmentMembership.profile_id == profile_id)
        if department_handle is not None:
            filter = sa.and_(
                filter, DepartmentMembership.department_handle == department_handle
            )
        if position is not None:
            filter = sa.and_(filter, DepartmentMembership.position == position)
        if started_before is not None:
            filter = sa.and_(filter, DepartmentMembership.time_from < started_before)
        if started_after is not None:
            filter = sa.and_(filter, DepartmentMembership.time_from > started_after)
        if ended_before is not None:
            filter = sa.and_(filter, DepartmentMembership.time_to < ended_before)
        if ended_after is not None:
            filter = sa.and_(filter, DepartmentMembership.time_to > ended_after)

        db_department_memberships: List[DepartmentMembership] = (
            db_session.query(DepartmentMembership)
            .filter(filter)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        for dm in db_department_memberships:
            dm.force_load()

        return db_department_memberships


def get_db_department_memberships(
    sql_engine: sa.Engine, department_membership_id: int
) -> DepartmentMembership:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(DepartmentMembership).get(department_membership_id)
        if not db_model:
            raise KeyError
        db_model.force_load()
        return db_model


def create_db_department_memberships(
    sql_engine: sa.Engine,
    new_department_memberships: List[DepartmentMembershipInCreate],
) -> Tuple[List[DepartmentMembership], List[Tuple[DepartmentMembershipInCreate, str]]]:
    """
    Returns:
        List[DepartmentMembership]: successfully created memberships
        List[Tuple[DepartmentMembershipInCreate, str]]:
            failed memberships with error message
    """
    created_memberships = []
    error_memberships = []

    for new_membership in new_department_memberships:
        try:
            with Session(sql_engine) as db_session:
                created_membership = DepartmentMembership(
                    profile_id=new_membership.profile_id,
                    department_handle=new_membership.department_handle,
                    position=new_membership.position,
                    time_from=new_membership.time_from,
                    time_to=new_membership.time_to,
                )
                db_session.add(created_membership)
                db_session.commit()
                created_membership.force_load()
                created_memberships.append(created_membership)

        except Exception as ex:
            error_memberships.append(
                (
                    new_membership,
                    str(ex) or "Unknown error while creating department membership!",
                )
            )

    return created_memberships, error_memberships


def update_db_department_memberships(
    sql_engine: sa.Engine,
    department_memberships: List[DepartmentMembershipInUpdate],
) -> Tuple[List[DepartmentMembership], List[Tuple[DepartmentMembershipInUpdate, str]]]:
    """
    Returns:
        List[DepartmentMembership]: successfully updated department_memberships
        List[Tuple[DepartmentMembershipInUpdate, str]]: failed department_memberships
            with error message
    """
    updated_memberships = []
    error_memberships = []

    for membership in department_memberships:
        try:
            with Session(sql_engine) as db_session:
                db_membership = db_session.query(DepartmentMembership).get(
                    membership.id
                )

                if not db_membership:
                    raise ValueError(
                        f"Membership with id {membership.id} does not exist!"
                    )
                db_membership.position = membership.position
                db_membership.time_from = membership.time_from
                db_membership.time_to = membership.time_to

                db_session.add(db_membership)
                db_session.commit()
                db_membership.force_load()
                updated_memberships.append(db_membership)

        except Exception as ex:
            error_memberships.append(
                (
                    membership,
                    str(ex) or "Unknown error while updating department membership!",
                )
            )

    return updated_memberships, error_memberships


def delete_db_department_memberships(
    sql_engine: sa.Engine,
    department_membership_ids: List[int],
) -> List[int]:
    with Session(sql_engine) as db_session:
        stmt = sa.delete(DepartmentMembership).where(
            DepartmentMembership.id.in_(department_membership_ids)
        )
        db_session.execute(stmt)
        db_session.commit()
        return department_membership_ids
