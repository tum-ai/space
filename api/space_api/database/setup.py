import os
from urllib.parse import quote_plus

from fastapi import FastAPI
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.orm.session import Session

from space_api.profiles.db_views import init_views
from space_api.utils.log import log

from .db_models import Department, Role, SaBaseModel

DBSession = scoped_session(sessionmaker())


DB_HOST = os.environ["DB_HOST"]
DB_PORT = int(os.getenv("DB_PORT") or "5432")
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]


def create_sqla_engine() -> Engine:
    conn_str = f"postgresql://{DB_USER}:%s@{DB_HOST}:{DB_PORT}/{DB_NAME}" % quote_plus(
        DB_PASSWORD
    )
    engine: Engine = create_engine(
        conn_str,
        echo=True,
    )
    return engine


async def setup_db_client(running_app: FastAPI) -> None:
    log.info("Setting up sqlalchemy/postgres database connection")
    # sqlalchemy: postgres db
    running_app.state.sql_engine = create_sqla_engine()

    # create/initialize tables
    DBSession.configure(bind=running_app.state.sql_engine)

    # create views
    init_views(running_app.state.sql_engine, SaBaseModel)

    SaBaseModel.metadata.create_all(bind=running_app.state.sql_engine, checkfirst=True)

    # add pre-existing roles
    upset_roles(running_app.state.sql_engine)

    # add pre-existing roles
    upset_roles(running_app.state.sql_engine)

    # add pre-existing departments
    upset_departments(running_app.state.sql_engine)


def setup_db_client_appless() -> Engine:
    log.info("Setting up sqlalchemy/postgres database connection")

    # sqlalchemy: postgres db
    return create_sqla_engine()


async def close_db_client(running_app: FastAPI) -> None:
    log.info("Closing sqlalchemy/postgres database connection")
    if running_app.state.sql_engine is not None:
        running_app.state.sql_engine.dispose()


def upset_departments(engine: Engine) -> None:
    core_departments = [
        Department(
            handle="DEV",
            name="Software Development",
            description="Software Development",
        ),
        Department(
            handle="MARKETING",
            name="Marketing",
            description="Marketing",
        ),
        Department(
            handle="INDUSTRY",
            name="Industry",
            description="Industry",
        ),
        Department(
            handle="MAKEATHON",
            name="Makeathon",
            description="Makeathon",
        ),
        Department(
            handle="COMMUNITY",
            name="Community",
            description="Community",
        ),
        Department(
            handle="PNS",
            name="Partners & Sponsors",
            description="Partners & Sponsors",
        ),
        Department(
            handle="LNF",
            name="Legal & Finance",
            description="Legal & Finance",
        ),
        Department(
            handle="VENTURE",
            name="Venture",
            description="Venture",
        ),
        Department(
            handle="EDUCATION",
            name="Education",
            description="Education",
        ),
        Department(
            handle="RND",
            name="Research & Development",
            description="Research & Development",
        ),
    ]

    with Session(engine) as session:
        for department in core_departments:
            session.merge(department)
        session.commit()


def upset_roles(engine: Engine) -> None:
    core_roles = [
        Role(handle="admin", description="Administrator"),
        Role(handle="invite_members", description="Member Invitations"),
        Role(handle="role_assignment", description="Role Assignments"),
        Role(
            handle="departmemt_membership_management",
            description="View and update department memberships of members",
        ),
        Role(handle="create_certificate", description="Access Certification Rendering"),
        Role(handle="submit_reviews", description="Submit Reviews Access"),
    ]

    with Session(engine) as session:
        for role in core_roles:
            session.merge(role)
        session.commit()
