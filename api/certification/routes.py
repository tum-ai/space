from typing import (
    List,
)

from fastapi import (
    APIRouter,
    Request,
)
from template.models import (
    BaseResponse,
)

from certification.models import (
    CertificationTemplateOut,
)
from database.certificates_connector import (
    list_db_certification_templates,
)
from utils.error_handlers import (
    async_error_handlers,
)

router = APIRouter()


# template operations ####################################################################

# create update delete done via db directly


class ResponseCertificationTemplateList(BaseResponse):
    data: List[CertificationTemplateOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                CertificationTemplateOut.dummy(),
                CertificationTemplateOut.dummy(),
            ]
        )


@router.get(
    "/templates",
    response_description="List all certification templates, no paging support",
    response_model=ResponseCertificationTemplateList,
)
@async_error_handlers
async def list_templates(request: Request) -> ResponseCertificationTemplateList:
    db_templates = list_db_certification_templates(request.app.state.sql_engine)
    out_departments: List[CertificationTemplateOut] = [
        CertificationTemplateOut.from_db_model(temp) for temp in db_templates
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "CertificationTemplate list successfully received",
        "data": out_departments,
    }


# TODO discuss approval logic
# TODO list requests of the department I supervised
# TODO list all requests of
