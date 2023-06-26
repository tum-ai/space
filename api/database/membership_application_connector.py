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

from membership_application.api_models import (
    MembershipApplicationIn,
    MembershipApplicationOut,
    MembershipApplicationReferralIn,
)
from .db_models import (
    MembershipApplication,
    MembershipApplicationReferral
)


def create_db_membership_application(
    sql_engine: sa.Engine,
    new_membership_application: MembershipApplicationIn,
) -> MembershipApplication:
    with Session(sql_engine) as db_session:
        db_membership_application = MembershipApplication(
            first_name=new_membership_application.first_name,
            last_name=new_membership_application.last_name,
            email=new_membership_application.email,
            phone=new_membership_application.phone,
            gender=new_membership_application.gender,
            nationality=new_membership_application.nationality,
            birthday=new_membership_application.birthday,
            place_of_residence=new_membership_application.place_of_residence,
            resume=new_membership_application.resume,
            linkedin=new_membership_application.linkedin,
            personal_website=new_membership_application.personal_website,
            github=new_membership_application.github,
            occupation=new_membership_application.occupation,
            degree_level=new_membership_application.degree_level,
            degree_name=new_membership_application.degree_name,
            degree_semester=new_membership_application.degree_semester,
            university=new_membership_application.university,
            areas_of_expertise=new_membership_application.areas_of_expertise,
            hours_per_week=new_membership_application.hours_per_week,
            drive_passion=new_membership_application.drive_passion,
            what_sets_apart=new_membership_application.what_sets_apart,
            most_proud_achievement=new_membership_application.most_proud_achievement,
            learning_from_project_failure=new_membership_application.learning_from_project_failure,
            expectations=new_membership_application.expectations,
            what_want_to_do=new_membership_application.what_want_to_do,
            upcoming_commitments=new_membership_application.upcoming_commitments,
            topics_ai=new_membership_application.topics_ai,
            skills=new_membership_application.skills,
            num1_department_choice=new_membership_application.num1_department_choice,
            num2_department_choice=new_membership_application.num2_department_choice,
            num3_department_choice=new_membership_application.num3_department_choice,
            num1_department_reasoning=new_membership_application.num1_department_reasoning,
            num2_department_reasoning=new_membership_application.num2_department_reasoning,
            num3_department_reasoning=new_membership_application.num3_department_reasoning,
            department_reasoning=new_membership_application.department_reasoning,
            research_development_interest=new_membership_application.research_development_interest,
            research_development_reasoning=new_membership_application.research_development_reasoning,
            tumai_awareness=new_membership_application.tumai_awareness,
            shirtSize=new_membership_application.shirtSize,
            becomeTeamlead=new_membership_application.becomeTeamlead,
            teamlead_reasoning=new_membership_application.teamlead_reasoning,
        )

        db_session.add(db_membership_application)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db_membership_application.force_load()

    return db_membership_application


def list_db_membership_application(sql_engine: sa.Engine, page: int, page_size: int) -> List[MembershipApplication]:
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


def retrieve_db_membership_application(sql_engine: sa.Engine, application_id: int) -> MembershipApplication:
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
            referral_by=referral_by
        )

        db_session.add(db_membership_application_referral)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        # db_membership_application_referral.force_load()

    return db_membership_application_referral
