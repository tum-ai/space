This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Model

```mermaid
erDiagram
    Account ||--o{ User : ""
    Account {
        String id PK
        String userId FK
        String type
        String provider
        String providerAccountId
        Boolean ok
        String state
        String refresh_token
        String access_token
        Int expires_at
        String token_type
        String scope
        String id_token
        DateTime createdAt
        DateTime updatedAt
        String session_state
    }

    Session ||--o{ User : ""
    Session {
        String id PK
        String sessionToken
        String userId FK
        DateTime expires
        DateTime createdAt
        DateTime updatedAt
    }

    User ||--|{ VerificationToken : ""
    User ||--o{ Profile : ""
    User ||--o{ DepartmentMembership : ""
    User ||--o{ Opportunity : ""
    User ||--o{ OpportunityParticipation : ""
    User ||--o{ Review : ""
    User ||--o{ Account : ""
    User ||--o{ Session : ""
    User {
        String id PK
        Int profileId FK
        String email
        String password
        String first_name
        String last_name
        String image
        UserPermission permission
        DateTime emailVerified
        DateTime createdAt
        DateTime updatedAt
    }

    VerificationToken {
        String id PK
        String identifier
        String token
        DateTime expires
        DateTime createdAt
        DateTime updatedAt
    }

    Profile ||--|{ Contact : ""
    Profile ||--o{ User : ""
    Profile {
        Int id PK
        Int userId FK
        DateTime birthday
        String nationality
        String description
        String activity_status
        String degree_level
        String degree_name
        Int degree_semester
        DateTime degree_last_update
        String university
        String profile_picture
        DateTime createdAt
        DateTime updatedAt
    }

    Contact {
        Int id PK
        Int profileId FK
        ContactType type
        String username
        DateTime createdAt
        DateTime updatedAt
    }

    Department ||--|{ DepartmentMembership : ""
    Department ||--|{ Opportunity : ""
    Department {
        Int id PK
        String name
        DepartmentType type
        DateTime creation_date
        DateTime createdAt
        DateTime updatedAt
    }

    DepartmentMembership {
        Int id PK
        String userId FK
        Int departmentId FK
        DateTime membership_start
        DateTime membership_end
        DepartmentPosition department_position
        DateTime createdAt
        DateTime updatedAt
    }

    Opportunity ||--|{ Review : ""
    Opportunity ||--|{ OpportunityParticipation : ""
    Opportunity {
        Int id PK
        String creatorId FK
        String title
        String description
        Int departmentId FK
        DateTime opportunity_start
        DateTime opportunity_end
        DateTime createdAt
        DateTime updatedAt
    }

    OpportunityParticipation {
        String userId FK
        Int opportunityId FK
        OpportunityPermission permission
        DateTime createdAt
        DateTime updatedAt
    }

    Review {
        Int id PK
        Int opportunityId FK
        Int assigneeId FK
        String review_text
        Json content
        DateTime createdAt
        DateTime updatedAt
    }
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
