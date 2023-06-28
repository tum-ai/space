from utils.response import (
    BaseResponse,
)


class ResponseSubmitReview(BaseResponse):
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
