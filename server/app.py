from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from supertokens_python.framework.fastapi import get_middleware
from supertokens_python import get_all_cors_headers

from config import init_auth, CONFIG
from template.routes import router as TemplateRouter

from database.setup import setup_db_client, close_db_client


app = FastAPI()
db_client = None

# synchronous setup
init_auth()
app.add_middleware(get_middleware())
# https://www.starlette.io/middleware/ scroll down to CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG.get("AUTH_ALLOWED_ORIGINS"),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)


# asynchronous setup
@app.on_event("startup")
async def startup_event():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    await setup_db_client(app)


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
