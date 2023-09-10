from typing import Any, cast

from pydantic import BaseModel, ConfigDict

from space_api.database.db_models import Application, ApplicationReferral
from space_api.review_tool.api_models import ApplicationReviewOut


class ApplicationOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "submission": {
                    "type": "Industry",
                    "fields": [
                        {
                            "key": "question_mVGEg3_e25-9e68-5d730598c681",
                            "label": "utm_campaign",
                            "type": "HIDDEN_FIELDS",
                            "value": "newsletter",
                        },
                    ],
                },
            }
        }
    )

    id: int
    submission: Any
    reviews: list[ApplicationReviewOut]

    @classmethod
    def from_db_model(cls, application: Application) -> "ApplicationOut":
        reviews = [ApplicationReviewOut.from_db_model(
            review) for review in application.reviews]

        return ApplicationOut(
            id=application.id,
            submission=application.submission,
            reviews=reviews
        )

    @classmethod
    def dummy(cls) -> "ApplicationOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class ApplicationReferralInOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": 'john.doe@gmail.com',
                "first_name": 'John',
                "last_name": 'Doe',
                "comment": 'Good guy, love to work with him.'
            }
        }
    )

    email: str
    first_name: str
    last_name: str
    comment: str

    @classmethod
    def from_db_model(cls, referral: ApplicationReferral) -> "ApplicationReferralInOut":
        return ApplicationReferralInOut(
            email=referral.email,
            first_name=referral.first_name,
            last_name=referral.last_name,
            comment=referral.comment,
        )

    @classmethod
    def dummy(cls) -> "ApplicationReferralInOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]
