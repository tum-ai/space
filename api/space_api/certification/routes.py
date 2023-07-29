from io import BytesIO
from typing import Annotated, Any

import requests
from fastapi import APIRouter, Body, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict

from space_api.security.decorators import ensure_authorization
from space_api.utils.error_handlers import error_handlers
from space_api.utils.response import BaseResponse

router = APIRouter()


class ResponseCertificate(BaseResponse):
    model_config = ConfigDict(json_schema_extra="")

    data: Any = None


class FormData(BaseModel):
    fields: Any


@router.post(
    "/certificate/membership",
    response_description="Renders a certificate for a given profile",
)
@error_handlers
@ensure_authorization(
    any_of_positions=[("teamlead", None), (None, "board")],
    any_of_roles=["create_certificate"],
)
def generate_certificate(
    request: Request,
    data: Annotated[dict[str, str], Body(embed=True)],
) -> Any:
    try:
        response = requests.post(
            # Using Docker name resolution
            "http://cert/create-certificate/membership",
            headers={"content_type": "application/json"},
            data=data,
            timeout=150,
        )

        if 200 <= response.status_code < 300:
            return StreamingResponse(
                BytesIO(response.content), media_type="application/pdf"
            )
    except Exception:
        pass
    return {
        "status_code": 500,
        "response_type": "error",
        "description": "Error generating certificate",
    }
