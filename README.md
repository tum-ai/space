# TUM.ai Space 🚀
TUM.ai Spacean all-in-one platform with the purpose of tracking all internal processes related to members. This entails: development, performance, projects, and recruitment.

TUM.ai Space solves the following issues:
- Lack of a clear, systematic, observable overview of members' achievements
- Decoupled nature of the existing systems and the lack of extensibility thereof

Hence, TUM.ai Space facilitates the following: 
- Increasing observability of TUM.ai's existing stakeholder data and projects in addition to prospective stakeholder data
- Centralized organization of internal information that is setup in an extensible and and manageable format

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

### Prerequisites

Consider the following as an ordered checklist of prerequisites for running TUM.ai Space [running the project](#running-the-project)
- Linux Only: build/dev tools, mainly for make
1. Brew: See [here](https://brew.sh)
2. Node + NPM: See [here](https://nodejs.org/en/download/package-manager)
3. Docker + Docker Compose: See [here](https://docs.docker.com/get-docker/)
4. Python 3.10: See [here](https://www.python.org/downloads/)
5. Pre-Commit: See [pre-commit](https://pre-commit.com) and run `pre-commit install` once in the root of this project
6. Micromamba or Anaconda: See (recommended) [Micromamba](https://mamba.readthedocs.io/en/latest/micromamba-installation.html) or [Anaconda](https://docs.anaconda.com/free/anaconda/install/index.html)
6. (Optional but recommended) Pyenv: See [documentation](https://github.com/pyenv/pyenv) and [installer](https://github.com/pyenv/pyenv#automatic-installer)
- **Signing your commits with GPG** is highly encouraged. It is not enforced though!

For Anaconda: 
```
cd api
conda env create -f environment.yml
```
For Micromamba:
```
cd api
micromamba env create -f environment.yml
```

### Running the project

**Initial setup** \
For MacOS: 
1. Find your python version 
2. open /Applications/Python\ [python version]/Install\ Certificate.command

For Linux, MacOS, Windows: 
1. Create .env within /api
2. Paste [this](https://tum-ai-internal.slack.com/archives/C02787QJ95W/p1698584387138569) into /api/.env
3. Create .env within /app and paste in the following:
```
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_URL=http://localhost:8000/
```
4. Create /api/.secrets and then /api/.secrets/tumai-space-firebase-adminsdk.json
5. Paste [this](https://tum-ai-internal.slack.com/archives/C02787QJ95W/p1698583880296439) into /api/.secrets/tumai-space-firebase-adminsdk.json - Add Firebase Admin SDK Certificate (for staging env): Dev environment will use authentication of Staging Firebase project 

### Running it

**Backend**

```bash
make run  # in root dir (launch api in docker container)
```

or (recommended):

```bash
uvicorn space_api.main:app --host 0.0.0.0 --reload --port 8000
```

**Frontend** in `app/`

```bash
npm run dev
```

**Using the precommit hook**

to trigger this manually:

```bash
pre-commit run --all
```

trigger this on every commit:

```bash
pre-commit install
```

**Deploying to Firebase (hosting) manually / using Firebase local emulators:**

Consider checking out the commands listed in /app/Makefile.

> Please only use them if you know what you are doing!

### Working on a Linear ticket

Working with Linear tickets is very similar to working with GitHub issues.
It works as follows:

1. Start by clicking on the chosen ticket
2. Click on the branch icon in the top left corner to copy the branch name. This is important that Linear can properly track ticket status and progress
3. Now locate the space repository and create a new branch

```bash
git switch -c <branch-name>
```

4. Now push the branch and changes at first with

```bash
git push --set-upstream origin <branch-name>
```

### Technical Stack

In the beginning of the project the team formed and chose a technical stack. This will not be changed and is a final decision.

**Backend**:

- Service Logic: `Python` using [`FastAPI`](https://github.com/tiangolo/fastapi) framework (apiDocs via `Pydantic` models)
- Database: `PostgreSQL` on Azure through `SQLAlchemy 2.0`

**Frontend**:

- [`NextJS`](https://nextjs.org/) framework for the website
- [`MobX`](https://mobx.js.org) for state management
- Firebase Auth for authentication

**Deployment**:

- Backend and DB on Azure, will move to Google Cloud
- Firebase Authentication for managing authentication, authorization and roles
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration of the backend and DB

## Documentation

To view an ERD of the system, paste `api/docs/erDiagram` file into a mermaid-style viewer like [this](https://mermaid.live/).
Alternatively, checkout the [/api/README.md](https://github.com/tum-ai/space/tree/main/api) on GitHub.

Documentation on the [frontend](https://www.notion.so/tum-ai/Frontend-Development-Guide-Documentation-259fdf1c5c1446d29fee4f16a39d4c0c?pvs=4) and [backend](https://www.notion.so/tum-ai/Backend-Development-Guide-Documentation-4c408603fb65439d94293c5189435770?pvs=4) as well as instructions on how to add services, pages etc. can be seen on the linked Notion pages.

### FAQ

A FAQ section with common errors and how to solve them can be found on [this](https://www.notion.so/tum-ai/Space-10953cc88e334d61a1fb37744bc72291?pvs=4) Notion page, documenting the project.

**DevOps**:

- Deployed on Azure
- [`Firebase`](https://firebase.com/) for managing authentication
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration

**2. Staging**

- Deployed version of the staging branch
  - Frontend deployed to Firebase staging project ("tumai-space-staging")
  - Backend deployed to Azure Staging
  - Uses an Azure Staging DB
- CI Action is triggered on PR creation into main

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
