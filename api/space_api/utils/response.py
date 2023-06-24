from pydantic import (
    BaseModel,
    Extra,
    Field,
)


class BaseResponse(BaseModel):
    status_code: int
    response_type: str
    description: str
    page: int | None = Field(None)
    page_size: int | None = Field(None)

    # TODO:
    # page_has_next: bool | None = Field(None)

    @classmethod
    def schema_wrapper(cls, data) -> dict:
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
