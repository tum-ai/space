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

from database.application_connector import (
    list_db_applications,
    list_db_application,
    create_db_application,
)
from applications.api_models import (
    ApplicationOut,
)
from applications.response_models import (
    ResponseSubmitApplication,
    ResponseRetrieveApplication,
    ResponseRetrieveApplications,
)
from security.decorators import (
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
    "/applications/",
    response_description="List all applications",
    response_model=Union[ResponseRetrieveApplications, ErrorResponse],
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
    out_applications: List[ApplicationOut] = [
        ApplicationOut.from_db_model(p)
        for p in db_applications
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
    response_model=Union[ResponseRetrieveApplication, ErrorResponse],
)
@ensure_authorization(
    any_of_roles=["submit_reviews"],
)
@error_handlers
def list_application(request: Request, application_id: int) -> dict:
    db_application = list_db_application(
        request.app.state.sql_engine, application_id
    )
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
    submission: Annotated[dict, Body(embed=True)],
) -> dict:
    create_db_application(
        request.app.state.sql_engine, submission
    )

    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Application submitted successfully",
    }
