# TUM.ai space 🚀
...

## Organization & team
Project planning is done over this [Linear project](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All relevant issues and tasks are placed there, the GitHub issues in this repository are outdated and will slowly be removed.

See here how to work and develop on a Linear ticket.

## Development

### Running the project
0. Initial setup:
    ```bash
    make # runs installation (venv etc.)
    ```
    Map tum-ai-dev.com domain to localhost:<br>
    change your host file to map api.tum-ai-dev.com, auth.tum-ai-dev.com, space.tum-ai-dev.com to 127.0.0.1

    checkout https://www.hostinger.com/tutorials/how-to-edit-hosts-file

1. From the root of the project:
    ```bash
    docker-compose up -d
    ```
2. Go to http://localhost:8082/
   1. create a new database with the name `tumai-space` and
   2. inside of `tumai-space` db create two new collections with the names `templates` and `profiles`
   3. later we will automize the setup for all the functional services
3. From the root of the project run:
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

4. Go to http://api.tum-ai-dev.com:15950/docs to see the dashboard of the available routes
   1. You can use the "Try it out" button to test the routes
5. To start the auth web app (you might need to install next.js first):
    ```bash
    # optional (advanced) ----------------------------------------------------
    # running node outside of docker:
    cd auth-web-app
    # maybe necessary: npm i next
    npm run dev
    # ------------------------------------------------------------------------
    ```
6. Try going to http://auth.tum-ai-dev.com:15950/, you will be redirected to the login page
7. Go to http://api.tum-ai-dev.com:15950/auth/dashboard to see all the registered users

### Working on a Linear ticket

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
