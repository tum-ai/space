from pydantic import ConfigDict

from space_api.utils.response import BaseResponse


class ResponseSubmitReview(BaseResponse):
    model_config = ConfigDict(json_schema_extra=[])
