from typing import Annotated

from fastapi import APIRouter, Body, Request

from space_api.database.review_tool_connector import (
    create_db_application_review,
    delete_db_application_review,
    retrieve_db_application_all_reviews,
    retrieve_db_application_all_reviews_for_reviewer,
    retrieve_db_application_review,
    update_db_application_review,
)
from space_api.security.decorators import ensure_authorization
from space_api.utils.error_handlers import error_handlers
from space_api.utils.paging import enable_paging
from space_api.utils.response import ErrorResponse

from .api_models import (
    ApplicationReviewIn,
    ApplicationReviewOut,
    ApplicationReviewUpdate,
    MyApplicationReviewOut,
)
from .response_models import (
    ResponseApplicationReview,
    ResponseApplicationReviewList,
    ResponseDeleteReview,
    ResponseSubmitReview,
)

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


@router.get(
    "/review_tool/review/{review_id}/",
    response_description="Get user review by review_id.",
    response_model=ResponseApplicationReview | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_application(request: Request, review_id: int) -> dict:
    db_model = retrieve_db_application_review(
        request.app.state.sql_engine, review_id
    )
    if db_model is None:
        return {
            "status_code": 404,
            "response_type": "error",
            "description": "Review not found",
        }
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved application successfully",
        "data": ApplicationReviewOut.from_db_model(db_model),
    }


@router.get(
    "/review_tool/myreviews/",
    response_description="Get user review by review_id.",
    response_model=ResponseApplicationReviewList | ErrorResponse,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_application_reviews_for_reviewer(request: Request) -> dict:
    db_applications = retrieve_db_application_all_reviews_for_reviewer(
        request.app.state.sql_engine, request.state.profile.id
    )
    out_applications: list[MyApplicationReviewOut] = [
        MyApplicationReviewOut.from_db_model(p)
        for p in db_applications
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Reviews list successfully received",
        "data": out_applications,
    }


@router.get(
    "/review_tool/reviews/",
    response_description="List all membership applications reviews, pagging support",
    response_model=ResponseApplicationReviewList |  ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_application_reviews(
    request: Request,
    page: int = 1,
    page_size: int = 100) -> dict:
    db_applications = retrieve_db_application_all_reviews(
        request.app.state.sql_engine, page, page_size
    )
    out_applications: list[ApplicationReviewOut] = [
        ApplicationReviewOut.from_db_model(p)
        for p in db_applications
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Reviews list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_applications,
    }


@router.patch(
    "/review_tool/update_review/{review_id}/",
    response_description="Update a review of a membership application.",
    response_model=ResponseSubmitReview,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def update_review(
    request: Request,
    review_id: int,
    data: Annotated[ApplicationReviewUpdate, Body(embed=True)],
) -> dict:
    updated_review_model = update_db_application_review(
        request.app.state.sql_engine, request.state.profile.id, review_id, data
    )
    if updated_review_model is None:
        return {
            "status_code": 403,
            "response_type": "error",
            "description": "You are not reviewer of \
            this review or review does not exist.",
        }
    updated_review = ApplicationReviewOut.from_db_model(updated_review_model)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Review updated successfully",
        "data": updated_review,
    }


@router.delete(
    "/review_tool/delete_review/",
    response_description="Delete a review of a membership application.",
    response_model=ResponseDeleteReview,
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def delete_review(request: Request, reviewee_id: int) -> dict:
    review_deleted = delete_db_application_review(
        request.app.state.sql_engine,
        request.state.profile.id,
        reviewee_id)

    if review_deleted:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Review deleted successfully",
        }

    return {
        "status_code": 403,
        "response_type": "error",
        "description": """
            You are not authorized to delete this review or review does not exist.
        """,
    }
