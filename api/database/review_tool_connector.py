from typing import List
import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from review_tool.api_models import (
    MembershipApplicationReviewIn,
)

from .db_models import (
    MembershipApplicationReview,
)


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
            reviewee=new_membership_application_review.reviewee,
        )
        db_session.add(db_membership_application_review)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db_membership_application_review.force_load()

    return db_membership_application_review


def retrieve_db_membership_application_review(
    sql_engine: sa.Engine, profile_id: int , review_id: int
) -> MembershipApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(MembershipApplicationReview)
            .filter(sa.and_(MembershipApplicationReview.id == review_id, MembershipApplicationReview.reviewer == profile_id))
            .first()
        )

        return db_model


def retrieve_db_membership_application_all_reviews_for_reviewer(
    sql_engine: sa.Engine, profile_id: int 
) -> MembershipApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = db_session.query(MembershipApplicationReview).filter(MembershipApplicationReview.reviewer == profile_id).all()

        return db_model
    

def retrieve_db_membership_application_all_reviews(
    sql_engine: sa.Engine, page: int, page_size: int
) -> List[MembershipApplicationReview]:
    with Session(sql_engine) as db_session:    
        db_membership_applications_reviews: List[MembershipApplicationReview] = (
                db_session.query(MembershipApplicationReview)
                .offset(page_size * (page - 1))
                .limit(page_size)
                .all()
            )

        return db_membership_applications_reviews
    

def update_db_membership_application_review(
    sql_engine: sa.Engine,
    profile_id: int,
    review_id: int,
    updated_membership_application_review: MembershipApplicationReviewIn,
) -> MembershipApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(MembershipApplicationReview)
            .filter(sa.and_(MembershipApplicationReview.id == review_id, MembershipApplicationReview.reviewer == profile_id))
            .first()
        )

        if updated_membership_application_review.motivation:
            db_model.motivation = updated_membership_application_review.motivation
        if updated_membership_application_review.skill:
            db_model.skill = updated_membership_application_review.skill
        if updated_membership_application_review.fit:
            db_model.fit = updated_membership_application_review.fit
        if updated_membership_application_review.in_tumai:
            db_model.in_tumai = updated_membership_application_review.in_tumai
        if updated_membership_application_review.commentFitTUMai:
            db_model.commentFitTUMai = updated_membership_application_review.commentFitTUMai
        if updated_membership_application_review.timecommit:
            db_model.timecommit = updated_membership_application_review.timecommit
        if updated_membership_application_review.dept1Score:
            db_model.dept1Score = updated_membership_application_review.dept1Score
        if updated_membership_application_review.dept2Score:
            db_model.dept2Score = updated_membership_application_review.dept2Score
        if updated_membership_application_review.dept3Score:
            db_model.dept3Score = updated_membership_application_review.dept3Score
        if updated_membership_application_review.maybegoodfit:
            db_model.maybegoodfit = updated_membership_application_review.maybegoodfit
        if updated_membership_application_review.furthercomments:
            db_model.furthercomments = updated_membership_application_review.furthercomments
        if updated_membership_application_review.referral:
            db_model.referral = updated_membership_application_review.referral
        if updated_membership_application_review.finalscore:
            db_model.finalscore = updated_membership_application_review.finalscore
        if updated_membership_application_review.reviewee:
            db_model.reviewee = updated_membership_application_review.reviewee

        db_session.add(db_model)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db_model.force_load()

        return db_model
        