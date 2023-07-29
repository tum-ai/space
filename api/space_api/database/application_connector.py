import sqlalchemy as sa
from sqlalchemy.orm import Session

from .db_models import Application


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

        return db_applications


def list_db_application(sql_engine: sa.Engine, application_id: int) -> Application:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(Application).get(application_id)
        assert db_model is not None, "Application not found"
        return db_model


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
