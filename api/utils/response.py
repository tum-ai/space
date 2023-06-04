from typing import (
    Optional,
)

from pydantic import (
    BaseModel,
    Extra,
    Field,
)


class BaseResponse(BaseModel):
    status_code: int
    response_type: str
    description: str
    page: Optional[int] = Field(None)
    page_size: Optional[int] = Field(None)

    # TODO:
    # page_has_next: Optional[bool] = Field(None)

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
            }
        }


class ErrorResponse(BaseResponse):
    class Config:
        extra = Extra.forbid
        schema_extra = {
            "example": {
                "status_code": 400,
                "response_type": "error",
                "description": "Bad request",
            }
        }
