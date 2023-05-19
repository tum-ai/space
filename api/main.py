import time

from fastapi import FastAPI, Request

from config import CONFIG


from security.firebase_auth import init_firebase_auth, verify_id_token

# from security.auth import create_auth_roles, init_server_auth
from fastapi.middleware.cors import CORSMiddleware

# from supertokens_python import get_all_cors_headers
# from supertokens_python.framework.fastapi import get_middleware
from template.routes import router as TemplateRouter

# log.warn("BUGFIX. Sleeping 4 seconds for supertokens to finish starting up as Docker doesn't wait long enough by "
#          "default!")
# time.sleep(4)

import logging
from logging.config import (
    dictConfig,
)

from pydantic import (
    BaseModel,
)


class LogConfig(BaseModel):
    """Logging configuration to be set for the server"""

    LOGGER_NAME: str = CONFIG.get("LOGGER_NAME")
    LOG_FORMAT: str = "%(levelprefix)s | %(asctime)s | %(message)s"
    LOG_LEVEL: str = CONFIG.get("LOG_LEVEL")

    # Logging config
    version = 1
    disable_existing_loggers = False
    formatters = {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": LOG_FORMAT,
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    }
    handlers = {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
    }
    loggers = {
        LOGGER_NAME: {"handlers": ["default"], "level": LOG_LEVEL},
    }


dictConfig(LogConfig().dict())
log = logging.getLogger(CONFIG.get("LOGGER_NAME"))


app = FastAPI()
db_client = None

# synchronous setup
# ------------------------------------------------------------------------------#
# init_server_auth()  # supertokens - outdated

# init_firebase_auth()

allow_all = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_all,  # TODO: adjust for production
    allow_credentials=True,
    allow_methods=allow_all,
    allow_headers=allow_all,
)

# https://www.starlette.io/middleware/ scroll down to CORSMiddleware
# log.debug(CONFIG.get("AUTH_ALLOWED_ORIGINS")),
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=CONFIG.get("AUTH_ALLOWED_ORIGINS"),
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
#     allow_headers=["Content-Type"] + get_all_cors_headers(),
# )
# TODO: add CORSMiddleware for other subdomains
# ------------------------------------------------------------------------------#


# asynchronous setup
@app.on_event("startup")
async def startup_event():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    # TODO
    # await setup_db_client(app)
    # await create_auth_roles()


@app.on_event("shutdown")
async def shutdown_event():
    """
    This function is called when the application shuts down.
    It is used to perform any cleanup tasks.
    """
    # TODO
    # await close_db_client(app)


# TODO: redirect to the main tumai-space page
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the root of the tumai-space. Delete me later."}


@app.get("/auth-test", tags=["Root"])
async def root(request: Request):
    headers = request.headers
    jwt = headers.get("authorization")
    if jwt:
        return {"message": "Auth test:", "data": verify_id_token(jwt)}
    else:
        return {"message": "No auth token supplied!"}


# Include here all the routes from the different modules
# app.include_router(TemplateRouter, prefix="/template", tags=["Template"])

# app.include_router(CertificationRouter, prefix="/certification", tags=["Certification"])

# Prefix defined in router
# app.include_router(ProfilesRouter, tags=["Profile"])
