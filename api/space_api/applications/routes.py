from typing import Annotated, Any

from fastapi import APIRouter, Body, HTTPException, Request

from space_api.database.application_connector import (
    create_db_application,
    create_db_referral,
    delete_db_application,
    delete_db_referral,
    get_db_form_types,
    list_db_application,
    list_db_applications,
    list_db_referrals,
)
from space_api.security.decorators import ensure_authenticated, ensure_authorization
from space_api.utils.error_handlers import error_handlers
from space_api.utils.paging import enable_paging
from space_api.utils.response import ErrorResponse

from .api_models import ApplicationOut, ApplicationReferralInOut
from .response_models import (
    ResponseDeleteApplication,
    ResponseDeleteReferral,
    ResponseRetrieveApplication,
    ResponseRetrieveApplications,
    ResponseRetrieveReferrals,
    ResponseSubmitApplication,
    ResponseSubmitReferral,
)

router = APIRouter()


@router.get("/applications/info",
            summary="Get information about available forms")
@error_handlers
@ensure_authorization(any_of_roles=["submit_reviews"], )
def get_form_types(request: Request) -> dict:
    db_form_types = get_db_form_types(request.app.state.sql_engine)
    for form_type in db_form_types:
        print(form_type)
    out_form_types = {name for name, in db_form_types}

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "data": out_form_types,
    }


def find_tally_index_by_label(label: str, submission: dict[str,
                                                           Any]) -> int | None:
    for i, field in enumerate(submission["data"]["fields"]):
        if field["label"] and field["label"].lower() == label.lower():
            return i
    return None


@router.get(
    "/applications/",
    summary="List all applications",
    description="List all applications from all forms",
    response_description="A list of all applications including reviews",
    response_model=ResponseRetrieveApplications | ErrorResponse,
)
@error_handlers
@ensure_authorization(any_of_roles=["submit_reviews"], )
def list_applications(
    request: Request,
    page: int | None = None,
    page_size: int | None = None,
    form_type: str | None = None,
    search: str | None = None,
    with_pictures: bool = False,
) -> dict:
    applications = list_db_applications(request.app.state.sql_engine, page,
                                        page_size, form_type)

    if (not with_pictures):
        for application in applications:
            for review in application.reviews:
                review.reviewer.profile_picture = None

    if (search):
        # TODO: if no applications return 204 - no content
        first_application = applications[0]
        relevant_idxs = [
            find_tally_index_by_label(keyword, first_application.submission)
            for keyword in ["first name", "last name"]
        ]

        def search_predicate(submission) -> bool:
            for idx in relevant_idxs:
                if search.lower() \
                        in submission["data"]["fields"][idx]["value"].lower():
                    return True
            return False

        applications = [
            application for application in applications
            if search_predicate(application.submission)
        ]

    out_applications: list[ApplicationOut] = [
        ApplicationOut.from_db_model(p) for p in applications
    ]

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_applications,
    }


@router.get(
    "/application/{application_id}",
    response_description="List all applications",
    response_model=ResponseRetrieveApplication | ErrorResponse,
)
@ensure_authorization(any_of_roles=["submit_reviews"], )
@error_handlers
def list_application(request: Request, application_id: int) -> dict:
    db_application = list_db_application(request.app.state.sql_engine,
                                         application_id)
    out_application: ApplicationOut = ApplicationOut.from_db_model(
        db_application)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "data": out_application,
    }


@router.post(
    "/application/submit/",
    response_description="Submit application.",
    response_model=ResponseSubmitApplication,
)
@error_handlers
def submit_application(request: Request, payload: dict) -> dict:
    create_db_application(request.app.state.sql_engine, payload)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Application submitted successfully",
    }


# Referrals


@router.get(
    "/application/referrals/",
    response_description="List all referrals",
    response_model=ResponseRetrieveReferrals | ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authenticated
def list_referrals(request: Request,
                   page: int = 1,
                   page_size: int = 100) -> dict:
    db_referrals = list_db_referrals(request.app.state.sql_engine,
                                     request.state.profile.id, page, page_size)
    out_referrals: list[ApplicationReferralInOut] = [
        ApplicationReferralInOut.from_db_model(p) for p in db_referrals
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Referrals list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_referrals,
    }


@router.post(
    "/application/referral/",
    response_description="Submit referral.",
    response_model=ResponseSubmitReferral,
)
@error_handlers
@ensure_authenticated
def submit_referral(
        request: Request, data: Annotated[ApplicationReferralInOut,
                                          Body(embed=True)]) -> dict:
    create_db_referral(request.app.state.sql_engine, request.state.profile.id,
                       data)
    # TODO: update all scores of the applications of the referral email
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Referral submitted successfully.",
    }


@router.delete(
    "/application/referral/",
    response_description="Delete referral.",
    response_model=ResponseDeleteReferral,
)
@error_handlers
@ensure_authenticated
def delete_referral(request: Request, email: str) -> dict:
    delete_db_referral(request.app.state.sql_engine, request.state.profile.id,
                       email)
    # TODO: update all scores of the applications of the referral email
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Referral deleted successfully.",
    }


@router.delete(
    "/applications/delete_application/",
    response_description="Delete a review of a membership application.",
    response_model=ResponseDeleteApplication,
)
@error_handlers
@ensure_authorization(any_of_roles=["admin"], )
def delete_application(request: Request, id: int) -> dict:
    review_deleted = delete_db_application(request.app.state.sql_engine, id)

    if review_deleted:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "Review deleted successfully",
        }

    raise HTTPException(status_code=400,
                        detail="""
            Could not delete application with ID {id}.
        """)
