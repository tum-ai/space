from pydantic import BaseModel

from certification.db_models import CertificationTemplate


# template operations ##################################################################################################

# create update delete done via db directly

class CertificationTemplateOut(BaseModel):
    handle: str

    csv_replacors_with_types: str

    @classmethod
    def from_db_model(cls, template: CertificationTemplate) -> "CertificationTemplateOut":
        return CertificationTemplateOut(
            handle=template.handle,
            csv_replacors_with_types=template.csv_replacors_with_types,
        )

    @classmethod
    def dummy(cls) -> "DepartmentOut":
        return CertificationTemplateOut(
            handle="dummy_template",
            csv_replacors_with_types="dummy_field1:short,dummy_field2:long,dummy_field3:short",
        )

    class Config:
        schema_extra = {
            "example": {
                "handle": "dummy_template",
                "csv_replacors_with_types": "dummy_field1:short,dummy_field2:long,dummy_field3:short",
            }
        }


