from pydantic import ConfigDict

from space_api.review_tool.api_models import (
    ApplicationReviewOut,
    MyApplicationReviewOut,
)
from space_api.utils.response import BaseResponse


class ResponseSubmitReview(BaseResponse):
    model_config = ConfigDict(json_schema_extra={"example": []})

class ResponseApplicationReview(BaseResponse):
    data: ApplicationReviewOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(ApplicationReviewOut.dummy())


class ResponseApplicationReviewList(BaseResponse):
     data: list[ApplicationReviewOut]

     class Config:
         schema_extra = BaseResponse.schema_wrapper(ApplicationReviewOut.dummy())

class ResponseMyApplicationReviewList(BaseResponse):
    data: list[MyApplicationReviewOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(MyApplicationReviewOut.dummy())

class ResponseDeleteReview(BaseResponse):
    model_config = ConfigDict(json_schema_extra={"example": []})
