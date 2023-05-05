from typing import (
    List,
)

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
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


class CertificationTemplate(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_template"

    # [MANAGED FIELDS] ###################################################################
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # [USER CHANGEABLE FIELDS] ###########################################################
    # types: short, long, number
    # e.g. "name:short,description:long,prize:short"
    csv_replacors_with_types: Mapped[str] = mapped_column(String, nullable=False)

    # [RELATIONAL FK FIELDS] #############################################################
    # back reference from CertificationRequest
    requests: Mapped[List["CertificationRequest"]] = relationship(
        "CertificationRequest", back_populates="template"
    )

    # back reference from Certificate
    certificates: Mapped[List["Certificate"]] = relationship(
        "Certificate", back_populates="template"
    )

    def __repr__(self) -> str:
        return f"CertificationTemplate(id={self.handle})"


class CertificationRequest(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_requests"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # [CONST FIELDS] #####################################################################
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), nullable=False)
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="certification_requests"
    )

    template_handle: Mapped[str] = mapped_column(
        ForeignKey(CertificationTemplate.handle), nullable=False
    )
    template: Mapped["CertificationTemplate"] = relationship(
        "CertificationTemplate", back_populates="requests"
    )

    # back reference from CertificationFeedback
    feedback: Mapped[List["CertificationFeedback"]] = relationship(
        "CertificationFeedback", back_populates="request"
    )

    # back reference from Certificate
    certificate: Mapped["Certificate"] = relationship(
        "Certificate", back_populates="request"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return f"CertificationRequest(id={self.handle!r}, name={self.name!r})"


class CertificationFeedback(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_feedback"

    # [MANAGED FIELDS] ###################################################################
    request_id: Mapped[int] = mapped_column(
        ForeignKey(CertificationRequest.id, ondelete="SET NULL"), primary_key=True
    )
    approver_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="SET NULL"), primary_key=True
    )

    # [USER CHANGEABLE FIELDS] ###########################################################
    approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    feedback_text: Mapped[str] = mapped_column(String(400))
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    request: Mapped["CertificationRequest"] = relationship(
        "CertificationRequest", back_populates="feedback"
    )
    approver: Mapped["Profile"] = relationship("Profile")

    __table_args__ = (
        (
            CheckConstraint(
                "(approved) <> (NOT csv_replacors_values IS NULL)",
                name="handle_xor_link",
            )
        ),
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return (
            f"CertificationFeedback(request_id={self.request_id}, "
            f"approver_id={self.approver_id}, "
            f"approved={self.approved})"
        )


class Certificate(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certificate"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # [CONST FIELDS] #####################################################################
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)
    cdn_download_link: Mapped[str] = mapped_column(String(2048), nullable=False)
    cdn_expiry = Column(DateTime(timezone=True), nullable=False)

    # [RELATIONAL FK FIELDS] #############################################################
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), nullable=False
    )
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="received_certificates", foreign_keys=[profile_id]
    )

    issuer_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="SET NULL"), nullable=True
    )
    issuer: Mapped["Profile"] = relationship(
        "Profile", back_populates="issued_certificates", foreign_keys=[issuer_id]
    )

    template_handle: Mapped[str] = mapped_column(
        ForeignKey(CertificationTemplate.handle, ondelete="SET NULL"), nullable=False
    )
    template: Mapped["CertificationTemplate"] = relationship(
        "CertificationTemplate", back_populates="certificates"
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey(CertificationRequest.id, ondelete="SET NULL"), nullable=True
    )
    request: Mapped["CertificationRequest"] = relationship(
        "CertificationRequest", back_populates="certificate"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return (
            f"Certificate(id={self.id}, profile_id={self.profile_id}, "
            f"issuer_id={self.issuer_id}, template_handle={self.template_handle}, "
            f"request_id={self.request_id})"
        )
