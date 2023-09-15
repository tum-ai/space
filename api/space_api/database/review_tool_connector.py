import sqlalchemy as sa
from sqlalchemy.orm import (
    Session, )

from space_api.review_tool.api_models import (
    ApplicationReviewIn,
    ApplicationReviewUpdate,
)

from .db_models import (
    ApplicationReview, )


def get_scores(application: ApplicationReviewIn) -> tuple[int, int]:
    referral = 0
    final_score = 0

    # referral
    try:
        pass
    except Exception:
        referral = 0

    # final score
    try:
        if application.review_type == "MEMBERSHIP":
            final_score = (0.15 * application.form["motivation"]) + \
                (0.15 * application.form["skill"]) + \
                (0.15 * application.form["fit"]) + \
                (0.55 * application.form["fit"]) + \
                (0.15 * referral)
        if application.review_type == "VENTURE":
            like_to_see = 0
            if application.form["like_to_see"] == "YES":
                like_to_see = 10
            elif application.form["like_to_see"] == "MAYBE":
                like_to_see = 5
            final_score = (0.25 * (application.form["relevance_ai"] +
                                   application.form["skills"])) + \
                (0.5 * (application.form["motivation"]
                        + application.form["vision"])) + \
                (0.25 * (application.form["personality"] + like_to_see))
    except Exception as e:
        print(e)
        final_score = 0

    return final_score, referral


def create_db_application_review(
    sql_engine: sa.Engine,
    reviewer_id: int,
    new__application_review: ApplicationReviewIn,
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        final_score, referral = get_scores(new__application_review)
        db__application_review = ApplicationReview(
            form=new__application_review.form,
            review_type=new__application_review.review_type,
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


def retrieve_db_application_review(sql_engine: sa.Engine,
                                   application_id: int) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        db_model = (db_session.query(ApplicationReview).filter(
            ApplicationReview.reviewee_id == application_id).first())

        assert db_model

        if db_model is not None:
            db_model.force_load()

        return db_model


def retrieve_db_application_all_reviews_for_reviewer(
        sql_engine: sa.Engine, profile_id: int) -> list[ApplicationReview]:
    with Session(sql_engine) as db_session:
        db_applications_reviews = (db_session.query(ApplicationReview).filter(
            ApplicationReview.reviewer_id == profile_id).all())

        for db_applications_review in db_applications_reviews:
            db_applications_review.force_load()
            db_applications_review.application.force_load()

        return db_applications_reviews


def retrieve_db_application_all_reviews(
        sql_engine: sa.Engine, page: int,
        page_size: int) -> list[ApplicationReview]:
    with Session(sql_engine) as db_session:
        db_applications_reviews: list[ApplicationReview] = (
            db_session.query(ApplicationReview).offset(
                page_size * (page - 1)).limit(page_size).all())

        for db_applications_review in db_applications_reviews:
            db_applications_review.force_load()
            db_applications_review.application.force_load()

        return db_applications_reviews


def update_db_application_review(
    sql_engine: sa.Engine,
    reviewer_id: int,
    applicant_id: int,
    updated_application_review: ApplicationReviewUpdate,
) -> ApplicationReview:
    with Session(sql_engine) as db_session:
        application_review = (db_session.query(ApplicationReview).filter(
            sa.and_(ApplicationReview.reviewee_id == applicant_id,
                    ApplicationReview.reviewer_id == reviewer_id)).first())

        assert application_review

        if updated_application_review.form:
            application_review.form = updated_application_review.form

        db_session.add(application_review)
        db_session.flush()
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        application_review.force_load()

        return application_review


def delete_db_application_review(sql_engine: sa.Engine, profile_id: int,
                                 reviewee_id: int) -> bool:
    with Session(sql_engine) as db_session:

        db_review = (db_session.query(ApplicationReview).filter(
            sa.and_(ApplicationReview.reviewee_id == reviewee_id,
                    ApplicationReview.reviewer_id == profile_id)).first())

        if db_review:
            db_session.delete(db_review)
            db_session.commit()
            return True

        return False
