from typing import (
    List,
)

from sqlalchemy import (
    Engine,
    and_,
    delete,
    or_,
)
from sqlalchemy.orm import (
    Session,
)

from feedback.api_models import (
    FeedbackItemIn,
)
from feedback.db_models import (
    FeedbackItem,
)


def create_feedback_item(
    sql_engine: Engine,
    profile_id: int,
    new_item: FeedbackItemIn,
) -> FeedbackItem:
    with Session(sql_engine) as db_session:
        db_item = FeedbackItem(
            type=new_item.type,
            title=new_item.title,
            description=new_item.description,
            private=new_item.private,
            reporter_id=profile_id,
        )
        db_session.add(db_item)
        db_session.commit()

        # asserts presence of id, triggers a db refresh
        if not db_item.id or not db_item.reporter.id:
            raise KeyError

        return db_item


def list_db_feedback_items_public_and_users(
    sql_engine: Engine,
    profile_id: int,
    page: int,
    page_size: int,
    only_current_user: bool = False,
) -> List[FeedbackItem]:
    with Session(sql_engine) as db_session:
        db_items: List[FeedbackItem] = db_session.query(FeedbackItem).filter(
            or_(FeedbackItem.reporter_id == profile_id, ~FeedbackItem.private)
        )

        if only_current_user:
            db_items = db_items.filter(FeedbackItem.private)

        # pagination
        db_items = db_items.offset(page_size * (page - 1)).limit(page_size).all()

        print("--->", db_items)

        # asserts presence of id, triggers a db refresh
        for db_item in db_items:
            if not db_item.id:
                raise KeyError
            if not db_item.reporter:
                raise KeyError

        return db_items


def count_db_feed_items_for_user(
    sql_engine: Engine,
    profile_id: int,
):
    with Session(sql_engine) as db_session:
        return (
            db_session.query(FeedbackItem.id)
            .filter(FeedbackItem.reporter_id == profile_id)
            .count()
        )


def delete_db_feedback_items(
    sql_engine: Engine, profile_id: int, feedback_item_ids: List[int]
) -> List[int]:
    with Session(sql_engine) as db_session:
        # TODO allow admin to delete (not profile service features required)
        stmt = delete(FeedbackItem).where(
            and_(
                FeedbackItem.id.in_(feedback_item_ids),
                FeedbackItem.reporter_id == profile_id,
            )
        )
        db_session.execute(stmt)
        db_session.commit()
        return feedback_item_ids
