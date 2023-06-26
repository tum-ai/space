import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)
from .db_models import MembershipApplicationReview

from review_tool.api_models import MembershipApplicationReviewIn


def create_db_membership_application_review(
    sql_engine: sa.Engine,
    reviewer: int,
    new_membership_application_review: MembershipApplicationReviewIn,
) -> MembershipApplicationReview:
    with Session(sql_engine) as db_session:
        db_membership_application_review = MembershipApplicationReview(
            motivation=new_membership_application_review.motivation,
            skill=new_membership_application_review.skill,
            fit=new_membership_application_review.fit,
            in_tumai=new_membership_application_review.in_tumai,
            commentFitTUMai=new_membership_application_review.commentFitTUMai,
            timecommit=new_membership_application_review.timecommit,
            dept1Score=new_membership_application_review.dept1Score,
            dept2Score=new_membership_application_review.dept2Score,
            dept3Score=new_membership_application_review.dept3Score,
            maybegoodfit=new_membership_application_review.maybegoodfit,
            furthercomments=new_membership_application_review.furthercomments,
            referral=new_membership_application_review.referral,
            finalscore=new_membership_application_review.finalscore,
            reviewer=reviewer,
            reviewee=new_membership_application_review.reviewee
        )
        db_session.add(db_membership_application_review)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db_membership_application_review.force_load()

    return db_membership_application_review
