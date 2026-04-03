# Team Task Tracker — Backend

Node.js + Express + TypeScript REST API backed by PostgreSQL via TypeORM.

---

## Tech Stack

- Node.js 20 + Express
- TypeScript + TypeORM
- PostgreSQL 15
- Mocha + Chai + Supertest (tests)
- Docker + Docker Compose (local dev)

---

## Prerequisites

- Node.js >= 18
- Docker + Docker Compose (for local dev with Postgres)
- PostgreSQL (if running without Docker)

---

## Local Development

### With Docker Compose (recommended)

```bash
cp .env.example .env  
docker compose up --build
```

API available at: `http://localhost:3001`

## Environment Variables

| Variable       | Default        | Description                                      |
|----------------|----------------|--------------------------------------------------|
| `DATABASE_URL` | —              | Prod Postgres URL                                |
| `DB_HOST`      | `localhost`    | Postgres host (used when DATABASE_URL is not set)|
| `DB_PORT`      | `5432`         | Postgres port                                    |
| `DB_USERNAME`  | `taskuser`     | Postgres user                                    |
| `DB_PASSWORD`  | `taskpassword` | Postgres password                                |
| `DB_DATABASE`  | `taskdb`       | Database name                                    |
| `PORT`         | `3001`         | Server port                                      |
| `NODE_ENV`     | `development`  | Environment                                      |
| `CORS_ORIGIN`  | `*`            | Allowed CORS origin                              |

---

## Running Tests

Requires a running PostgreSQL instance.

```bash
npm test
```

Tests cover all four endpoints (GET, POST, PUT, DELETE) with 12 test cases.

---

## API Reference

Base URL: `http://localhost:3001`

| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| GET    | /tasks        | Get all tasks        |
| POST   | /tasks        | Create a new task    |
| PUT    | /tasks/:id    | Update task status   |
| DELETE | /tasks/:id    | Delete a task        |

### Task object

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "todo | in-progress | done",
  "created_at": "2026-04-03T10:00:00.000Z"
}
```

---

## Deployment (GCP Cloud Run)

See `.github/workflows/deploy.yml` — pushes the Docker image to GCP Artifact Registry on every push to `main`.

