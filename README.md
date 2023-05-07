# TUM.ai space 🚀
TUM.ai space is a system that tackles and solves three main issues:
  1. Increasing observability of members and projects both internally and externally by providing a way to show ones efforts and achievements at TUM.ai 
  2. Increasing clarity, visibility and linking of internal information that is otherwise hard to find (ie a slack message) as a single source of truth
  3. Combine existing systems like application systems into a more managable and extensible format

## Organization & team
Project planning is done over [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are placed there, the GitHub issues in this repository are outdated and will slowly be removed.

See [here](#working-on-a-linear-ticket) for how to work and develop on a Linear ticket.

## Development

### Running the project
Note: this setup guide currently only works on Linux systems as-is. 
1. Initial setup
    ```bash
    make # runs installation (venv etc.)
    ```
    Map tum-ai-dev.com domain to localhost.
    Change your host file to map api.tum-ai-dev.com, auth.tum-ai-dev.com, space.tum-ai-dev.com to 127.0.0.1 (checkout this [guide](https://www.hostinger.com/tutorials/how-to-edit-hosts-file))

2. Start backend
  Run the following from the root of the project
    ```bash
    docker-compose up -d
    ```
3. Start frontend
  Run the following from the root of the project
    ```bash
    # optional (advanced) ----------------------------------------------------
    # running uvicorn outside of docker (you have to change .reverse/.config/config.yml) to use your local ip as upstream server (in 'services' section)

    uvicorn api.server.app:app --reload --port 15900 --host 0.0.0.0
    # or: 
    make run_api
    # ------------------------------------------------------------------------

    # otherwise if running inside docker restart the api container by
    docker-compose down
    docker-compose up -d
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
- [`SuperTokens`](https://supertokens.com/) for managing authentication, authorization and roles
- [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/) for containerization and orchestration
