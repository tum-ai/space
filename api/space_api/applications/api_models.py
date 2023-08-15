from typing import Any, cast

from pydantic import BaseModel, ConfigDict

from space_api.database.db_models import Application


class ApplicationOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "submission": {
                    "type": "Industry",
                    "fields": [
                        {
                            "key": "question_mVGEg3_e25-9e68-5d730598c681",
                            "label": "utm_campaign",
                            "type": "HIDDEN_FIELDS",
                            "value": "newsletter",
                        },
                    ],
                },
            }
        }
    )

    id: int
    submission: dict

    @classmethod
    def from_db_model(cls, application: Application) -> "ApplicationOut":
        return ApplicationOut(id=application.id, submission=application.submission)

    @classmethod
    def dummy(cls) -> "ApplicationOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return json["example"]
