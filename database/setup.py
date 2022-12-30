from fastapi import FastAPI

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

# from server.main import logger

from template.models import TemplateMessage

document_models = [TemplateMessage]


async def setup_db_client(running_app: FastAPI):
    # TODO: set up secrets
    # TODO: reuse CONFIG from config.py
    # logger.info("Setting up database connection")
    running_app.state.mongodb_client = AsyncIOMotorClient(
        "mongodb://admin:password@localhost:27017/"
    )
    await init_beanie(
        database=running_app.state.mongodb_client["tumai-space"],
        document_models=document_models,
    )


async def close_db_client(running_app: FastAPI):
    # logger.info("Closing database connection")
    running_app.state.mongodb_client.close()
