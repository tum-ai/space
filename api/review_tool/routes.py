from typing import (
    Annotated
)
from database.review_tool_connector import create_db_membership_application_review
from review_tool.api_models import MembershipApplicationReviewIn

from review_tool.response_models import ResponseSubmitReview

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from security.decorators import (
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
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def submit_review(
    request: Request,
    data: Annotated[MembershipApplicationReviewIn, Body(embed=True)],
) -> dict:
    create_db_membership_application_review(
        request.app.state.sql_engine, request.state.profile.id, data
    )

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Review submitted successfully",
    }
