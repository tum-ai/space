from fastapi import APIRouter, Request

from space_api.database.application_connector import (
    create_db_application,
    create_db_referral,
    delete_db_referral,
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
    ResponseDeleteReferral,
    ResponseRetrieveApplication,
    ResponseRetrieveApplications,
    ResponseRetrieveReferrals,
    ResponseSubmitApplication,
    ResponseSubmitReferral,
)

router = APIRouter()


@router.get(
    "/applications/",
    response_description="List all applications",
    response_model=ResponseRetrieveApplications | ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def list_applications(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_applications = list_db_applications(
        request.app.state.sql_engine, page, page_size
    )
    out_applications: list[ApplicationOut] = [
        ApplicationOut.from_db_model(p) for p in db_applications
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
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
@error_handlers
def list_application(request: Request, application_id: int) -> dict:
    db_application = list_db_application(request.app.state.sql_engine, application_id)
    out_application: ApplicationOut = ApplicationOut.from_db_model(db_application)
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
def submit_application(
    request: Request,
    payload: dict
) -> dict:
    create_db_application(request.app.state.sql_engine, payload)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Application submitted successfully",
    }

@router.get(
    "/applications/referrals/",
    response_description="List all referrals",
    response_model=ResponseRetrieveReferrals | ErrorResponse,
)
@enable_paging(max_page_size=100)
@error_handlers
@ensure_authenticated
def list_referrals(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_referrals = list_db_referrals(
        request.app.state.sql_engine, request.state.profile.id, page, page_size
    )
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
    request: Request,
    referral: ApplicationReferralInOut
) -> dict:
    create_db_referral(request.app.state.sql_engine, request.state.profile.id, referral)

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
def delete_referral(
    request: Request,
    email: str
) -> dict:
    delete_db_referral(request.app.state.sql_engine, request.state.profile.id, email)

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Referral deleted successfully.",
    }
