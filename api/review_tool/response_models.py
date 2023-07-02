from review_tool.api_models import MembershipApplicationReviewOut
from utils.response import (
    BaseResponse,
)


class ResponseSubmitReview(BaseResponse):
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])


class ResponseMembershipApplicationReview(BaseResponse):
    data: MembershipApplicationReviewOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(MembershipApplicationReviewOut.dummy())
