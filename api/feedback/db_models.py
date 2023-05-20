import enum
from typing import (
    Optional,
)

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from database.db_models import (
    Base,
    MixinAsDict,
)
from profiles.db_models import (
    Profile,
)


class FeedbackItemType(enum.Enum):
    FEATURE = "Feature"
    BUG = "Bug"
    OTHER = "Other"


class FeedbackItem(MixinAsDict, Base):
    """database model"""

    __tablename__ = "feedback_item"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # [USER CHANGEABLE FIELDS] ###########################################################

    type = Column(
        Enum(FeedbackItemType), nullable=False, default=FeedbackItemType.OTHER
    )
    title: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    # references Profile
    reporter_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), nullable=False
    )
    reporter: Mapped["Profile"] = relationship(
        "Profile", back_populates="feedback_items", cascade="all,delete"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return f"FeedbackItem(id={self.id!r}, title={self.title!r})"
