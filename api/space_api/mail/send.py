import asyncio
import os
import traceback

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr


def _conn_config() -> ConnectionConfig:
    conf = ConnectionConfig(
        MAIL_USERNAME=os.environ["MAIL_USERNAME"],
        MAIL_PASSWORD=os.environ["MAIL_PASSWORD"],
        MAIL_FROM=os.environ["MAIL_FROM"],
        MAIL_PORT=int(os.environ["MAIL_PORT"]),
        MAIL_SERVER=os.environ["MAIL_SERVER"],
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )
    return conf


def send_email(receipient: EmailStr, subject: str, body: str) -> None:
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[receipient],
            body=body,
            subtype=MessageType.plain,
        )
        fm = FastMail(_conn_config())

        async def async_callable():
            await fm.send_message(message)

        asyncio.run(async_callable())

    except Exception:
        traceback.print_exc()
