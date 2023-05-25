from typing import (
    Any,
)

from fastapi import (
    FastAPI,
    Request,
)

# from security.auth import create_auth_roles, init_server_auth
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from database.setup import (
    close_db_client,
    setup_db_client,
)
from profiles.routes import router as ProfilesRouter
from security.decorators import (
    ensure_authenticated,
)
from security.firebase_auth import (
    init_firebase_auth,
)
from template.routes import router as TemplateRouter
from utils.config import (
    CONFIG,
)
from utils.log import (
    log,
)

app = FastAPI()
db_client = None

# synchronous setup
# ------------------------------------------------------------------------------#
init_firebase_auth()

log.debug(CONFIG.get("AUTH_ALLOWED_ORIGINS"))
allow_all = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG.get("AUTH_ALLOWED_ORIGINS"),
    allow_credentials=True,
    allow_methods=allow_all,
    allow_headers=allow_all,
)
# ------------------------------------------------------------------------------#


# asynchronous setup
@app.on_event("startup")
async def startup_event():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    log.debug("async setup..."),
    await setup_db_client(app)


@app.on_event("shutdown")
async def shutdown_event():
    """
    This function is called when the application shuts down.
    It is used to perform any cleanup tasks.
    """
    log.debug("async shutdown..."),
    await close_db_client(app)


# TODO: redirect to the main tumai-space page
@app.get("/", tags=["Root"])
async def root():
    return {"msg": "Welcome to tumai-space"}


@app.get("/auth-test", tags=["Root"])
@ensure_authenticated
def auth_test(request: Request):
    return {"msg": "Auth test: success"}


# Prefix defined in router
app.include_router(ProfilesRouter, tags=["Profile"])

# Include here all the routes from the different modules
app.include_router(TemplateRouter, prefix="/template", tags=["Template"])

# app.include_router(CertificationRouter, prefix="/certification", tags=["Certification"])
