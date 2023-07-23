from pydantic import ConfigDict

from space_api.utils.response import BaseResponse

from .api_models import ApplicationOut


class ResponseSubmitApplication(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))


class ResponseRetrieveApplication(BaseResponse):
    data: ApplicationOut

    class Config:
        model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))


class ResponseRetrieveApplications(BaseResponse):
    data: list[ApplicationOut]

    class Config:
        model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))
