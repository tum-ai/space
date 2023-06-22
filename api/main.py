from fastapi import (
    FastAPI,
    Request,
)

# from security.auth import create_auth_roles, init_server_auth
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from certification.routes import router as CertificationRouter
from database.setup import (
    close_db_client,
    setup_db_client,
)
from profiles.routes import router as ProfilesRouter
from security.decorators import (
    ensure_authenticated,
    ensure_authorization,
)
from security.firebase_auth import (
    init_firebase_auth,
)
from utils.config import (
    CONFIG,
)
from utils.error_handlers import (
    error_handlers
)
from utils.log import (
    log,
)
from mail.send import send_email

app = FastAPI()
db_client = None

# synchronous setup
# ------------------------------------------------------------------------------#
init_firebase_auth()

log.debug(CONFIG.get("AUTH_ALLOWED_ORIGINS"))
allow_all = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_all,
    allow_credentials=True,
    allow_methods=allow_all,
    allow_headers=allow_all,
)
# ------------------------------------------------------------------------------#


# asynchronous setup
@app.on_event("startup")
async def startup_event() -> None:
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    log.debug("async setup..."),
    await setup_db_client(app)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """
    This function is called when the application shuts down.
    It is used to perform any cleanup tasks.
    """
    log.debug("async shutdown..."),
    await close_db_client(app)


# TODO: redirect to the main tumai-space page
@app.get("/", tags=["Root"])
async def root() -> dict:
    return {"msg": "Welcome to tumai-space"}


@app.get("/auth-test", tags=["auth-test"])
@ensure_authenticated
def auth_test(request: Request) -> dict:
    return {"msg": "Auth test: success"}


@app.get("/admin-test", tags=["admin-test"])
@error_handlers
@ensure_authorization(any_of_positions=[(None, "board")])
def authorization_position_test(request: Request) -> dict:
    return {"msg": "Admin test: success"}


@app.get("/role-test", tags=["role-test"])
@error_handlers
@ensure_authorization(any_of_roles=["test-role"])
def authorization_role_test(request: Request) -> dict:
    return {"msg": "Role test: success"}


@app.post("/mail-test", tags=["mail-test"])
@error_handlers
@ensure_authorization(any_of_roles=["test-role"])
def email_test(
    request: Request, 
    subject: str, 
    body: str,
) -> dict:
    send_email(
        receipient="admin+tumaispacedev@tum-ai.com",
        subject=subject,
        body=body
    )
    return {"msg": "Send success!"}


# Prefix defined in router
app.include_router(ProfilesRouter, tags=["Profile"])
app.include_router(CertificationRouter, tags=["Certification"])
