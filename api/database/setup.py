import os

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

from main import (
    log,
)
from profiles.db_views import (
    init_views,
)
from projects.db_models import (
    Base,
)

DBSession = scoped_session(sessionmaker())


async def setup_db_client(running_app: FastAPI):
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    log.info("Setting up sqlalchemy/postgres database connection")
    # sqlalchemy: postgres db
    running_app.state.sql_engine: Engine = create_engine(
        f"postgresql://{DB_USER}:{DB_PASSWORD}{DB_HOST}:{DB_PORT}/{DB_NAME}",
        echo=True,
    )

    # create/initialize tables
    DBSession.configure(bind=running_app.state.sql_engine)
    Base.metadata.bind = running_app.state.sql_engine

    # create views
    init_views(running_app.state.sql_engine, Base)

    Base.metadata.create_all(running_app.state.sql_engine, checkfirst=True)


def setup_db_client_appless() -> Engine:
    log.info("Setting up sqlalchemy/postgres database connection")

    # sqlalchemy: postgres db
    sql_engine: Engine = create_engine(
        # TODO env variables
        "postgresql://supertokens_user:somePassword@auth-db:5432/supertokens",
        echo=True,
    )

    return sql_engine


async def close_db_client(running_app: FastAPI):
    log.info("Closing sqlalchemy/postgres database connection")
    # nothing to do
