from typing import Optional, Any

from pydantic import BaseModel

# A library to ease the interaction with the MongoDB database: https://beanie-odm.dev/
from beanie import Document
from enum import Enum


class Language(Enum):
    EN = "en"
    DE = "de"
    UA = "ua"
    ES = "es"


class TemplateMessage(Document):
    sender_full_name: str
    email: str

    language: Language = Language.EN
    message: str

    class Config:
        schema_extra = {
            "example": {
                "sender_full_name": "John Doe",
                "email": "john.doe@gmail.com",
                "language": "de",
                "message": "Hello TUM.ai Space!",
            }
        }

    class Settings:
        # This means that the collection name will be "templates" within the "tumai-space" database
        name = "templates"


class UpdateTemplateMessage(BaseModel):
    sender_full_name: Optional[str]
    email: Optional[str]

    language: Optional[Language]
    message: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "sender_full_name": "John Doe the Second",
                "email": "john.doe2@gmail.com",
                "language": "ua",
                "message": "Hello TUM.ai Space!!!",
            }
        }

    class Collection:
        template = "templates"


class Response(BaseModel):
    status_code: int
    response_type: str
    description: str
    data: Optional[Any]

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": "Sample data",
            }
        }
