# TUM.ai Space 💫

``` markdown
TODO: Rewrite
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

1. From the root of the project:
    ```bash
    docker-compose up -d
    ```
2. Go to http://localhost:8080 to see the dashboard of the running services
3. Go to http://whoami.localhost to see the whoami service
4. Go to http://dev-test-service.localhost to see the dev-test-service

### Technical Stack
- Backend: depends on the service. Recommended:
  - Services:
    - GoLang with [`Gin`](https://github.com/gin-gonic/gin) or
    - Python with [`FastAPI`](https://github.com/tiangolo/fastapi)
  - Database:
    - [`MongoDB`](https://www.mongodb.com/) or
    - [`PostgreSQL`](https://www.postgresql.org/)
- Frontend:
  - [`NextJS`](https://nextjs.org/)
- DevOps:
  - Reverse proxy:
    - [`Traefik`](https://traefik.io/)
  - Authentication and Autherization:
    - [`SuperTokens`](https://supertokens.com/)
  - Containerization and orchestration:
    - [`Docker`](https://www.docker.com/) with [`Docker Compose`](https://docs.docker.com/compose/)
    - But ideally: [`Kubernetes`](https://kubernetes.io/) or [`Docker Swarm`](https://docs.docker.com/engine/swarm/)

