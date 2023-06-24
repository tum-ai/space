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

from space_api.database.db_models import (
    Role,
    SaBaseModel,
)
from space_api.profiles.db_views import (
    init_views,
)
from space_api.utils.log import (
    log,
)

DBSession = scoped_session(sessionmaker())


def create_sqla_engine() -> Engine:
    db_host = os.getenv("DB_HOST")
    db_port = int(os.getenv("DB_PORT", "-1"))
    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD") or "<missing_password>"
    assert db_host is not None, "DB_HOST must not be empty!"

    conn_str = f"postgresql://{db_user}:%s@{db_host}:{db_port}/{db_name}" % quote_plus(
        db_password
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
        Role(
            handle="departmemt_membership_management",
            description="View and update department memberships of members",
        ),
        Role(handle="create_certificate", description="Access Certification Rendering"),
    ]

    with Session(engine) as session:
        for role in core_roles:
            session.merge(role)
        session.commit()
