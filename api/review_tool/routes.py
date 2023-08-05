from typing import (
    Annotated,
    Union,
    List,
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from database.review_tool_connector import (
    create_db_membership_application_review,
    retrieve_db_membership_application_review,
    retrieve_db_membership_application_all_reviews,
    retrieve_db_membership_application_all_reviews_for_reviewer,
    update_db_membership_application_review
)
from review_tool.api_models import (
    MembershipApplicationReviewIn,
    MembershipApplicationReviewOut,
    MembershipApplicationReviewListOut,
)
from review_tool.response_models import (
    ResponseSubmitReview,
    ResponseMembershipApplicationReview,
    ResponseMembershipApplicationReviewList,
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
from utils.paging import (
    enable_paging,
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
    "/review_tool/review/{review_id}/",
    response_description="Get user review by review_id.",
    response_model=Union[ResponseMembershipApplicationReview, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_membership_application(request: Request, review_id: int) -> dict:
    db_model = retrieve_db_membership_application_review(
        request.app.state.sql_engine, request.state.profile.id, review_id
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved application successfully",
        "data": MembershipApplicationReviewOut.from_db_model(db_model),
    }


@router.get(
    "/review_tool/myreviews/",
    response_description="Get user review by review_id.",
    response_model=Union[ResponseMembershipApplicationReviewList, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_membership_application_reviews_for_reviewer(request: Request) -> dict:
    db_membership_applications = retrieve_db_membership_application_all_reviews_for_reviewer(
        request.app.state.sql_engine, request.state.profile.id
    )
    out_membership_applications: List[MembershipApplicationReviewListOut] = [
        MembershipApplicationReviewListOut.from_db_model(p)
        for p in db_membership_applications
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Reviews list successfully received",
        "data": out_membership_applications,
    }


@router.get(
    "/review_tool/reviews/",
    response_description="List all membership applications reviews, pagging support",
    response_model=Union[ResponseMembershipApplicationReviewList, ErrorResponse],
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_membership_application_reviews(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_membership_applications = retrieve_db_membership_application_all_reviews(
        request.app.state.sql_engine, page, page_size
    )
    out_membership_applications: List[MembershipApplicationReviewListOut] = [
        MembershipApplicationReviewListOut.from_db_model(p)
        for p in db_membership_applications
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Reviews list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_membership_applications,
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
    data: Annotated[MembershipApplicationReviewIn, Body(embed=True)],
) -> dict:
    updated_review_model = update_db_membership_application_review(
        request.app.state.sql_engine, request.state.profile.id, review_id, data
    )
    if updated_review_model is None:
        return {
            "status_code": 403,
            "response_type": "error",
            "description": "You are not reviewer of this review or review does not exist.",
        }
    updated_review = MembershipApplicationReviewOut.from_db_model(updated_review_model)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Review updated successfully",
        "data": updated_review,
    }
