from pydantic import BaseModel

from typing import (
    List,
    Optional,
)


class MembershipApplicationReviewData(BaseModel):
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
    reviewer: int
    reviewee: int

    @classmethod
    def dummy(cls) -> "MembershipApplicationReviewData":
        return MembershipApplicationReviewData.parse_obj(cls.Config.schema_extra["example"])

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
                "reviewer": 123456,
                "reviewee": 889900
            }
        }
