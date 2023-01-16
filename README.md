# TUM.ai Space 💫

``` markdown
TODOs: 
1. Rewrite this README.md
2. Add a proper logging
```


The "TUM.ai Space" System is a unified system for the management team to observe, edit and generate statistics regarding members activities (projects organisation and participation, participations in signature projects), and availabilities. And manage the current projects, applications and notifications.

From the member point of view, this a way to track, display and have a confirmation from the management team for what you did inside TUM.ai. As well as, observe current projects, apply to them and become a subscriber to relevant notifications.

It essentially consists of multiple subsystems
- Profile Service
- Application Service
- Booking Service
- Projects Service

Development will start with the Profile Parts subsystem.

Profile Service: A replacement for the current Notion-based member database. Essentially just a new way of showing member information and a history/track of their time at TUM.ai

Application Service: A new way of applying for signature & external projects through the Profile System.
Booking Service: Makes booking and applying to projects as well as later getting certification upon successful completion easier, central and unified (needs authentication for that).

Projects Service: Hold information belonging to projects.

These all services are designed to make member journey, recruiting phases and projects applications much easier for responsible people. This system doesn't replace Notion (as a great space for departmental documentation) and Slack (for internal communication) but will provide a unified and centralized way of searching and accessing that information.

## Design
See the subsystem decomposition and other design choices visualized [here on miro](https://miro.com/app/board/uXjVPbuAg8o=/?share_link_id=654531643024).

## Roadmap & Specification
See [here](https://www.notion.so/tum-ai/Specification-Justification-Roadmap-5722022499ba4a6380f6667626af7595).

---

## Development

### Running the project

#### Backend
> checkout Makefile for venv setup
0. Map tum-ai-dev.com domain to localhost
  > 0.1) change your host file to map 
  api.tum-ai-dev.com, auth.tum-ai-dev.com, space.tum-ai-dev.com to localhost or 127.0.0.1

  > Change http://192.168.178.21:3000 to http://127.0.0.1:3000 in /.reverse/.config/config.yml (or your hosts ip)
1. From the root of the project:
    ```bash
    # This will also start the api backend in a container. If you want to develop on it locally outside of docker just comment out the container for the backend and run uvicorn on the same port  (localhost:15900).
    docker-compose up -d
    ```
2. Go to http://localhost:8082/
   1. create a new database with the name `tumai-space` and
   2. inside of `tumai-space` db create a new collection with the name `templates`
   3. later we will automize the setup for all the functional services
3. From the root of the project run:
    ```bash
    # optional: running uvicorn outside of docker:
    uvicorn api.server.app:app --reload --port 15900 --host 0.0.0.0
    # or: 
    make run_api

    # otherwise if running inside docker restart the api container by
    docker-compose down
    docker-compose up -d
    ```

4. Go to http://api.tum-ai-dev.com:15950/docs to see the dashboard of the available routes
   1. You can use the "Try it out" button to test the routes
5. To start the auth web app (you might need to install next.js first):
    ```bash
    # optional: running node outside of docker:
    cd auth-web-app
    # maybe necessary: npm i next
    npm run dev
    ```
6. Try going to http://auth.tum-ai-dev.com:15950/, you will be redirected to the login page
7. Go to http://api.tum-ai-dev.com:15950/auth/dashboard to see all the registered users


### Technical Stack
- Backend: depends on the service. Recommended:
  - Services:

    - Python with [`FastAPI`](https://github.com/tiangolo/fastapi)
  - Database:
    - [`MongoDB`](https://www.mongodb.com/) for all the services but analytics
    - [`InfluxDB`](https://www.influxdata.com/) for analytics service
- Frontend:
  - [`NextJS`](https://nextjs.org/)
- DevOps:
  - Reverse proxy:
    - [`Traefik`](https://traefik.io/)
  - Authentication and Authorization:
    - [`SuperTokens`](https://supertokens.com/)
  - Containerization and orchestration:
    - [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/)
    - But ideally: [`Kubernetes`](https://kubernetes.io/) or [`Docker Swarm`](https://docs.docker.com/engine/swarm/)

