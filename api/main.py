

from fastapi import (
    FastAPI,
    Request,
)

# from security.auth import create_auth_roles, init_server_auth
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from utils.config import (
    CONFIG,
)

from database.setup import (setup_db_client, close_db_client)

from security.firebase_auth import (
    init_firebase_auth,
    verify_id_token,
)
from template.routes import router as TemplateRouter
from profiles.routes import router as ProfilesRouter

from utils.log import log


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
async def auth_test(request: Request):
    headers = request.headers
    jwt = headers.get("authorization")
    if jwt:
        user = verify_id_token(jwt)
        if user:
            return {"msg": "Auth test: success", "data": user}
        else:
            return {"msg": "Auth test: failed"}
    else:
        return {"msg": "No auth token supplied!"}


# Include here all the routes from the different modules
app.include_router(TemplateRouter, prefix="/template", tags=["Template"])

# app.include_router(CertificationRouter, prefix="/certification", tags=["Certification"])

# Prefix defined in router
app.include_router(ProfilesRouter, tags=["Profile"])
