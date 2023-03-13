from beanie import init_beanie
from config import CONFIG
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from profiles.models import Profile
from template.models import TemplateMessage

# from server.main import logger



document_models = [TemplateMessage, Profile]


async def setup_db_client(running_app: FastAPI):
    # TODO: set up secrets
    # TODO: reuse CONFIG from config.py
    # logger.info("Setting up database connection")
    running_app.state.mongodb_client = AsyncIOMotorClient(
        "mongodb://admin:password@" + CONFIG.get("MONGODB_HOST") + ":" + CONFIG.get("MONGODB_PORT") + "/"
    )
    await init_beanie(
        database=running_app.state.mongodb_client["tumai-space"],
        document_models=document_models,
    )


async def close_db_client(running_app: FastAPI):
    # logger.info("Closing database connection")
    running_app.state.mongodb_client.close()
