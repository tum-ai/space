from typing import List

from fastapi import APIRouter
from fastapi import Request

from certification.models import CertificationTemplateOut
from database.certificates_connector import list_db_certification_templates
from template.models import BaseResponse
from utils.error_handlers import async_error_handlers

router = APIRouter()


# template operations ##################################################################################################

# create update delete done via db directly

class ResponseCertificationTemplateList(BaseResponse):
    data: List[CertificationTemplateOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper([
            CertificationTemplateOut.dummy(),
            CertificationTemplateOut.dummy(),
        ])


@router.get(
    "/templates",
    response_description="List all certification templates, no paging support",
    response_model=ResponseCertificationTemplateList
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
        "data": out_departments
    }

# TODO discuss approval logic
# TODO list requests of the department I supervised
# TODO list all requests of

# class ResponseDepartment(BaseResponse):
#     data: DepartmentOut
#
#     class Config:
#         schema_extra = BaseResponse.schema_wrapper(DepartmentOut.dummy())
#
#
# @router.get(
#     "/department/{handle}",
#     response_description="Get a department by its handle",
#     response_model=ResponseDepartment
# )
# @async_error_handlers
# async def get_department(request: Request, handle: str) -> ResponseDepartment:
#     db_model = retrieve_db_department(request.app.state.sql_engine, handle)
#     return {
#         "status_code": 200,
#         "response_type": "success",
#         "description": "Retrieved Department successfully",
#         "data": DepartmentOut.from_db_model(db_model)
#     }
#
#
# # profile operations ###################################################################################################
#
# class ResponseProfileList(BaseResponse):
#     data: List[ProfileOut]
#
#     class Config:
#         schema_extra = BaseResponse.schema_wrapper([
#             ProfileOut.dummy(),
#             ProfileOut.dummy(),
#         ])
#
#
# # TODO rate limits?
# @router.post(
#     "/profiles/",
#     response_description="Batch add profiles",
#     response_model=ResponseProfileList
# )
# @async_error_handlers
# async def add_profiles(
#         request: Request,
#         data: Annotated[ProfileInCreate, Body(embed=True)],
#         # session: SessionContainer = Depends(verify_session())
# ):
#     # TODO test and enable the commented out code
#     # roles = await session.get_claim_value(UserRoleClaim)
#     # if roles is None or "ADMIN" not in roles:
#     #     raise_invalid_claims_exception("User is not an admin", [
#     #         ClaimValidationError(UserRoleClaim.key, None)])
#     # else:
#
#     new_db_profiles = create_db_profiles(request.app.state.sql_engine, [data])
#     new_profiles = [ProfileOut.from_db_model(p) for p in new_db_profiles]
#     return {
#         "status_code": 200,
#         "response_type": "success",
#         "description": f"Created profiles",
#         "data": new_profiles,
#     }
