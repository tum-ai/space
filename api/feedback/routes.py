from typing import (
    Annotated,
    List,
)

import sqlalchemy
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Request,
)
from sqlalchemy_utils.types.pg_composite import (
    psycopg2,
)
from supertokens_python.recipe.session import (
    SessionContainer,
)
from supertokens_python.recipe.session.framework.fastapi import (
    verify_session,
)

from database.feedback_connector import (
    count_db_feed_items_for_user,
    create_feedback_item,
    delete_db_feedback_items,
    list_db_feedback_items_public_and_users,
)
from database.profiles_connector import (
    retrieve_db_profile_by_supertokens_id,
)
from feedback.api_models import (
    FeedbackItemIn,
    FeedbackItemOut,
)
from profiles.db_models import (
    Profile,
)
from template.models import (
    BaseResponse,
    ResponseDeletedIntList,
)
from utils.error_handlers import (
    async_error_handlers,
)
from utils.paging import (
    enable_paging,
)

router = APIRouter()


# department operations ##################################################################


class ResponseFeedBackItem(BaseResponse):
    data: FeedbackItemOut

    class Config:
        schema_extra = BaseResponse.schema_wrapper(FeedbackItemOut.dummy())


@router.post(
    "/item/",
    response_description="Add feedback item",
    response_model=ResponseFeedBackItem,
)
@async_error_handlers
async def add_feedback_item(
    request: Request,
    data: Annotated[FeedbackItemIn, Body(embed=True)],
    session: SessionContainer = Depends(verify_session()),
) -> ResponseFeedBackItem:
    """
    Create a feedback item.

    Args:
        request:
        data: FeedbackItemIn object
        session:

    Returns:
        FeedbackItemOut object
    """
    supertokens_user_id = session.get_user_id()
    db_profile: Profile = retrieve_db_profile_by_supertokens_id(
        request.app.state.sql_engine, supertokens_user_id
    )
    if count_db_feed_items_for_user(request.app.state.sql_engine, db_profile.id) >= 20:
        raise HTTPException(
            status_code=400,
            detail="You have reached your maximum contingent of 20 feedback items.",
        )

    try:
        new_db_item = create_feedback_item(
            request.app.state.sql_engine, db_profile.id, data
        )
    except sqlalchemy.exc.IntegrityError as error:
        if isinstance(error.orig, psycopg2.errors.UniqueViolation):
            raise HTTPException(
                status_code=400,
                detail="For this title there already is a feature request!",
            )

    new_item = FeedbackItemOut.from_db_model(new_db_item)
    return {
        "status_code": 201,
        "response_type": "success",
        "description": "Created FeedbackItem",
        "data": new_item,
    }


class ResponseFeedBackItemList(BaseResponse):
    data: List[FeedbackItemOut]

    class Config:
        schema_extra = BaseResponse.schema_wrapper(
            [FeedbackItemOut.dummy(), FeedbackItemOut.dummy()]
        )

@router.get(
    "/items/",
    response_description="List all feedback items, paging supported",
    response_model=ResponseFeedBackItemList,
)
@async_error_handlers
@enable_paging(max_page_size=100)
def list_feedback_items(
    request: Request,
    page: int = 1,
    page_size: int = 100,
    only_current_user: bool = False,
    session: SessionContainer = Depends(verify_session()),
) -> ResponseFeedBackItemList:
    """
    Returns a list of all public & the currently logged in user's FeedbackItems

    Args:
        page: 1 based page index
        page_size:
        only_current_user: will only show items of current user if activated
        session:
        request:

    Returns:
        ResponseFeedBackItemList
    """
    supertokens_user_id = session.get_user_id()
    db_profile: Profile = retrieve_db_profile_by_supertokens_id(
        request.app.state.sql_engine, supertokens_user_id
    )
    db_items = list_db_feedback_items_public_and_users(
        request.app.state.sql_engine,
        db_profile.id,
        page,
        page_size,
        only_current_user=only_current_user,
    )
    print("++++", db_items)
    out_items: List[FeedbackItemOut] = [
        FeedbackItemOut.from_db_model(item) for item in db_items
    ]
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "FeedbackItem list successfully received",
        "data": out_items,
    }


# NO UPDATE ENDPOINTS REQUIRED!

# TODO allow admin to delete (not profile service features required)


@router.delete(
    "/items/",
    response_description="delete all profiles",
    response_model=ResponseDeletedIntList,
)
@async_error_handlers
async def delete_feedback_items(
    request: Request,
    item_ids: List[int],
    session: SessionContainer = Depends(verify_session()),
) -> ResponseDeletedIntList:
    """
    Deletes the supplied list of FeedbackItems if they were created
    by the currently logged-in user.

    Args:
        request:
        item_ids: list of FeedbackItem ids to delete
        session:

    Returns:
        list of deleted FeedbackItems
    """
    supertokens_user_id = session.get_user_id()
    db_profile: Profile = retrieve_db_profile_by_supertokens_id(
        request.app.state.sql_engine, supertokens_user_id
    )
    deleted_profiles = delete_db_feedback_items(
        request.app.state.sql_engine, db_profile.id, item_ids
    )
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Profile list successfully deleted",
        "data": deleted_profiles,
    }
