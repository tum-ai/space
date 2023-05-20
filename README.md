# TUM.ai space 🚀
TUM.ai space is a system that tackles and solves three main issues:
  1. Increasing observability of members and projects both internally and externally by providing a way to show ones efforts and achievements at TUM.ai 
  2. Increasing clarity, visibility and linking of internal information that is otherwise hard to find (ie a slack message) as a single source of truth
  3. Combine existing systems like application systems into a more managable and extensible format

## Organization & team
Project planning is done over [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are placed there, the GitHub issues in this repository are outdated and will slowly be removed.

See [here](#working-on-a-linear-ticket) for how to work and develop on a Linear ticket.

## Development

### Prerequisites
Make sure to have the following installed before running ```make```:
- Linux build/dev tools, mainly for make
- Python 3.10, consider using [pyenv](https://github.com/pyenv/pyenv), see [here](https://github.com/pyenv/pyenv#automatic-installer) for installation
- Brew, see [here](https://brew.sh) for installation
- Docker with the Compose plugin, see [here](https://docs.docker.com/get-docker/) for installation

### Running the project
Note: this setup guide currently only works on Linux systems as-is. 

# TODO: rewrite acc. to /Makefile /api/Makefile /app/Makefile (try out first)

1. Initial setup
  - Create `/api/.env`
    ```
    environment=development
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=space-db
    DB_USER=space-db
    DB_PASSWORD=space-db
    ```

  - Add Firebase Admin SDK Certificate (for staging env): Dev environment will use authentication of Staging Firebase project [Secrets file on Notion](https://www.notion.so/tum-ai/c893a21fc7034d3aa44f40d28fd71373?v=65bb26a99f124632ac28a8eabe3bf066)
    ```bash
    # store as /api/.secrets/tumai-space-firebase-adminsdk.json
    ```

2. Start backend
  Run the following from the root of the project
    ```bash
    make run

    # outside of docker:
    uvicorn main:app --host 0.0.0.0 --reload --port 8000

    # with production wdgi server
    cd api/ && ./startup.sh
    ```
3. Start frontend
  Run the following from the root of the project
    ```bash
    # ensure your backend / db is running
    cd app && npm run start
    ```
4. To start the auth web app (you might need to install next.js first):
    ```bash
    # optional (advanced) ----------------------------------------------------
    # running node outside of docker:
    cd auth-web-app
    # maybe necessary: npm i next
    npm run dev
    # ------------------------------------------------------------------------
    ```
  
To verify the installation and setup try out the following: 
- Visit http://auth.tum-ai-dev.com:15950/, you should be redirected to the login page.
- Visit http://api.tum-ai-dev.com:15950/auth/dashboard to see all the registered users.
- Visit http://api.tum-ai-dev.com:15950/docs to see the dashboard of the available routes.

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
  - Service Logic:

    - Python using [`FastAPI`](https://github.com/tiangolo/fastapi) framework
  - Database:
    - [`MongoDB`](https://www.mongodb.com/) for all the services but analytics
    - (coming up) [`InfluxDB`](https://www.influxdata.com/) for analytics service

**Frontend**:
- [`NextJS`](https://nextjs.org/) framework for the website
-  [`MobX`](https://mobx.js.org) for state management

**DevOps**:
- Deployed on Azure
- (currently, will be replaced by Azure service) [`Traefik`](https://traefik.io/) as a reverse proxy 
- [`Firebase`](https://firebase.com/) for managing authentication
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration

# CI / CD Draft
## Environments
1) DEV:
- No automated CI Action
- Dev can start up:
  - Frontend: via npm or firebase emulator
  - Backend: via uvicorn or docker compose
  - DB: use dockerized postgres, 
- Precommit hook: Linting
2) Test:
- linting & unit tests on every pushed commit of all branches
- Backend: no deployment, just Github Action tests
- DB: azure dev db
3) Staging
- deployed version of staging branch
  - Frontend: to firebase staging
  - Backend: deployed to Azure staging (env environment=staging)
  - DB: azure staging db
- CI Action triggered on:
    - PR request creation into main

4) Production:
- deployed version of main branch
  - Frontend: to firebase prod
  - Backend: deployed to Azure prod (env environment=production)
  - DB: azure prod db
- CI Action triggered on push commit to main (=merge PR)
