from typing import (
    List,
)

from applications.api_models import (
    ApplicationOut
)
from utils.response import (
    BaseResponse,
)


class ResponseSubmitApplication(BaseResponse):
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])


class ResponseRetrieveApplication(BaseResponse):
    data: ApplicationOut
    
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])


class ResponseRetrieveApplications(BaseResponse):
    data: List[ApplicationOut]
    
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
