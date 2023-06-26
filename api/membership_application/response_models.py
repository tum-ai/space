from typing import List

from utils.response import BaseResponse

from membership_application.api_models import (
    MembershipApplicationOut,
    MembershipApplicationListOut,
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


# class ResponseSubmitMembershipApplication(BaseResponse):

#     class Config:
#         schema_extra = BaseResponse.schema_wrapper([])


class ResponseSubmitMembershipApplicationReferral(BaseResponse):

    class Config:
        schema_extra = BaseResponse.schema_wrapper([])
