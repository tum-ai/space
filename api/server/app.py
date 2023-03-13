import time

from config import CONFIG
from database.setup import close_db_client, setup_db_client
from fastapi import FastAPI

from main import log
from profiles.routes import router as ProfilesRouter
from security.auth import create_auth_roles, init_server_auth
from starlette.middleware.cors import CORSMiddleware
from supertokens_python import get_all_cors_headers
from supertokens_python.framework.fastapi import get_middleware
from template.routes import router as TemplateRouter

log.warn("BUGFIX. Sleeping 4 seconds for supertokens to finish starting up as Docker doesn't wait long enough by "
         "default!")
time.sleep(4)


app = FastAPI()
db_client = None

# synchronous setup
# ------------------------------------------------------------------------------#
init_server_auth()
app.add_middleware(get_middleware())
# https://www.starlette.io/middleware/ scroll down to CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG.get("AUTH_ALLOWED_ORIGINS"),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)
# TODO: add CORSMiddleware for other subdomains
# ------------------------------------------------------------------------------#


# asynchronous setup
@app.on_event("startup")
async def startup_event():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    await setup_db_client(app)
    await create_auth_roles()


@app.on_event("shutdown")
async def shutdown_event():
    """
    This function is called when the application shuts down.
    It is used to perform any cleanup tasks.
    """
    await close_db_client(app)


# TODO: redirect to the main tumai-space page
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the root of the tumai-space. Delete me later."}


# Include here all the routes from the different modules
app.include_router(TemplateRouter, prefix="/template", tags=["Template"])
# Prefix defined in router
app.include_router(ProfilesRouter, tags=["Profile"])