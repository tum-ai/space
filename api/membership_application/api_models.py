from datetime import (
    date,
)
from typing import (
    Optional,
)

from pydantic import (
    BaseModel,
)

from database.db_models import (
    Gender,
    MembershipApplication,
    MembershipApplicationReferral,
)


class MembershipApplicationListOut(BaseModel):
    id: int

    first_name: str
    last_name: str
    email: str
    gender: Gender
    nationality: str

    resume: str
    occupation: str
    degree_level: str
    degree_name: str
    degree_semester: int
    university: str

    num1_department_choice: str
    num2_department_choice: str
    num3_department_choice: str
    # profile_picture  # TODO

    @classmethod
    def from_db_model(
        cls, application: MembershipApplication
    ) -> "MembershipApplicationListOut":
        return MembershipApplicationListOut(
            id=application.id,
            first_name=application.first_name,
            last_name=application.last_name,
            email=application.email,
            gender=application.gender,
            nationality=application.nationality,
            resume=application.resume,
            occupation=application.occupation,
            degree_level=application.degree_level,
            degree_name=application.degree_name,
            degree_semester=application.degree_semester,
            university=application.university,
            num1_department_choice=application.num1_department_choice,
            num2_department_choice=application.num2_department_choice,
            num3_department_choice=application.num3_department_choice,
        )

    @classmethod
    def dummy(cls) -> "MembershipApplicationListOut":
        return MembershipApplicationListOut.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "gender": Gender.MALE,
                "nationality": "American",
                "resume": "path/to/resume.pdf",
                "occupation": "Software Engineer",
                "degree_level": "Bachelor's",
                "degree_name": "Computer Science",
                "degree_semester": 8,
                "university": "University of Example",
                "num1_department_choice": "Data Science",
                "num2_department_choice": "Software Engineering",
                "num3_department_choice": "Product Management",
            }
        }


class MembershipApplicationOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    gender: Gender
    nationality: str
    birthday: Optional[date]
    place_of_residence: Optional[str]

    resume: str
    linkedin: str
    personal_website: str
    github: str

    occupation: str
    degree_level: str
    degree_name: str
    degree_semester: int
    university: str
    areas_of_expertise: Optional[str]
    hours_per_week: str

    drive_passion: str
    what_sets_apart: str
    most_proud_achievement: str
    learning_from_project_failure: str

    expectations: Optional[str]
    what_want_to_do: Optional[str]
    upcoming_commitments: str
    topics_ai: Optional[str]
    skills: str

    num1_department_choice: str
    num2_department_choice: str
    num3_department_choice: str
    num1_department_reasoning: Optional[str]
    num2_department_reasoning: Optional[str]
    num3_department_reasoning: Optional[str]
    department_reasoning: str

    research_development_interest: bool
    research_development_reasoning: Optional[str]

    tumai_awareness: str
    shirtSize: str
    becomeTeamlead: bool
    teamlead_reasoning: Optional[str]

    @classmethod
    def from_db_model(
        cls, application: MembershipApplication
    ) -> "MembershipApplicationOut":
        return MembershipApplicationOut(
            id=application.id,
            first_name=application.first_name,
            last_name=application.last_name,
            email=application.email,
            phone=application.phone,
            gender=application.gender,
            nationality=application.nationality,
            birthday=application.birthday,
            place_of_residence=application.place_of_residence,
            resume=application.resume,
            linkedin=application.linkedin,
            personal_website=application.personal_website,
            github=application.github,
            occupation=application.occupation,
            degree_level=application.degree_level,
            degree_name=application.degree_name,
            degree_semester=application.degree_semester,
            university=application.university,
            areas_of_expertise=application.areas_of_expertise,
            hours_per_week=application.hours_per_week,
            drive_passion=application.drive_passion,
            what_sets_apart=application.what_sets_apart,
            most_proud_achievement=application.most_proud_achievement,
            learning_from_project_failure=application.learning_from_project_failure,
            expectations=application.expectations,
            what_want_to_do=application.what_want_to_do,
            upcoming_commitments=application.upcoming_commitments,
            topics_ai=application.topics_ai,
            skills=application.skills,
            num1_department_choice=application.num1_department_choice,
            num2_department_choice=application.num2_department_choice,
            num3_department_choice=application.num3_department_choice,
            num1_department_reasoning=application.num1_department_reasoning,
            num2_department_reasoning=application.num2_department_reasoning,
            num3_department_reasoning=application.num3_department_reasoning,
            department_reasoning=application.department_reasoning,
            research_development_interest=application.research_development_interest,
            research_development_reasoning=application.research_development_reasoning,
            tumai_awareness=application.tumai_awareness,
            shirtSize=application.shirtSize,
            becomeTeamlead=application.becomeTeamlead,
            teamlead_reasoning=application.teamlead_reasoning,
        )

    @classmethod
    def dummy(cls) -> "MembershipApplicationOut":
        return MembershipApplicationOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "phone": "+1-123-456-7890",
                "gender": Gender.MALE,
                "nationality": "American",
                "birthday": "1990-01-01",
                "place_of_residence": "New York City",
                "resume": "path/to/resume.pdf",
                "linkedin": "https://www.linkedin.com/in/johndoe",
                "personal_website": "https://www.johndoe.com",
                "github": "https://github.com/johndoe",
                "occupation": "Software Engineer",
                "degree_level": "Bachelor's",
                "degree_name": "Computer Science",
                "degree_semester": 8,
                "university": "University of Example",
                "areas_of_expertise": "Web Development, Data Science",
                "hours_per_week": "30",
                "drive_passion": "I'm passionate about creating innovative solutions.",
                "what_sets_apart": "My strong problem-solving skills and dedication.",
                "most_proud_achievement": "Launching a successful mobile app.",
                "learning_from_project_failure": "I learned the importance of testing.",
                "expectations": "I expect to learn and grow in a environment.",
                "what_want_to_do": "I want to work on challenging projects.",
                "upcoming_commitments": "I have a part-time job in the evenings.",
                "topics_ai": "Machine learning, natural language processing",
                "skills": "Python, JavaScript, SQL",
                "num1_department_choice": "Data Science",
                "num2_department_choice": "Software Engineering",
                "num3_department_choice": "Product Management",
                "num1_department_reasoning": "I have background in data.",
                "num2_department_reasoning": "I enjoy software solutions.",
                "num3_department_reasoning": "I have experience in processes.",
                "department_reasoning": "I believe these departments align with me.",
                "research_development_interest": True,
                "research_development_reasoning": "I'm interested in exploring AI.",
                "tumai_awareness": "I'm aware of TUM.ai and its mission.",
                "shirtSize": "Medium",
                "becomeTeamlead": False,
                "teamlead_reasoning": "",
            }
        }


class MembershipApplicationReferralIn(BaseModel):
    applicant_first_name: str
    applicant_last_name: str
    points: int
    comment: Optional[str]
    email: str

    @classmethod
    def from_db_model(
        cls, referral: MembershipApplicationReferral
    ) -> "MembershipApplicationReferralIn":
        return MembershipApplicationReferralIn(
            applicant_first_name=referral.applicant_first_name,
            applicant_last_name=referral.applicant_last_name,
            points=referral.points,
            comment=referral.comment,
            email=referral.email,
        )

    @classmethod
    def dummy(cls) -> "MembershipApplicationReferralIn":
        return MembershipApplicationReferralIn.parse_obj(
            cls.Config.schema_extra["example"]
        )

    class Config:
        schema_extra = {
            "example": {
                "applicant_first_name": "John",
                "applicant_last_name": "Test",
                "points": 10,
                "comment": "He is my best friend.",
                "referral_by": 1,
                "email": "john@gmx.de",
            }
        }
