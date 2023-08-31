import sqlalchemy as sa
from sqlalchemy.orm import (
    Session,
)

from space_api.review_tool.api_models import (
    ApplicationReviewIn,
    ApplicationReviewUpdate,
)

from .db_models import (
    ApplicationReview,
)


def create_db_application_review(
    sql_engine: sa.Engine,
    reviewer_id: int,
    new__application_review: ApplicationReviewIn,
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        # TODO: get referral
        referral = 0
        final_score = (0.15 * new__application_review.motivation) + \
        (0.15 * new__application_review.skill) + \
        (0.15 * new__application_review.fit) + \
        (0.55 * new__application_review.in_tumai) + \
        (0.55 * new__application_review.in_tumai) + \
        (0.15 * referral)
        db__application_review = ApplicationReview(
            motivation=new__application_review.motivation,
            skill=new__application_review.skill,
            fit=new__application_review.fit,
            in_tumai=new__application_review.in_tumai,
            comment_fit_tumai=new__application_review.comment_fit_tumai,
            timecommit=new__application_review.timecommit,
            dept1_score=new__application_review.dept1_score,
            dept2_score=new__application_review.dept2_score,
            dept3_score=new__application_review.dept3_score,
            maybegoodfit=new__application_review.maybegoodfit,
            furthercomments=new__application_review.furthercomments,
            referral=referral,
            finalscore=final_score,
            reviewer_id=reviewer_id,
            reviewee_id=new__application_review.reviewee_id,
        )
        db_session.add(db__application_review)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db__application_review.force_load()

    return db__application_review


def retrieve_db_application_review(
    sql_engine: sa.Engine, review_id: int
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(ApplicationReview)
            .first()
        )

        assert db_model

        if db_model is not None:
            db_model.force_load()

        return db_model


def retrieve_db_application_all_reviews_for_reviewer(
    sql_engine: sa.Engine, profile_id: int
) -> list[ApplicationReview]:
    with Session(sql_engine) as db_session:
        db_applications_reviews = (
            db_session
            .query(ApplicationReview)
            .filter(ApplicationReview.reviewer_id == profile_id).all()
        )

        for db_applications_review in db_applications_reviews:
            db_applications_review.force_load()
            db_applications_review.application.force_load()

        return db_applications_reviews


def retrieve_db_application_all_reviews(
    sql_engine: sa.Engine, page: int, page_size: int
) -> list[ApplicationReview]:
    with Session(sql_engine) as db_session:
        db_applications_reviews: list[ApplicationReview] = (
            db_session.query(ApplicationReview)
            .offset(page_size * (page - 1))
            .limit(page_size)
            .all()
        )

        for db_applications_review in db_applications_reviews:
            db_applications_review.force_load()

        return db_applications_reviews


def update_db_application_review(
    sql_engine: sa.Engine,
    profile_id: int,
    review_id: int,
    updated_application_review: ApplicationReviewUpdate,
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = (
            db_session.query(ApplicationReview)
            .filter(ApplicationReview.reviewer_id == profile_id)
            .first()
        )

        assert db_model

        if updated_application_review.motivation:
            db_model.motivation = updated_application_review.motivation
        if updated_application_review.skill:
            db_model.skill = updated_application_review.skill
        if updated_application_review.fit:
            db_model.fit = updated_application_review.fit
        if updated_application_review.in_tumai:
            db_model.in_tumai = updated_application_review.in_tumai
        if updated_application_review.comment_fit_tumai:
            db_model.comment_fit_tumai = (updated_application_review
                                        .comment_fit_tumai)
        if updated_application_review.timecommit:
            db_model.timecommit = updated_application_review.timecommit
        if updated_application_review.dept1_score:
            db_model.dept1_score = updated_application_review.dept1_score
        if updated_application_review.dept2_score:
            db_model.dept2_score = updated_application_review.dept2_score
        if updated_application_review.dept3_score:
            db_model.dept3_score = updated_application_review.dept3_score
        if updated_application_review.maybegoodfit:
            db_model.maybegoodfit = updated_application_review.maybegoodfit
        if updated_application_review.furthercomments:
            db_model.furthercomments = (updated_application_review.furthercomments)

        db_session.add(db_model)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        db_model.force_load()

        return db_model

def delete_db_application_review(
    sql_engine: sa.Engine,
    profile_id: int,
    reviewee_id: int) -> bool:
    with Session(sql_engine) as db_session:

        db_review = (
            db_session.query(ApplicationReview)
            .filter(sa.and_(ApplicationReview.reviewee_id == reviewee_id,
                             ApplicationReview.reviewer_id == profile_id))
            .first()
        )

        if db_review:
            db_session.delete(db_review)
            db_session.commit()
            return True

        return False
