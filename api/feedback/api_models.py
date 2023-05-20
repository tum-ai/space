from typing import (
    Optional,
)

from pydantic import (
    BaseModel,
)

from feedback.db_models import (
    FeedbackItem,
    FeedbackItemType,
)
from profiles.db_models import (
    Profile,
)


class FeedbackItemIn(BaseModel):
    type: FeedbackItemType
    title: str
    description: Optional[str]

    @classmethod
    def dummy(cls) -> "FeedbackItemIn":
        return FeedbackItemIn(
            type=FeedbackItemType.FEATURE,
            title="Some feedback title",
            description="Some feedback description..."
        )

    class Config:
        schema_extra = {
            "example": {
                "type": FeedbackItemType.FEATURE,
                "title": "Some feedback title",
                "description": "Some feedback description...",
            }
        }


class FeedbackItemReporterOut(BaseModel):
    id: int
    full_name: str

    @classmethod
    def from_db_model(cls, profile: Profile) -> "FeedbackItemReporterOut":
        return FeedbackItemReporterOut(
            id=profile.id,
            full_name=profile.full_name,
        )

    @classmethod
    def dummy(cls) -> "FeedbackItemReporterOut":
        return FeedbackItemReporterOut(
            id=42,
            full_name="Max Mustermann",
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 42,
                "full_name": "Max Mustermann",
            }
        }


class FeedbackItemOut(BaseModel):
    id: int

    type: FeedbackItemType
    title: str
    description: Optional[str]

    reporter: FeedbackItemReporterOut

    @classmethod
    def from_db_model(cls, feedback_item: FeedbackItem) -> "FeedbackItemOut":
        return FeedbackItemOut(
            id=feedback_item.id,
            type=feedback_item.type,
            title=feedback_item.title,
            description=feedback_item.description,
            reporter=FeedbackItemReporterOut.from_db_model(feedback_item.reporter),
        )

    @classmethod
    def dummy(cls) -> "FeedbackItemOut":
        return FeedbackItemOut(
            id=42,
            type=FeedbackItemType.FEATURE,
            title="Some feedback title",
            description="Some feedback description...",
            reporter=FeedbackItemReporterOut.dummy(),
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 42,
                "type": FeedbackItemType.FEATURE,
                "title": "Some feedback title",
                "description": "Some feedback description...",
                "reporter": FeedbackItemReporterOut.dummy(),
            }
        }
