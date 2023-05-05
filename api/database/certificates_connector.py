from typing import (
    List,
)

from sqlalchemy.orm import (
    Session,
)

from certification.db_models import (
    CertificationTemplate,
)


def list_db_certification_templates(sql_engine) -> List[CertificationTemplate]:
    with Session(sql_engine) as db_session:
        db_departments: List[CertificationTemplate] = (
            db_session.query(CertificationTemplate).limit(100).all()
        )
        return db_departments
