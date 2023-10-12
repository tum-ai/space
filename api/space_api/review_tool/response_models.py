from pydantic import ConfigDict

from space_api.review_tool.api_models import (
    ApplicationReviewOut,
    MyApplicationReviewOut,
)
from space_api.utils.response import BaseResponse


class ResponseSubmitReview(BaseResponse):
    model_config = ConfigDict(json_schema_extra={"example": []})


class ResponseApplicationReview(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra={"example": ApplicationReviewOut.dummy()}
    )
    data: ApplicationReviewOut


class ResponseApplicationReviewList(BaseResponse):
    model_config = ConfigDict(
        json_schema_extra={"example": [ApplicationReviewOut.dummy()]}
    )
    data: list[ApplicationReviewOut]


class ResponseMyApplicationReviewList(BaseResponse):
    model_config = ConfigDict(json_schema_extra={"example": []})
    data: list[MyApplicationReviewOut]


class ResponseDeleteReview(BaseResponse):
    model_config = ConfigDict(json_schema_extra={"example": []})
