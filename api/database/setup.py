import os
from urllib.parse import (
    quote_plus,
)

from fastapi import (
    FastAPI,
)
from sqlalchemy import (
    Engine,
    create_engine,
)
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
)
from sqlalchemy.orm.session import (
    Session,
)

from database.db_models import (
    Role,
    SaBaseModel,
)

from profiles.db_views import (
    init_views,
)
from utils.log import (
    log,
)


DBSession = scoped_session(sessionmaker())


def create_sqla_engine() -> Engine:
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    assert DB_HOST is not None, "DB_HOST must not be empty!"

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
    running_app.state.sql_engine: Engine = create_sqla_engine()

    # create/initialize tables
    DBSession.configure(bind=running_app.state.sql_engine)

    SaBaseModel.metadata.bind = running_app.state.sql_engine

    # create views
    init_views(running_app.state.sql_engine, SaBaseModel)

    SaBaseModel.metadata.create_all(running_app.state.sql_engine, checkfirst=True)

    # add pre-existing roles
    upset_roles(running_app.state.sql_engine)

    # add pre-existing roles
    upset_roles(running_app.state.sql_engine)


def setup_db_client_appless() -> Engine:
    log.info("Setting up sqlalchemy/postgres database connection")

    # sqlalchemy: postgres db
    return create_sqla_engine()


async def close_db_client(running_app: FastAPI) -> None:
    log.info("Closing sqlalchemy/postgres database connection")
    if running_app.state.sql_engine is not None:
        running_app.state.sql_engine.dispose()


def upset_roles(engine: Engine) -> None:
    core_roles = [
        Role(handle="admin", description="Administrator"),
        Role(handle="invite_members", description="Member Invitations"),
        Role(handle="role_assignment", description="Role Assignments"),
        Role(handle="create_certificate", description="Access Certification Rendering"),
        Role(handle="submit_reviews", description="Submit Reviews Access"),
    ]

    with Session(engine) as session:
        for role in core_roles:
            session.merge(role)
        session.commit()
