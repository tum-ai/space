from typing import (
    Annotated,
    List,
    Union,
)

from fastapi import (
    APIRouter,
    Body,
    Request,
)

from database.membership_application_connector import (
    create_db_membership_application_referral,
    list_db_membership_application,
    retrieve_db_membership_application,
)
from membership_application.api_models import (
    MembershipApplicationListOut,
    MembershipApplicationOut,
    MembershipApplicationReferralIn,
)
from membership_application.response_models import (
    ResponseMembershipApplication,
    ResponseMembershipApplicationList,
    ResponseSubmitMembershipApplicationReferral,
)
from security.decorators import (
    ensure_authenticated,
    ensure_authorization,
)
from utils.error_handlers import (
    error_handlers,
)
from utils.paging import (
    enable_paging,
)
from utils.response import (
    ErrorResponse,
)

router = APIRouter()


@router.get(
    "/membership_applications/",
    response_description="List all membership applications, pagging support",
    response_model=Union[ResponseMembershipApplicationList, ErrorResponse],
)
@enable_paging(max_page_size=100)
@error_handlers
def list_public_profiles(request: Request, page: int = 1, page_size: int = 100) -> dict:
    db_membership_applications = list_db_membership_application(
        request.app.state.sql_engine, page, page_size
    )
    out_membership_applications: List[MembershipApplicationListOut] = [
        MembershipApplicationListOut.from_db_model(p)
        for p in db_membership_applications
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "PublicProfile list successfully received",
        "page": page,
        "page_size": page_size,
        "data": out_membership_applications,
    }


@router.get(
    "/membership_application/{application_id}/",
    response_description="Get user application by id.",
    response_model=Union[ResponseMembershipApplication, ErrorResponse],
)
@error_handlers
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
def get_membership_application(request: Request, application_id: int) -> dict:
    db_model = retrieve_db_membership_application(
        request.app.state.sql_engine, application_id
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Retrieved application successfully",
        "data": MembershipApplicationOut.from_db_model(db_model),
    }


@router.post(
    "/membership_application/submit/referral",
    response_description="Refer a new member.",
    response_model=ResponseSubmitMembershipApplicationReferral,
)
@error_handlers
@ensure_authenticated
def submit_membership_application_referral(
    request: Request,
    data: Annotated[MembershipApplicationReferralIn, Body(embed=True)],
) -> dict:
    create_db_membership_application_referral(
        request.app.state.sql_engine, request.state.profile.id, data
    )

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Referral submitted successfully",
    }
