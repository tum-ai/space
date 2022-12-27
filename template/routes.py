from fastapi import APIRouter, Body

from database.templates_connector import *
from template.models import Response

router = APIRouter()


@router.get("/", response_description="List all template messages", response_model=Response)
async def list_all_templates():
    template_messages = await retrieve_all_template_messages()
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "All template messages retrieved successfully.",
        "data": template_messages
    }


@router.post("/", response_description="Add a new template message", response_model=Response)
async def add_template(template: TemplateMessage = Body(...)):
    new_template_message = await add_template_message(template)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Template message added successfully.",
        "data": new_template_message
    }


@router.get("/{id_}", response_description="Get a single template message", response_model=Response)
async def show_template(id_: PydanticObjectId):
    template_message = await retrieve_template_message(id_)
    if template_message:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Template message retrieved successfully.",
            "data": template_message
        }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "Template message not found.",
        "data": None
    }
