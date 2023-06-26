import enum
from datetime import (
    datetime,
)
from typing import (
    List,
    Optional,
)

from dateutil.relativedelta import (
    relativedelta,
)
from pydantic import (
    BaseModel,
)
from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Boolean,
    Float,
    func,
)
from sqlalchemy.ext.hybrid import (
    hybrid_property,
)
from sqlalchemy.orm import (
    Mapped,
    declarative_base,
    mapped_column,
    relationship,
)

# don't touch this base class!
SaBaseModel = declarative_base()


class MixinAsDict:
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class PositionType(enum.Enum):
    TEAMLEAD = "Teamlead"
    PRESIDENT = "President"
    MEMBER = "Member"
    ALUMNI = "Alumni"
    APPLICANT = "Applicant"


class Department(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "department"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from DepartmentMembership
    memberships: Mapped[List["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="department"
    )

    def __repr__(self) -> str:
        return f"Department(id={self.handle!r}, name={self.name!r})"


class JobHistoryElement(BaseModel):
    employer: str
    position: str
    date_from: str
    date_to: str

    @classmethod
    def dummy(cls) -> "JobHistoryElement":
        return JobHistoryElement.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "employer": "Google",
                "position": "SWE Intern",
                "date_from": "15.01.2023",
                "date_to": "31.03.2023",
            }
        }


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
    phone: Mapped[Optional[str]] = mapped_column(String(50), index=True, nullable=True)

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)

    birthday = Column(DateTime, nullable=True)
    nationality: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # TODO: see https://sqlalchemy-imageattach.readthedocs.io/en/0.8.0/api/entity.html
    # profile_picture

    activity_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    degree_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    degree_name: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    degree_semester: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    degree_semester_last_change_date = Column(DateTime, nullable=True)
    university: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)

    # format: csv list of <employer:position:from:to>,
    job_history: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # ------------------------- SUPERVISOR CHANGEABLE FIELDS ------------------------- #
    time_joined = Column(DateTime, nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from SocialNetwork
    social_networks: Mapped[List["SocialNetwork"]] = relationship(
        "SocialNetwork", back_populates="profile"
    )

    # back reference from DepartmentMembership
    department_memberships: Mapped[List["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="profile"
    )

    # back reference from RoleHoldership
    role_holderships: Mapped[List["RoleHoldership"]] = relationship(
        "RoleHoldership", back_populates="profile"
    )

    # back reference from MembershipApplicationReview
    reviews: Mapped[List["MembershipApplicationReview"]] = relationship(
        "MembershipApplicationReview", back_populates="profile"
    )

    # back reference from MembershipApplicationReferral
    referrals: Mapped[List["MembershipApplicationReferral"]] = relationship(
        "MembershipApplicationReferral", back_populates="profile"
    )

    # --------------------------- AUTOMATIC/COMPUTED FIELDS -------------------------- #
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    @hybrid_property
    def tum_ai_semester(self) -> relativedelta:
        """automatically computed by python from db model"""
        return relativedelta(datetime.now(), self.date_joined).years * 2

    @hybrid_property
    def full_name(self) -> str:
        """automatically computed by python from db model"""
        return f"{self.first_name} {self.last_name}"

    @hybrid_property
    def decoded_job_history(self) -> List[JobHistoryElement]:
        job_history = []
        if job_history and len(job_history) > 0:
            for entry in f"{job_history}".split(","):
                fields = entry.split(":")
                if len(fields) != 4:
                    continue
                job_history.append(
                    JobHistoryElement(
                        employer=fields[0],
                        position=fields[1],
                        date_from=fields[2],
                        date_to=fields[3],
                    )
                )
        return job_history

    def __repr__(self) -> str:
        return f"Profile(id={self.id}, fullname={self.full_name})"

    @classmethod
    def encode_job_history(cls, job_history: JobHistoryElement) -> Optional[str]:
        # encode job_history in csv of <employer:position:from:to>
        encoded_history: str | None = ""
        for hist in job_history:
            # TODO abstraction
            encoded_history = (
                f"{encoded_history}{hist.employer}:{hist.position}:"
                + f"{hist.date_from}:{hist.date_to},"
            )
        if len(encoded_history or "") > 0:
            encoded_history = encoded_history[:-1]  # strip trailing comma
        else:
            encoded_history = None

        return encoded_history

    def force_load(self) -> None:
        for sn in self.social_networks:
            if not sn.profile_id:
                raise KeyError

        for dm in self.department_memberships:
            assert isinstance(dm, DepartmentMembership)
            if not dm.profile_id or not dm.department_handle:
                raise KeyError


class SocialNetworkType(enum.Enum):
    SLACK = "Slack"
    LINKEDIN = "LinkedIn"
    GITHUB = "GitHub"
    PHONENUMBER = "Phone"
    INSTAGRAM = "Instagram"
    TELEGRAM = "Telegram"
    DISCORD = "Discord"
    OTHER = "Other"


class SocialNetwork(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "social_network"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), primary_key=True
    )
    type = Column(Enum(SocialNetworkType), primary_key=True)

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    handle: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    link: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

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
    position = Column(Enum(PositionType), nullable=False)
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
    description: Mapped[Optional[str]] = mapped_column(nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #

    # back reference from RoleHoldership
    holderships: Mapped[List["RoleHoldership"]] = relationship(
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


class MembershipApplication(MixinAsDict, SaBaseModel):
    """database model"""

    __tablename__ = "membership_application"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # --------------------------- AUTOMATIC/COMPUTED FIELDS -------------------------- #
    time_created = Column(DateTime(timezone=True), server_default=func.now())

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    # Personal info
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), index=True, nullable=True)
    gender: Mapped[Gender] = mapped_column(Enum(Gender), nullable=False)
    nationality: Mapped[str] = mapped_column(String(100), nullable=False)
    birthday = Column(DateTime, nullable=True)
    place_of_residence: Mapped[Optional[str]] = mapped_column(
        String(100), 
        nullable=True
    )

    # Digital appearance
    resume: Mapped[str] = mapped_column(String(1024), nullable=False)
    linkedin: Mapped[str] = mapped_column(String(1024), nullable=False)
    personal_website: Mapped[str] = mapped_column(String(1024), nullable=False)
    github: Mapped[str] = mapped_column(String(1024), nullable=False)

    # Professional info
    occupation: Mapped[str] = mapped_column(
        String(50), 
        nullable=True, 
        default="student"
    )
    degree_level: Mapped[str] = mapped_column(String(20), nullable=False)
    degree_name: Mapped[str] = mapped_column(String(80), nullable=False)
    degree_semester: Mapped[int] = mapped_column(Integer, nullable=False)
    university: Mapped[str] = mapped_column(String(160), nullable=False)
    areas_of_expertise: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    hours_per_week: Mapped[str] = mapped_column(String(10), nullable=False)

    # Who are you
    drive_passion: Mapped[str] = mapped_column(String, nullable=False)
    what_sets_apart: Mapped[str] = mapped_column(String, nullable=False)
    most_proud_achievement: Mapped[str] = mapped_column(String, nullable=False)
    learning_from_project_failure: Mapped[str] = mapped_column(String, nullable=False)

    # Fit to TUM.ai
    expectations: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    what_want_to_do: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    upcoming_commitments: Mapped[str] = mapped_column(String, nullable=False)
    topics_ai: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    skills: Mapped[str] = mapped_column(String, nullable=False)

    # Department Fit: Top 3 Departments
    num1_department_choice: Mapped[str] = mapped_column(String, nullable=False)
    num2_department_choice: Mapped[str] = mapped_column(String, nullable=False)
    num3_department_choice: Mapped[str] = mapped_column(String, nullable=False)
    num1_department_reasoning: Mapped[Optional[str]
                                      ] = mapped_column(String, nullable=True)
    num2_department_reasoning: Mapped[Optional[str]
                                      ] = mapped_column(String, nullable=True)
    num3_department_reasoning: Mapped[Optional[str]
                                      ] = mapped_column(String, nullable=True)
    department_reasoning: Mapped[str] = mapped_column(String, nullable=False)

    # RD questions
    research_development_interest: Mapped[bool] = mapped_column(Boolean, nullable=True)
    research_development_reasoning: Mapped[Optional[str]] = mapped_column(
        String, nullable=True)

    # General questions
    tumai_awareness: Mapped[str] = mapped_column(String, nullable=False)
    shirtSize: Mapped[str] = mapped_column(String(8), nullable=True)
    becomeTeamlead: Mapped[bool] = mapped_column(Boolean, nullable=True)
    teamlead_reasoning: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    # back reference from MembershipApplicationReview
    reviews: Mapped[List["MembershipApplicationReview"]] = relationship(
        "MembershipApplicationReview", back_populates="application")

    def __repr__(self) -> str:
        return f"MembershipApplication(id={self.id}, \
            first_name={self.first_name}, last_name={self.last_name})"


class MembershipApplicationReview(MixinAsDict, SaBaseModel):
    __tablename__ = "membership_application_review"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # --------------------------- AUTOMATIC/COMPUTED FIELDS -------------------------- #
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    motivation: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    skill: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    fit: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    in_tumai: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    commentFitTUMai: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    timecommit: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    dept1Score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    dept2Score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    dept3Score: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    maybegoodfit: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    furthercomments: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    referral: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    finalscore: Mapped[float] = mapped_column(Float, nullable=False, default=-1.0)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    reviewer: Mapped[int] = mapped_column(ForeignKey(Profile.id), nullable=False)
    profile: Mapped["Profile"] = relationship("Profile", back_populates="reviews")

    reviewee: Mapped[int] = mapped_column(ForeignKey(
        MembershipApplication.id, ondelete="CASCADE"), nullable=False)
    application: Mapped["MembershipApplication"] = relationship(
        "MembershipApplication", back_populates="reviews")

    def __repr__(self) -> str:
        return f"MembershipApplicationReview(review_id={self.review_id}, \
            reviewer_id={self.reviewer_id}, reviewee_id={self.reviewee_id})"

    def force_load(self) -> None:
        if not self.reviewer:
            raise KeyError
        
        self.profile.force_load()

class MembershipApplicationReferral(MixinAsDict, SaBaseModel):
    __tablename__ = "membership_application_referral"

    # -------------------------------- MANAGED FIELDS -------------------------------- #
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # ---------------------------- USER CHANGEABLE FIELDS ---------------------------- #
    applicant_first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    applicant_last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # ----------------------------- RELATIONAL FK FIELDS ----------------------------- #
    referral_by: Mapped[int] = mapped_column(ForeignKey(Profile.id), nullable=False)
    profile: Mapped["Profile"] = relationship("Profile", back_populates="referrals")

    def __repr__(self) -> str:
        return f"MembershipApplicationReferral(user_id={self.user_id}, \
            applicant_first_name={self.applicant_first_name}, \
                applicant_last_name={self.applicant_last_name})"
