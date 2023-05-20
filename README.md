# TUM.ai space 🚀
TUM.ai space is a system that tackles and solves three main issues:
  1. Increasing observability of members and projects both internally and externally by providing a way to show ones efforts and achievements at TUM.ai 
  2. Increasing clarity, visibility and linking of internal information that is otherwise hard to find (ie a slack message) as a single source of truth
  3. Combine existing systems like application systems into a more managable and extensible format

## Organization
Project planning is done over [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are placed there, the GitHub issues in this repository are outdated and will slowly be removed.

See [here](#working-on-a-linear-ticket) for how to work and develop on a Linear ticket.

## Repo Structure
| Directory | Explanation |
|---|---|
| .fileserver/certification/ | Resources needed for generating a certificate |
| .github/workflows/  |   |
| api/ | Backend, services |
| app/ | New Firebase Frontend |
| web-app/  | Previous Frontend, authentication will be migrated over to ap/ |

## Development

### Prerequisites
Make sure to have the following installed before running ```make```:
- Linux build/dev tools, mainly for make
- Python 3.10, consider using [pyenv](https://github.com/pyenv/pyenv), see [here](https://github.com/pyenv/pyenv#automatic-installer) for installation
- Brew, see [here](https://brew.sh) for installation
- Docker with the Compose plugin, see [here](https://docs.docker.com/get-docker/) for installation

### Running it
**Backend**
```TODO```
**Frontend**
```npm run dev```

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
  - Service Logic: Python using [`FastAPI`](https://github.com/tiangolo/fastapi) framework
  - Database: SQL on Azure

**Frontend**:
- [`NextJS`](https://nextjs.org/) framework for the website
-  [`MobX`](https://mobx.js.org) for state management

**DevOps**:
- Backend deployed on Azure
- Firebase Authentication for managing authentication, authorization and roles
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration (only backend & db)

## Documentation
To view an ERD of the system, copy the ```api/docs/erDiagram``` file, remove all the comments starting with ```//``` and paste it into a mermaid-style viewer like [this](https://mermaid.live/).

Documentation on the [frontend](https://www.notion.so/tum-ai/Frontend-Development-Guide-Documentation-259fdf1c5c1446d29fee4f16a39d4c0c?pvs=4) and [backend](https://www.notion.so/tum-ai/Backend-Development-Guide-Documentation-4c408603fb65439d94293c5189435770?pvs=4) as well as instructions on how to add services, pages etc. can be seen on the linked Notion pages.

# CI / CD Draft
## Environments
1) DEV:
- No automated CI Action
- Dev can start up:
  - Frontend: via npm or firebase emulator
  - Backend: via uvicorn or docker (TODO: deprecate docker)
  - DB: use dockerized postgres, 
- Precommit hook: Linting
2) Test:
- linting & unit tests on every pushed commit of all branches
- Backend: no deployment, just Github Action tests
- DB: azure dev db
3) Staging
- deployed version of staging branch
  - Frontend: to firebase staging
  - Backend: deployed to Azure staging (environment=staging)
  - DB: azure staging db
- CI Action triggered on:
  TODO: decide:
    - PR request creation into main
    - push commit to staging branch
4) Production:
- deployed version of main branch
  - Frontend: Firebase Production
  - Backend: Azure Production (environment=production)
  - DB: Azure Production DB
- CI Action triggered on push commit to main
