from typing import Any, cast

from pydantic import BaseModel, ConfigDict

from space_api.database.db_models import ApplicationReview
from space_api.profiles.api_models import ProfileOutPublic


class ApplicationReviewOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "motivation": 4,
                "skill": 7,
                "fit": 6,
                "in_tumai": 2,
                "comment_fit_tumai": "The fit seems good",
                "timecommit": "10 hours per week",
                "dept1_score": 8,
                "dept2_score": 5,
                "dept3_score": 7,
                "maybegoodfit": "Yes, potentially",
                "furthercomments": "Should keep an eye on progress",
                "referral": 1,
                "reviewer": ProfileOutPublic.dummy(),
                "finalscore": 7.5,
                "reviewee": 1,
            }
        }
    )

    id: int
    motivation: int
    skill: int
    fit: int
    in_tumai: int
    comment_fit_tumai: str | None
    timecommit: str | None
    dept1_score: int
    dept2_score: int
    dept3_score: int
    maybegoodfit: str | None
    furthercomments: str | None
    referral: int
    finalscore: float
    reviewer: ProfileOutPublic
    reviewee: int

    @classmethod
    def from_db_model(cls, review: ApplicationReview) -> "ApplicationReviewOut":
        return ApplicationReviewOut(
            id=review.id,
            motivation=review.motivation,
            skill=review.skill,
            fit=review.fit,
            in_tumai=review.in_tumai,
            comment_fit_tumai=review.comment_fit_tumai,
            timecommit=review.timecommit,
            dept1_score=review.dept1_score,
            dept2_score=review.dept2_score,
            dept3_score=review.dept3_score,
            maybegoodfit=review.maybegoodfit,
            furthercomments=review.furthercomments,
            referral=review.referral,
            finalscore=review.finalscore,
            reviewer=ProfileOutPublic.from_db_model(review.reviewer),
            reviewee=review.reviewee_id,
        )

    @classmethod
    def dummy(cls) -> "ApplicationReviewOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]


class ApplicationReviewIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "motivation": 4,
                "skill": 7,
                "fit": 6,
                "in_tumai": 2,
                "comment_fit_tumai": "The fit seems good",
                "timecommit": "10 hours per week",
                "dept1_score": 8,
                "dept2_score": 5,
                "dept3_score": 7,
                "maybegoodfit": "Yes, potentially",
                "furthercomments": "Should keep an eye on progress",
                "referral": 1,
                "finalscore": 7.5,
                "reviewee_id": 1,
            }
        }
    )

    motivation: int
    skill: int
    fit: int
    in_tumai: int
    comment_fit_tumai: str | None
    timecommit: str | None
    dept1_score: int
    dept2_score: int
    dept3_score: int
    maybegoodfit: str | None
    furthercomments: str | None
    reviewee_id: int

    @classmethod
    def dummy(cls) -> "ApplicationReviewIn":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]
