# eVisitenkarte

Digital business card platform with a Vue 3 (Vite) frontend, Node.js/Express backend, PostgreSQL for layouts/elements, and Keycloak for auth. Includes Swagger docs for the API.

## Stack
- Frontend: Vue 3 + Vite, vue-router, keycloak-js, vue3-draggable-resizable
- Backend: Node.js (Express), keycloak-connect, pg-pool, swagger-jsdoc/ui
- Auth: Keycloak
- Data: PostgreSQL
- Tooling: Docker Compose (Keycloak + Postgres), Swagger UI at `/api-docs`

## Prerequisites
- Node.js 20.x (or >=22.12.0) and npm
- Docker + Docker Compose
- Ports (defaults): frontend 5173, backend 3000, Keycloak 8080, Postgres 5432
- Optional: Git, make

## Project Structure
- `frontend/` — Vue 3 app (Vite)
- `backend/` — Express API + Keycloak middleware + Postgres access
- `docker-compose.yml` — Keycloak + Postgres services
- `realm-export.json` — Keycloak realm export
- `backend/docs/` — Swagger source (`/api-docs`)

## Quick Start (all services)
1) Start Keycloak + Postgres:
   ```sh
   cd /path/to/your-project/root
   docker compose up -d
   ```
   Services: `keycloak` (8080), `keycloak-db`, `app-db` (5432 mapped).
IMPORTANT: Until fixed, you have to manually execute/run the query inside of init.sql to create the Database-Schema! Either using pgAdmin or the following command in the project root (LINUX/MAC):
    ```sh
   cat init.sql | docker exec -i my_postgres_db psql -U myuser -d mydatabase
   ```
    

2) Import Keycloak realm (one-time):
   - Open `http://localhost:8080` → log in as admin (`KEYCLOAK_ADMIN`/`KEYCLOAK_ADMIN_PASSWORD`, default `admin`/`admin`).
   - Create realm from `realm-export.json` with realm name `eVisitenkarte-development`.
   - Create a user inside of keycloak following these steps:
     - In the menu left, go to users
     - click on 'Add user' and add the desired attributes
     - after creation, in user details, navigate to role mapping.
     - select 'default-roles-evisitenkarte-development' and click on 'assign role'
     - in the pop-up change the filter to 'Filter by clients' and select the desired role of the user (either admin or user or both)
     - Then navigate to 'credentials' and set a password
     - Then navigate to attributes and set the attributes as followed:
       - The key value in the left column, the desired value in the right (keys have to be exact as follows!)
         - phoneNumber
         - last name
         - first name
         - mobile number
         - street
         - company
         - title 
         - region
         - postal_code
   - Clients expected by code:
     - Backend: `eVisitenkarte-backend` (bearer-only)
     - Frontend: `eVisitenkarte-app` (public client)
     

3) Set valid redirect/web origins for the frontend client (e.g., `http://localhost:5173/*`).

## Backend (Express)
1) Install deps:
   ```sh
   cd /path/to/your-project/root/backend
   npm install
   ```
2) Configure env (Postgres). Defaults in `db-service.js`:
   ```sh
   export PGHOST=localhost
   export PGUSER=myuser
   export PGPASSWORD='mypassword!'
   export PGDATABASE=mydatabase
   export PGPORT=5432
   ```
3) Run backend:
   ```sh
   npm start
   ```
   - API: `http://localhost:3000/api`
   - Swagger: `http://localhost:3000/api-docs`
   - CORS allowed origin: `http://localhost:5173`

4) Keycloak config (backend):
   - Realm: `eVisitenkarte-development`
   - Auth server: `http://localhost:8080/`
   - Client: `eVisitenkarte-backend` (bearer-only)

## Frontend (Vue 3 + Vite)
1) Install deps:
   ```sh
   cd /path/to/your-project/root/frontend
   npm install
   ```
2) Run dev server:
   ```sh
   npm run dev -- --host
   ```
   Default: `http://localhost:5173`.

3) Build + preview:
   ```sh
   npm run build
   npm run preview
   ```

4) Keycloak config (frontend):
   - In `src/services/keycloak-service.js`
   - Defaults: realm `eVisitenkarte-development`, client `eVisitenkarte-app`
   - Update `url` to your Keycloak base (typically `http://localhost:8080/`)

## Database
- Provided via `app-db` (Postgres 15) in `docker-compose.yml`.
- Defaults (override via env):
  - `APP_DB_USER`: `myuser`
  - `APP_DB_PASSWORD`: `mypassword!`
  - `APP_DB_NAME`: `mydatabase`
- Backend uses `PG*` env vars; ensure they match the DB service.

## Auth Flow
- Frontend uses `keycloak-js` to obtain tokens.
- Backend protects routes via `keycloak-connect`; bearer token required.
- Sample protected endpoints:
  - `GET /api/protected`
  - `GET /api/user`
  - Layout management under `/api/layout-management/...`

## API Docs
- Swagger UI: `http://localhost:3000/api-docs`
- Source annotations in `backend/docs/`

## Development Notes
- Session store is in-memory (development only); replace for production.
- CORS limited to `http://localhost:5173`; adjust as needed.
- Ensure valid redirect URIs/web origins are set in Keycloak for the frontend client.

## Common Commands
- Start infra: `docker compose up -d`
- Stop infra: `docker compose down`
- Backend dev: `cd backend && npm start`
- Frontend dev: `cd frontend && npm run dev`
- Import realm: use Keycloak admin console with `realm-export.json`

## Troubleshooting
- Auth 401: verify Keycloak realm/clients; update `KEYCLOAK_CONFIG.url`.
- DB errors: ensure `PG*` env vars match `app-db`.
- CORS issues: update allowed origin in `backend/server.js` or align frontend port.
- Port clashes: adjust host port mapping in `docker-compose.yml` and configs.
- We ran into an issue where pgAdmin (if used) created a local instance on the same default port, which was then running on the local OS in the background. If that is the case you will be unable to connect to the database running inside of Docker. make sure to kill those processes or adapt the default ports.
- Make sure you are connected to the devices wifi.
- In some rare cases, the app-db container was not running after docker compose. Manually start that container.
