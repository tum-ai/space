from typing import Any, cast

from pydantic import BaseModel, ConfigDict

from space_api.database.db_models import Application, ApplicationReview
from space_api.profiles.api_models import ProfileOutPublic


class ApplicationReviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "form": {
                    "motivation": 1,
                    "fit": 5,
                    "comment": "good candidate"
                },
                "review_type": "MEMBERSHIP",
                "referral": 1,
                "reviewer": ProfileOutPublic.dummy(),
                "finalscore": 7.5,
                "reviewee_id": 1,
            }
        })

    form: Any
    review_type: str
    referral: int
    finalscore: float
    reviewer: ProfileOutPublic
    reviewee_id: int

    @classmethod
    def from_db_model(cls,
                      review: ApplicationReview) -> "ApplicationReviewOut":
        return ApplicationReviewOut(
            form=review.form,
            review_type=review.review_type,
            referral=review.referral,
            finalscore=review.finalscore,
            reviewer=ProfileOutPublic.from_db_model(review.reviewer),
            reviewee_id=review.reviewee_id,
        )

    @classmethod
    def dummy(cls) -> "ApplicationReviewOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class ApplicationReviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "form": {
                    "motivation": 1,
                    "fit": 5,
                    "comment": "good candidate"
                },
                "review_type": "MEMBERSHIP",
                "reviewee_id": 1,
            }
        })

    form: Any
    review_type: str
    reviewee_id: int

    @classmethod
    def dummy(cls) -> "ApplicationReviewIn":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class ApplicationReviewUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "form": {
                    "motivation": 1,
                    "fit": 5,
                    "comment": "good candidate"
                },
            }
        })

    form: Any

    @classmethod
    def dummy(cls) -> "ApplicationReviewUpdate":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class ApplicationOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "submission": {
                    "type":
                    "Industry",
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
        })

    id: int
    reviews: list[ApplicationReviewOut]
    submission: Any

    @classmethod
    def from_db_model(cls, application: Application) -> "ApplicationOut":
        reviews = []
        for review in application.reviews:
            reviews.append(ApplicationReviewOut.from_db_model(review))
        return ApplicationOut(id=application.id,
                              submission=application.submission,
                              reviews=reviews)

    @classmethod
    def dummy(cls) -> "ApplicationOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class MyApplicationReviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "form": {
                    "motivation": 1,
                    "fit": 5,
                    "comment": "good candidate"
                },
                "review_type": "MEMBERSHIP",
                "referral": 1,
                "application": ApplicationOut.dummy(),
                "finalscore": 7.5,
            }
        })

    form: Any
    review_type: str
    referral: int
    finalscore: float
    application: ApplicationOut

    @classmethod
    def from_db_model(cls,
                      review: ApplicationReview) -> "MyApplicationReviewOut":
        return MyApplicationReviewOut(
            form=review.form,
            review_type=review.review_type,
            referral=review.referral,
            finalscore=review.finalscore,
            application=ApplicationOut.from_db_model(review.application),
        )

    @classmethod
    def dummy(cls) -> "MyApplicationReviewOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]
