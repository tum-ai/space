from pydantic import ConfigDict

from space_api.utils.response import BaseResponse

from .api_models import ApplicationOut, ApplicationReferralInOut


class ResponseRetrieveReferrals(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))

    data: list[ApplicationReferralInOut]

class ResponseDeleteReferral(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))


class ResponseSubmitReferral(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))


class ResponseSubmitApplication(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))


class ResponseRetrieveApplication(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))

    data: ApplicationOut


class ResponseRetrieveApplications(BaseResponse):
    model_config = ConfigDict(json_schema_extra=BaseResponse.schema_wrapper([]))

    data: list[ApplicationOut]
