import enum
from datetime import datetime
from typing import Any, Literal, cast

from dateutil.relativedelta import relativedelta
from pydantic import BaseModel, ConfigDict
from sqlalchemy import (
    JSON,
    TEXT,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class SaBaseModel(DeclarativeBase):
    pass


class MixinAsDict:
    def as_dict(self):
        return {
            c.name: getattr(self, c.name) for c in getattr(self, "__table__").columns
        }


PositionType = Literal["teamlead", "president", "member", "alumni", "applicant"]


class Department(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "department"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from DepartmentMembership
    memberships: Mapped[list["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="department"
    )

    def __repr__(self) -> str:
        return f"Department(id={self.handle!r}, name={self.name!r})"


class JobHistoryElement(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "employer": "Google",
                "position": "SWE Intern",
                "date_from": "15.01.2023",
                "date_to": "31.03.2023",
            }
        }
    )

    employer: str
    position: str
    date_from: str
    date_to: str

    @classmethod
    def dummy(cls) -> "JobHistoryElement":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return JobHistoryElement.model_validate(json["example"])


class Profile(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "profile"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    firebase_uid: Mapped[str] = mapped_column(
        String, unique=True, index=True, nullable=False
    )

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    email: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), index=True, nullable=True)

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)

    birthday = Column(Date, nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)

    profile_picture: Mapped[str | None] = mapped_column(TEXT, nullable=True)

    activity_status: Mapped[str | None] = mapped_column(String(50), nullable=True)

    degree_level: Mapped[str | None] = mapped_column(String(20), nullable=True)
    degree_name: Mapped[str | None] = mapped_column(String(80), nullable=True)
    degree_semester: Mapped[int | None] = mapped_column(Integer, nullable=True)
    degree_semester_last_change_date = Column(DateTime, nullable=True)
    university: Mapped[str | None] = mapped_column(String(160), nullable=True)

    # format: csv list of <employer:position:from:to>,
    job_history: Mapped[str | None] = mapped_column(String, nullable=True)

    # ------------------------- SUPERVISOR CHANGEABLE FIELDS ------------------------- #
    time_joined = Column(DateTime, nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from SocialNetwork
    social_networks: Mapped[list["SocialNetwork"]] = relationship(
        "SocialNetwork", back_populates="profile"
    )

    # back reference from DepartmentMembership
    department_memberships: Mapped[list["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="profile"
    )

    # back reference from RoleHoldership
    role_holderships: Mapped[list["RoleHoldership"]] = relationship(
        "RoleHoldership", back_populates="profile"
    )

    # back reference from ApplicationReview
    reviews: Mapped[list["ApplicationReview"]] = relationship(
        "ApplicationReview", back_populates="reviewer"
    )

    # back reference from MembershipApplicationReferral
    referrals_received: Mapped[list["ApplicationReferral"]] = relationship(
        "ApplicationReferral",
        back_populates="profile",
        foreign_keys="ApplicationReferral.profile_id",
    )
    referrals_given: Mapped[list["ApplicationReferral"]] = relationship(
        "ApplicationReferral",
        back_populates="referer",
        foreign_keys="ApplicationReferral.referer_id",
    )

    # --------------------------- AUTOMATIC/COMPUTED FIELDS -------------------------- #
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    @hybrid_property
    def tum_ai_semester(self) -> int:
        """automatically computed by python from db model"""
        return relativedelta(datetime.now(), self.time_joined).years * 2  # type: ignore

    @hybrid_property
    def full_name(self) -> str:
        """automatically computed by python from db model"""
        return f"{self.first_name} {self.last_name}"

    @hybrid_property
    def decoded_job_history(self) -> list[JobHistoryElement]:
        new_job_history = []
        if self.job_history and len(self.job_history) > 0:
            for entry in f"{self.job_history}".split(","):
                fields = entry.split(":")
                if len(fields) != 4:
                    continue
                new_job_history.append(
                    JobHistoryElement(
                        employer=fields[0],
                        position=fields[1],
                        date_from=fields[2],
                        date_to=fields[3],
                    )
                )
        print("decoded new job history: ", new_job_history)
        return new_job_history

    def __repr__(self) -> str:
        return f"Profile(id={self.id}, fullname={self.full_name})"

    @classmethod
    def encode_job_history(cls, job_history: list[JobHistoryElement]) -> str | None:
        # encode job_history in csv of <employer:position:from:to>
        encoded_history: str = ""
        for hist in job_history:
            # TODO abstraction
            encoded_history = (
                f"{encoded_history}{hist.employer}:{hist.position}:"
                + f"{hist.date_from}:{hist.date_to},"
            )
        if len(encoded_history or "") > 0:
            return encoded_history[:-1]  # strip trailing comma
        else:
            return None

    def force_load(self) -> None:
        for sn in self.social_networks:
            if not sn.profile_id:
                raise KeyError

        for dm in self.department_memberships:
            assert isinstance(dm, DepartmentMembership)
            if not dm.profile_id or not dm.department_handle:
                raise KeyError


SocialNetworkType = Literal[
    "slack", "linkedin", "github", "phone", "instagram", "telegram", "discord", "other"
]


class SocialNetwork(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "social_network"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), primary_key=True
    )
    type = Column(String, primary_key=True)

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    handle: Mapped[str | None] = mapped_column(String(40), nullable=True)
    link: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="social_networks", cascade="all,delete"
    )

    __table_args__ = (
        (CheckConstraint("(handle IS NULL) <> (link IS NULL)", name="handle_xor_link")),
    )

    def __repr__(self) -> str:
        return (
            f"SocialNetwork(profile_id={self.profile_id!r}, type={self.type!r}, "
            f"fullname={self.handle!r}, link={self.link!r})"
        )


class DepartmentMembership(MixinAsDict, SaBaseModel):
    """database relation"""

    __tablename__ = "department_membership"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # ------------------------- SUPERVISOR CHANGEABLE FIELDS ------------------------- #
    position = Column(String, nullable=False)
    time_from = Column(DateTime, nullable=True)
    time_to = Column(DateTime, nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), nullable=False
    )
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="department_memberships", cascade="all,delete"
    )

    department_handle: Mapped[str] = mapped_column(
        ForeignKey(Department.handle), nullable=False
    )
    department: Mapped["Department"] = relationship(
        "Department", back_populates="memberships"
    )

    def __repr__(self) -> str:
        return (
            f"DepartmentMembership(id={self.profile_id!r} "
            + f"({self.profile.first_name} {self.profile.last_name})"
            + ", department_handle={self.department_handle!r})"
        )

    def force_load(self) -> None:
        if not self.profile_id or not self.profile.id:
            raise KeyError

        if not self.department or not self.department.handle:
            raise KeyError


class Role(MixinAsDict, SaBaseModel):
    """database relation"""

    __tablename__ = "role"

    handle: Mapped[str] = mapped_column(primary_key=True)
    description: Mapped[str | None] = mapped_column(nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #

    # back reference from RoleHoldership
    holderships: Mapped[list["RoleHoldership"]] = relationship(
        "RoleHoldership", back_populates="role"
    )

    def __repr__(self) -> str:
        return f"Role(handle={self.handle!r}, description={self.description})"


class RoleHoldership(MixinAsDict, SaBaseModel):
    """database relation"""

    __tablename__ = "role_holdership"

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), primary_key=True, nullable=False
    )
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="role_holderships", cascade="all,delete"
    )

    role_handle: Mapped[str] = mapped_column(
        ForeignKey(Role.handle), primary_key=True, nullable=False
    )
    role: Mapped["Role"] = relationship(
        "Role", back_populates="holderships", cascade="all,delete"
    )

    def __repr__(self) -> str:
        return (
            f"RoleHoldership(profile_id={self.profile_id!r}, "
            f"role_handle={self.role_handle!r})"
        )

    def force_load(self) -> None:
        if not self.profile_id or not self.profile.id:
            raise KeyError
        if not self.role_handle or not self.role.handle:
            raise KeyError
        self.profile.force_load()


class Gender(enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    NON_BINARY = "Non-Binary"
    PREFER_NOT_TO_SAY = "Prefer not to say"


class Application(MixinAsDict, SaBaseModel):
    """database relation"""

    __tablename__ = "application"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    submission: Mapped[str] = mapped_column(JSON, nullable=False)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from ApplicationReview
    reviews: Mapped[list["ApplicationReview"]] = relationship(
        "ApplicationReview", back_populates="application"
    )

    def __repr__(self) -> str:
        return f"Application(id={self.id!r}"

    def force_load(self) -> None:
        if not self.id:
            raise KeyError
        if not self.submission:
            raise KeyError


class ApplicationReview(MixinAsDict, SaBaseModel):
    __tablename__ = "application_review"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # --------------------------- AUTOMATIC/COMPUTED FIELDS -------------------------- #
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    motivation: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    skill: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    fit: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    in_tumai: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    comment_fit_tumai: Mapped[str | None] = mapped_column(String, nullable=True)
    timecommit: Mapped[str | None] = mapped_column(String, nullable=True)

    dept1_score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    dept2_score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    dept3_score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    maybegoodfit: Mapped[str | None] = mapped_column(String, nullable=True)
    furthercomments: Mapped[str | None] = mapped_column(String, nullable=True)

    referral: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    finalscore: Mapped[float] = mapped_column(Float, nullable=False, default=-1.0)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    reviewer_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), nullable=False)
    reviewer: Mapped["Profile"] = relationship("Profile", back_populates="reviews")

    reviewee_id: Mapped[int] = mapped_column(
        ForeignKey(Application.id, ondelete="CASCADE"), nullable=False
    )
    reviewee: Mapped["Application"] = relationship("Profile", back_populates="reviews")
    application: Mapped["Application"] = relationship(
        "Application", back_populates="reviews"
    )

    def __repr__(self) -> str:
        return f"ApplicationReview(id={self.id}, \
            reviewer_id={self.reviewer_id}, reviewee_id={self.reviewee_id})"

    def force_load(self) -> None:
        if not self.reviewer_id:
            raise KeyError

        self.reviewer.force_load()
        self.reviewee.force_load()


class ApplicationReferral(MixinAsDict, SaBaseModel):
    __tablename__ = "application_referral"

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    applicant_first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    applicant_last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, primary_key=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    referer_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id), primary_key=True, nullable=False
    )
    referer: Mapped["Profile"] = relationship(
        "Profile",
        back_populates="referrals_given",
        foreign_keys="ApplicationReferral.referer_id",
    )
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id, ondelete="CASCADE"))
    profile: Mapped["Profile"] = relationship(
        "Profile",
        back_populates="referrals_received",
        foreign_keys="ApplicationReferral.profile_id",
    )

    def __repr__(self) -> str:
        return f"ApplicationReferral(profile_id={self.profile_id}, \
            applicant_first_name={self.applicant_first_name}, \
            applicant_last_name={self.applicant_last_name})"
