from typing import (
    List,
)

import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from membership_application.api_models import (
    MembershipApplicationReferralIn,
)

from .db_models import (
    MembershipApplication,
    MembershipApplicationReferral,
)


def list_db_membership_application(
    sql_engine: sa.Engine, page: int, page_size: int
) -> List[MembershipApplication]:
    with Session(sql_engine) as db_session:
        db_membership_applications: List[MembershipApplication] = (
            db_session.query(MembershipApplication)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        # for db_membership_application in db_membership_applications:
        #     db_membership_application.force_load()

        return db_membership_applications


def retrieve_db_membership_application(
    sql_engine: sa.Engine, application_id: int
) -> MembershipApplication:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(MembershipApplication).get(application_id)
        # db_model.force_load()
        return db_model


def create_db_membership_application_referral(
    sql_engine: sa.Engine,
    referral_by: int,
    new_membership_application_referral: MembershipApplicationReferralIn,
) -> MembershipApplicationReferral:
    with Session(sql_engine) as db_session:
        db_membership_application_referral = MembershipApplicationReferral(
            applicant_first_name=new_membership_application_referral.applicant_first_name,
            applicant_last_name=new_membership_application_referral.applicant_last_name,
            points=new_membership_application_referral.points,
            comment=new_membership_application_referral.comment,
            referral_by=referral_by,
        )

        db_session.add(db_membership_application_referral)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        # db_membership_application_referral.force_load()

    return db_membership_application_referral
