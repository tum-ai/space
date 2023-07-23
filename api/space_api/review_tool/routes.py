from typing import Annotated

from fastapi import APIRouter, Body, Request

from space_api.database.review_tool_connector import create_db_application_review
from space_api.security.decorators import ensure_authorization
from space_api.utils.error_handlers import error_handlers

from .api_models import ApplicationReviewIn
from .response_models import ResponseSubmitReview

router = APIRouter()


@router.post(
    "/review_tool/application_review",
    response_description="Submit a review of a  application.",
    response_model=ResponseSubmitReview,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def submit_review(
    request: Request,
    data: Annotated[ApplicationReviewIn, Body(embed=True)],
) -> dict:
    create_db_application_review(
        request.app.state.sql_engine, request.state.profile.id, data
    )

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Review submitted successfully",
    }
