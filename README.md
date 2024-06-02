# TUM.ai Space 🚀
TUM.ai Space is an all-in-one platform with the purpose of tracking all internal processes related to members. This entails: development, performance, projects, and recruitment.

TUM.ai Space solves the following issues:
- Lack of a clear, systematic, observable overview of members' achievements
- Decoupled nature of the existing systems and the lack of extensibility thereof

Hence, TUM.ai Space facilitates the following: 
- Increased observability of TUM.ai's existing stakeholder data and projects in addition to prospective stakeholder data
- Centralized organization of internal information that is setup in an extensible and manageable format

## Organization

Project planning is conducted through [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are managed there - Github Issues should not be considered for development.

For instructions on working and developing a Linear ticket, please refer to [this section](#working-on-a-linear-ticket).

## Repo Structure

| Directory                  | Explanation                                   |
| -------------------------- | --------------------------------------------- |
| .fileserver/certification/ | Resources needed for generating a certificate |
| .github/workflows/         |                                               |
| api/                       | Backend, services                             |
| app/                       | Frontend                                      |

## Development

### Installation and Prerequisites

Consider the following as an ordered checklist of prerequisites for [running TUM.ai Space](#running-the-project)
- Linux Only: build/dev tools, mainly for make
1. Homebrew: See [here](https://brew.sh)
2. Node + NPM: See [here](https://nodejs.org/en/download/package-manager) <br>
3. Docker + Docker Compose: See [here](https://docs.docker.com/get-docker/)
4. Micromamba or Anaconda: See (recommended) [Micromamba](https://mamba.readthedocs.io/en/latest/micromamba-installation.html) or [Anaconda](https://docs.anaconda.com/free/anaconda/install/index.html)
5. Create the development environment using environment.yml: <br>

If you have Anaconda: 
```bash
~ cd api
~ conda env create -f environment.yml
```
If you have Micromamba:
```bash
~ cd api
~ micromamba env create -f environment.yml
```

6. (Optional but recommended) Pyenv: See [documentation](https://github.com/pyenv/pyenv) and [installer](https://github.com/pyenv/pyenv#automatic-installer)
7. **Signing your commits with GPG**: See [here](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) - this is highly encouraged but not necessary

### Setup

**Initial setup** \
For MacOS: 
1. Find your python version 
2. Execute the following:
```bash
open /Applications/Python\ {your python version}/Install\ Certificate.command
```

For Linux, MacOS, Windows: 
1. Create .env within /api
2. Paste [this](https://tum-ai-internal.slack.com/archives/C02787QJ95W/p1698584387138569) into /api/.env
3. Create .env within /app and paste in the following:
4. Create /api/.secrets and then /api/.secrets/tumai-space-firebase-adminsdk.json
5. Paste [this](https://tum-ai-internal.slack.com/archives/C02787QJ95W/p1698583880296439) into /api/.secrets/tumai-space-firebase-adminsdk.json - Add Firebase Admin SDK Certificate (for staging env): the development environment will use authentication of the Staging Firebase project 

### Running the Project

**Backend** in `/api/`
1. Change into the api directory:
```bash
~ cd api
```
2. Activate the Conda environment using either Micromamba or Anaconda:
```bash
~ micromamba activate space
```
or
```bash
~ conda activate space
```
3. Run the backend:

(Recommended)
```bash
~ uvicorn space_api.main:app --host 0.0.0.0 --reload --port 8000
```
or
```bash
~ make run  # in root dir (launch api in docker container)
```

**Frontend** in `/app/`
1. Install the project's frontend dependencies listed in the package.json file, create a node_modules directory and ensuring the correct package versions are used:
```bash
~ cd app
~ npm install
```

2. Start a development server for the frontend using npm:
```bash
~ npm run dev
```

**Using the precommit hook**

To trigger this manually:

```bash
~ pre-commit run --all
```

To trigger this on every commit:

```bash
~ pre-commit install
```

**Deploying to Firebase (hosting) manually / using Firebase local emulators:**

Consider checking out the commands listed in /app/Makefile.

> Please only use them if you know what you are doing!

### Generating mock data

Generate mock users, opportunities, applications and reviews using **faker** scripts.

Run command:

```bash
~ bun db:seed
```

Look up command line options:

```bash
~ bun db:seed -h
```

### Working on a Linear ticket

Working with Linear tickets is very similar to working with GitHub issues.
It works as follows:

1. Start by clicking on the chosen ticket
2. Click on the branch icon in the top left corner to copy the branch name - this allows Linear to track the ticket status and progress
3. Now locate the space repository and create a new branch:

```bash
~ git switch -c <branch-name>
```

4. Now push the branch and changes at first with:

```bash
~ git push --set-upstream origin <branch-name>
```

### Technology Stack

In the beginning of the project the team formed and chose a technical stack. This will not be changed and is a final decision.

**Backend**:

- Service Logic: `Python` using [`FastAPI`](https://github.com/tiangolo/fastapi) framework (apiDocs via `Pydantic` models)
- Database: `PostgreSQL` on Azure through `SQLAlchemy 2.0`

**Frontend**:

- [`NextJS`](https://nextjs.org/) framework for the website
- [`MobX`](https://mobx.js.org) for state management
- Firebase Auth for authentication

**Deployment**:

- Backend and Database (DB) on Azure - this will be moved to Google Cloud in the future
- Firebase Authentication for managing authentication, authorization and roles
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration of the backend and DB

## Documentation

To view an Entity-Relationship Diagram (ERD) of the system, paste `api/docs/erDiagram` file into a mermaid-style viewer like [this](https://mermaid.live/).
Alternatively, checkout the [/api/README.md](https://github.com/tum-ai/space/tree/main/api) on GitHub.

Documentation on the [frontend](https://www.notion.so/tum-ai/Frontend-Development-Guide-Documentation-259fdf1c5c1446d29fee4f16a39d4c0c?pvs=4) and [backend](https://www.notion.so/tum-ai/Backend-Development-Guide-Documentation-4c408603fb65439d94293c5189435770?pvs=4) as well as instructions on how to add services, pages, etc. can be seen on the linked Notion pages.

### FAQ

**A section with common errors and how to solve them can be found on [this](https://www.notion.so/tum-ai/Space-10953cc88e334d61a1fb37744bc72291?pvs=4) Notion page, documenting the project.**

**DevOps**:

- Deployed on Azure
- [`Firebase`](https://firebase.com/) for managing authentication
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration

**2. Staging**

- Deployed version of the staging branch
  - Frontend deployed to Firebase staging project ("tumai-space-staging")
  - Backend deployed to Azure Staging
  - Uses an Azure Staging DB
- Continuous-Integration (CI) Action is triggered on Pull-Request (PR) creation into main

**3. Production**:

- Deployed version of the main branch
  - Frontend deployed to Firebase production project ("tumai-space")
  - Backend deployed to Azure Production
  - Uses an Azure Production DB
- CI Action triggered on push commit to main (=merge PR)

One could also see the **Testing** CI part as an environment:

- Runs linting & unit tests on every pushed commit of all branches
- No deployment
- Uses an Azure Dev DB
