from io import (
    BytesIO,
)
from typing import (
    Annotated,
    Any,
)

import requests
from fastapi import (
    APIRouter,
    Body,
    Request,
)
from fastapi.responses import (
    StreamingResponse,
)
from pydantic import (
    BaseModel,
)

from space_api.database.db_models import (
    PositionType,
)
from space_api.security.decorators import (
    ensure_authorization,
)
from space_api.utils.error_handlers import (
    error_handlers,
)
from space_api.utils.response import (
    BaseResponse,
)

router = APIRouter()


class ResponseCertificate(BaseResponse):
    data: Any = None

    class Config:
        schema_extra = BaseResponse.schema_wrapper("")


class FormData(BaseModel):
    fields: Any


@router.post(
    "/certificate/membership",
    response_description="Renders a certificate for a given profile",
)
@error_handlers
@ensure_authorization(
    any_of_positions=[(PositionType.TEAMLEAD, None), (None, "board")],
    any_of_roles=["create_certificate"],
)
def list_role_holderships(
    request: Request,
    data: Annotated[dict[str, str], Body(embed=True)],
) -> dict:
    response = requests.post(
        "http://localhost:3009/create-certificate/membership",
        headers={"content_type": "application/json"},
        data=data,
        timeout=15,
    )

    if 200 <= response.status_code < 300:
        return StreamingResponse(
            BytesIO(response.content), media_type="application/pdf"
        )

    else:
        print(response.content)
        return {
            "status_code": 500,
            "response_type": "error",
            "description": "",
        }
