from typing import Any, List
from database.db_models import MembershipApplicationReview
from review_tool.api_models import MembershipApplicationReviewOut

from utils.response import BaseResponse


class ResponseSubmitReview(BaseResponse):
    
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
