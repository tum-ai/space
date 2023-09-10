import sqlalchemy as sa
from sqlalchemy.orm import Session

from space_api.applications.api_models import ApplicationReferralInOut

from .db_models import Application, ApplicationReferral


def list_db_applications(
    sql_engine: sa.Engine, page: int, page_size: int
) -> list[Application]:
    with Session(sql_engine) as db_session:
        db_applications: list[Application] = (
            db_session.query(Application)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        for db_application in db_applications:
            db_application.force_load()

        return db_applications


def list_db_application(
        sql_engine: sa.Engine,
        application_id: int
) -> Application:
    with Session(sql_engine) as db_session:
        db_application: Application | None = db_session.query(
            Application).get(application_id)

        assert db_application is not None, "Application not found"
        db_application.force_load()

        return db_application


def create_db_application(
    sql_engine: sa.Engine,
    submission: dict,
) -> Application:
    with Session(sql_engine) as db_session:
        db_application = Application(submission=submission)

        db_session.add(db_application)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        # db_membership_application_referral.force_load()

    return db_application


def list_db_referrals(
    sql_engine: sa.Engine, referer_id: int, page: int, page_size: int
) -> list[ApplicationReferral]:
    with Session(sql_engine) as db_session:
        db_referrals: list[ApplicationReferral] = (
            db_session.query(ApplicationReferral)
            .filter(ApplicationReferral.referer_id == referer_id)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        for db_referral in db_referrals:
            db_referral.force_load()

        return db_referrals


def create_db_referral(
    sql_engine: sa.Engine,
    referer_id: int,
    referral: ApplicationReferralInOut,
) -> ApplicationReferral:
    with Session(sql_engine) as db_session:
        db_referral = ApplicationReferral(
            email=referral.email,
            first_name=referral.first_name,
            last_name=referral.last_name,
            comment=referral.comment,
            referer_id=referer_id
        )

        db_session.add(db_referral)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        # db_membership_application_referral.force_load()

    return db_referral


def delete_db_referral(
    sql_engine: sa.Engine,
    referer_id: int,
    email: str,
) -> bool:
    with Session(sql_engine) as db_session:
        db_referral = (
            db_session.query(ApplicationReferral)
            .filter(sa.and_(ApplicationReferral.referer_id == referer_id,
                            ApplicationReferral.email == email))
            .first()
        )

        if db_referral:
            db_session.delete(db_referral)
            db_session.commit()
            return True

    return False


def delete_db_application(
        sql_engine: sa.Engine,
        id: int) -> bool:
    with Session(sql_engine) as db_session:

        db_application = (
            db_session.query(Application)
            .filter(Application.id == id)
            .first()
        )

        if db_application:
            db_session.delete(db_application)
            db_session.commit()
            return True

        return False
