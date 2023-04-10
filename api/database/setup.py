from fastapi import FastAPI

from projects.models import Base

from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import scoped_session, sessionmaker

from main import log


DBSession = scoped_session(sessionmaker())


async def setup_db_client(running_app: FastAPI):
    # TODO: set up secrets

    log.info("Setting up sqlalchemy/postgres database connection")
    # sqlalchemy: postgres db
    running_app.state.sql_engine: Engine = create_engine(
        # TODO env variables
        "postgresql://supertokens_user:somePassword@auth-db:5432/supertokens",
        echo=True
    )

    # create/initialize tables
    DBSession.configure(bind=running_app.state.sql_engine)
    Base.metadata.bind = running_app.state.sql_engine
    Base.metadata.create_all(running_app.state.sql_engine)


async def close_db_client(running_app: FastAPI):
    log.info("Closing sqlalchemy/postgres database connection")
    # nothing to do

