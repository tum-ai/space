from pydantic import (
    BaseModel,
)

from database.db_models import (
    Application
)


class ApplicationOut(BaseModel):
    id: int
    submission: dict

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
                            "key": 'question_mVGEg3_e25-9e68-5d730598c681',
                            "label": 'utm_campaign',
                            "type": 'HIDDEN_FIELDS',
                            "value": 'newsletter',
                        },
                    ]
                }
            }
        }