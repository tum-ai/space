from review_tool.api_models import (
    MembershipApplicationReviewOut,
    MembershipApplicationReviewListOut
)
from utils.response import (
    BaseResponse,
)
from typing import (
    List,
    Union,
)


class ResponseSubmitReview(BaseResponse):
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])


class ResponseMembershipApplicationReview(BaseResponse):
    data: MembershipApplicationReviewOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(MembershipApplicationReviewOut.dummy())


class ResponseMembershipApplicationReviewList(BaseResponse):
    data: List[MembershipApplicationReviewListOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(MembershipApplicationReviewListOut.dummy())
