# TUM.ai space 🚀

TUM.ai space is a system that tackles and solves three main issues:

1. Increasing observability of members and projects both internally and externally by providing a way to show ones efforts and achievements at TUM.ai
2. Increasing clarity, visibility and linking of internal information that is otherwise hard to find (ie a slack message) as a single source of truth
3. Combine existing systems like application systems into a more managable and extensible format

## Organization

Project planning is done over [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are placed there, the GitHub issues in this repository are not relevant and will not be pursued.

See [here](#working-on-a-linear-ticket) for how to work and develop on a Linear ticket.

## Repo Structure

| Directory                  | Explanation                                   |
| -------------------------- | --------------------------------------------- |
| .fileserver/certification/ | Resources needed for generating a certificate |
| .github/workflows/         |                                               |
| api/                       | Backend, services                             |
| app/                       | Frontend                                      |

## Development

### Prerequisites

Make sure to have the following installed before running `make`:

- Linux build/dev tools, mainly for make
- Python 3.10, consider using [pyenv](https://github.com/pyenv/pyenv), see [here](https://github.com/pyenv/pyenv#automatic-installer) for installation
- Brew, see [here](https://brew.sh) for installation
- Docker with the Compose plugin, see [here](https://docs.docker.com/get-docker/) for installation
- **Signing your commits with GPG** is highly encouraged. It is not enforced though!

Also make sure to have [pre-commit](https://pre-commit.com) installed by running `pre-commit install` once.

Create conda environment for the API:
```
cd api
conda env create -f environment.yml
```

### Running the project

**Initial setup**

- Copy the content from [here](https://www.notion.so/tum-ai/Space-API-env-e491aeb6ca324387bf46fc453412eba7?pvs=4) and put it into `/api/.env`

  On MacOS:

  ```
  open /Applications/Python\ <YOUR PYTHON VERSION>/Install\ Certificate.command
  ```

- Create `/app/.env`
  ```
  NEXT_PUBLIC_ENVIRONMENT=development
  NEXT_PUBLIC_API_URL=http://localhost:8000/
  ```
- Add Firebase Admin SDK Certificate (for staging env): Dev environment will use authentication of Staging Firebase project [Secrets file on Notion](https://www.notion.so/tum-ai/c893a21fc7034d3aa44f40d28fd71373?v=65bb26a99f124632ac28a8eabe3bf066)
  ```bash
  # store as /api/.secrets/tumai-space-firebase-adminsdk.json
  ```

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
