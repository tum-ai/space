from typing import Optional, Any

from pydantic import BaseModel

from enum import Enum


class Language(Enum):
    EN = "en"
    DE = "de"
    UA = "ua"
    ES = "es"


class TemplateMessage:
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


class CustomResponse(BaseModel):
    status_code: int
    response_type: str
    description: str

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": "+++",
            }
        }


class BaseResponse(BaseModel):
    status_code: int
    response_type: str
    description: str

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": "undefined format...",
            }
        }


class BaseResponse(BaseModel):
    status_code: int
    response_type: str
    description: str

    @classmethod
    def schema_wrapper(cls, data):
        return {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": data,
            }
        }

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": "undefined format",
            }
        }


class Response(BaseResponse):
    data: str

    class Config:
        schema_extra = BaseResponse.schema_wrapper("some data...")
