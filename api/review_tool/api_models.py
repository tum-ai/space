from pydantic import BaseModel
from profiles.api_models import ProfileOutPublic

from typing import (
    Optional,
)

from database.db_models import (
    MembershipApplicationReview
)

class MembershipApplicationReviewOut(BaseModel):
    id: int
    motivation: int
    skill: int
    fit: int
    in_tumai: int
    commentFitTUMai: Optional[str]
    timecommit: Optional[str]
    dept1Score: int
    dept2Score: int
    dept3Score: int
    maybegoodfit: Optional[str]
    furthercomments: Optional[str]
    referral: int
    finalscore: float
    reviewer: ProfileOutPublic
    reviewee: int
    
    @classmethod
    def from_db_model(
        cls, 
        review: MembershipApplicationReview
    ) -> "MembershipApplicationReview":
        return MembershipApplicationReviewOut(
            id=review.id,
            motivation=review.motivation,
            skill=review.skill,
            fit=review.fit,
            in_tumai=review.in_tumai,
            commentFitTUMai=review.commentFitTUMai,
            timecommit=review.timecommit,
            dept1Score=review.dept1Score,
            dept2Score=review.dept2Score,
            dept3Score=review.dept3Score,
            maybegoodfit=review.maybegoodfit,
            furthercomments=review.furthercomments,
            referral=review.referral,
            finalscore=review.finalscore,
            reviewer=ProfileOutPublic.from_db_model(review.reviewer),
            reviewee=review.reviewee,
        )

    @classmethod
    def dummy(cls) -> "MembershipApplicationReviewOut":
        return MembershipApplicationReviewOut.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "motivation": 4,
                "skill": 7,
                "fit": 6,
                "in_tumai": 2,
                "commentFitTUMai": "The fit seems good",
                "timecommit": "10 hours per week",
                "dept1Score": 8,
                "dept2Score": 5,
                "dept3Score": 7,
                "maybegoodfit": "Yes, potentially",
                "furthercomments": "Should keep an eye on progress",
                "referral": 1,
                "reviewer": ProfileOutPublic.dummy(),
                "finalscore": 7.5,
                "reviewee": 1
            }
        }


class MembershipApplicationReviewIn(BaseModel):
    motivation: int
    skill: int
    fit: int
    in_tumai: int
    commentFitTUMai: Optional[str]
    timecommit: Optional[str]
    dept1Score: int
    dept2Score: int
    dept3Score: int
    maybegoodfit: Optional[str]
    furthercomments: Optional[str]
    referral: int
    finalscore: float
    reviewee: int

    @classmethod
    def dummy(cls) -> "MembershipApplicationReviewIn":
        return MembershipApplicationReviewIn.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "motivation": 4,
                "skill": 7,
                "fit": 6,
                "in_tumai": 2,
                "commentFitTUMai": "The fit seems good",
                "timecommit": "10 hours per week",
                "dept1Score": 8,
                "dept2Score": 5,
                "dept3Score": 7,
                "maybegoodfit": "Yes, potentially",
                "furthercomments": "Should keep an eye on progress",
                "referral": 1,
                "finalscore": 7.5,
                "reviewee": 1
            }
        }
