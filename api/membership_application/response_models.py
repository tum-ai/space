from typing import (
    List,
)

from membership_application.api_models import (
    MembershipApplicationListOut,
    MembershipApplicationOut,
)
from utils.response import (
    BaseResponse,
)


class ResponseMembershipApplication(BaseResponse):
    data: MembershipApplicationOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(MembershipApplicationOut.dummy())


class ResponseMembershipApplicationList(BaseResponse):
    data: List[MembershipApplicationListOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [
                MembershipApplicationListOut.dummy(),
                MembershipApplicationListOut.dummy(),
            ]
        )


class ResponseSubmitMembershipApplicationReferral(BaseResponse):
    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
