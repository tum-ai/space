from typing import (
    Annotated,
    Union
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from database.review_tool_connector import (
    create_db_membership_application_review,
    retrieve_db_membership_application_review
)
from review_tool.api_models import (
    MembershipApplicationReviewIn,
    MembershipApplicationReviewOut
)
from review_tool.response_models import (
    ResponseSubmitReview,
    ResponseMembershipApplicationReview
)
from security.decorators import (
    ensure_authorization,
)
from utils.error_handlers import (
    error_handlers,
)
from utils.response import (
    ErrorResponse,
)

router = APIRouter()


@router.post(
    "/review_tool/membership_application_review",
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


@router.get(
    "/review_tool/get_review/{profile_id}/",
    response_description="Get user application by id.",
    response_model=Union[ResponseMembershipApplicationReview, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_membership_application(request: Request, profile_id: int) -> dict:
    db_model = retrieve_db_membership_application_review(
        request.app.state.sql_engine, profile_id
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved application successfully",
        "data": MembershipApplicationReviewOut.from_db_model(db_model),
    }