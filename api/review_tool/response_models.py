from typing import Any, List
from database.db_models import MembershipApplicationReview
from review_tool.api_models import MembershipApplicationReviewData

from utils.response import BaseResponse


class ResponseSubmitReview(BaseResponse):
    succeeded: str

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
