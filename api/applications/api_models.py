from pydantic import (
    BaseModel,
)

from typing import Any

from database.db_models import (
    Application
)


class ApplicationIn(BaseModel):
    submission: Any

    @classmethod
    def from_db_model(
        cls, application: Application
    ) -> "ApplicationIn":
        return ApplicationIn(
            submission=application.submission
        )

    @classmethod
    def dummy(cls) -> "ApplicationIn":
        return ApplicationIn.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "submission": {
                    "type": "Industry",
                    "fields": [
                        {
                            "key": 'question_mVGEg3_8b5711e3-f6a2-4e25-9e68-5d730598c681',
                            "label": 'utm_campaign',
                            "type": 'HIDDEN_FIELDS',
                            "value": 'newsletter',
                        },
                    ]
                }
            }
        }


class ApplicationOut(BaseModel):
    id: int
    submission: Any

    @classmethod
    def from_db_model(
        cls, application: Application
    ) -> "ApplicationOut":
        return ApplicationOut(
            id=application.id,
            submission=application.submission
        )

    @classmethod
    def dummy(cls) -> "ApplicationOut":
        return ApplicationOut.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "submission": {
                    "type": "Industry",
                    "fields": [
                        {
                            "key": 'question_mVGEg3_8b5711e3-f6a2-4e25-9e68-5d730598c681',
                            "label": 'utm_campaign',
                            "type": 'HIDDEN_FIELDS',
                            "value": 'newsletter',
                        },
                    ]
                }
            }
        }