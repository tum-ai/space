from typing import (
    List,
)

import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from .db_models import (
    MembershipApplication,
)


def list_db_membership_application(
    sql_engine: sa.Engine, 
    page: int, 
    page_size: int
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
    sql_engine: sa.Engine, 
    application_id: int
) -> MembershipApplication:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(MembershipApplication).get(application_id)
        # db_model.force_load()
        return db_model
