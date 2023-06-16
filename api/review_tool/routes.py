from typing import (
    Annotated,
    List,
    Optional,
    Union,
)
from database.review_tool_connector import create_db_membership_application_review
from review_tool.api_models import MembershipApplicationReviewData

from review_tool.response_models import ResponseSubmitReview
from database.db_models import PositionType
from utils.response import ErrorResponse

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from security.decorators import (
    ensure_authenticated,
    ensure_authorization,
)
from utils.error_handlers import (
    error_handlers,
)

router = APIRouter()


@router.post(
    "/review_tool/submit/membership_application_review",
    response_description="Submit a review of a membership application.",
    response_model=ResponseSubmitReview,
)
@error_handlers
# @ensure_authorization(
#     any_of_positions=[(PositionType.MEMBER, "community"), (None, "board")],
#     any_of_roles=["submit_reviews"],
# )
def submit_review(
    request: Request,
    data: Annotated[MembershipApplicationReviewData, Body(embed=True)],
) -> dict:
    created_membership_application_review = create_db_membership_application_review(
        request.app.state.sql_engine, data
    )

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Review submitted successfully",
        "succeeded": "Successfully submitted membership application review",
    }
