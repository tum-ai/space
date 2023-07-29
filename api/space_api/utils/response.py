from pydantic import BaseModel, ConfigDict, Field


class BaseResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "status_code": 200,
            "response_type": "success",
            "description": "Operation successful",
        }
    )

    status_code: int
    response_type: str
    description: str
    page: int | None = Field(None)
    page_size: int | None = Field(None)

    # TODO:
    # page_has_next: Optional[bool] = Field(None)

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


class ErrorResponse(BaseResponse):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "status_code": 400,
            "response_type": "error",
            "description": "Bad request",
        },
    )
