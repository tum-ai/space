classDiagram
    class Department {
        + department_id: int (PK)
        name: varchar
        mission: text
        department_type: varchar
        creation_date: date
        created_at: timestamp
        updated_at: timestamp
    }

    class DepartmentMembership {
        + department_membership_id: int (PK)
        user_id: int (FK) (@onDelete=SetNull)
        department_id: int (FK) (@onDelete=SetNull)
        membership_start: date
        membership_end: date
        position: enum
        created_at: timestamp
        updated_at: timestamp
    }

    class User {
        + user_id: int (PK)
        email: varchar
        password: varchar
        first_name: varchar
        last_name: varchar
        permission: enum
        created_at: timestamp
        updated_at: timestamp
    }

    class Profile {
        + profile_id: int (PK)
        user_id: int (FK)
        phone: varchar
        birthday: date
        nationality: varchar
        description: text
        activity_status: varchar
        degree_level: varchar
        degree_name: varchar
        degree_semester: int
        degree_last_update: timestamp
        university: varchar
        full_name: varchar
        profile_picture: text
        created_at: timestamp
        updated_at: timestamp
    }

    class Contact {
        + contact_id: int (PK)
        profile_id: int (FK)
        contact_type: enum
        contact_username: varchar
        created_at: timestamp
        updated_at: timestamp
    }

    class Opportunity {
        + opportunity_id: int (PK)
        title: varchar
        description: text
        department_id: int (FK)
        opportunity_start: date
        opportunity_end: date
        created_at: timestamp
        created_by: int (FK) (@onDelete=SetNull)
        commands: json
        questions: json
    }

    class OpportunityParticipation {
        + user_id: int (PK, FK) (@onDelete=Cascade)
        + opportunity_id: int (PK, FK) (@onDelete=Cascade)
        permission: enum
        created_at: timestamp
    }

    class Review {
        + review_id: int (PK)
        opportunity_id: int (FK) (@onDelete=Cascade)
        assignee_id: int (FK, nullable)
        review_text: text
        created_at: timestamp
        content: json
    }

    User -- UserPermission: permission
    Profile -- User: user_id
    Contact -- Profile: profile_id
    Contact -- ContactType: contact_type
    Opportunity -- User: created_by
    Opportunity -- Department: department_id
    OpportunityParticipation -- Opportunity: opportunity_id
    OpportunityParticipation -- User: user_id
    OpportunityParticipation -- OpportunityPermission: permission
    Review -- Opportunity: opportunity_id
    Review -- User: assignee_id
    DepartmentMembership -- Department: department_id
    DepartmentMembership -- User: user_id
    DepartmentMembership -- DepartmentPosition: position