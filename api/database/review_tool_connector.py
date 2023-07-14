import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from review_tool.api_models import (
    ApplicationReviewIn,
)

from .db_models import (
    ApplicationReview,
)


def create_db_application_review(
    sql_engine: sa.Engine,
    reviewer: int,
    new__application_review: ApplicationReviewIn,
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        # TODO: calculate finalscore and referral these correctly
        db__application_review = ApplicationReview(
            motivation=new__application_review.motivation,
            skill=new__application_review.skill,
            fit=new__application_review.fit,
            in_tumai=new__application_review.in_tumai,
            commentFitTUMai=new__application_review.commentFitTUMai,
            timecommit=new__application_review.timecommit,
            dept1Score=new__application_review.dept1Score,
            dept2Score=new__application_review.dept2Score,
            dept3Score=new__application_review.dept3Score,
            maybegoodfit=new__application_review.maybegoodfit,
            furthercomments=new__application_review.furthercomments,
            referral=1,
            finalscore=1,
            reviewer=reviewer,
            reviewee=new__application_review.reviewee,
        )
        db_session.add(db__application_review)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db__application_review.force_load()

    return db__application_review
