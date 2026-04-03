# Team Task Tracker

A full-stack Task Management web application built as part of a FullStack Engineer Practical Assessment.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | task-management-fe-eta-sable.vercel.app |
| Backend API | https://task-management-be-263983019933.europe-west2.run.app |

---

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | Vite + React + TypeScript + TanStack Query + Axios  |
| Backend   | Node.js + Express + TypeScript + TypeORM            |
| Database  | PostgreSQL (Neon — managed serverless Postgres)     |
| Tests     | Mocha + Chai + Supertest                            |
| DevOps    | Docker + Docker Compose + GCP Cloud Run + Vercel    |

---

## Project Structure

```
team-task-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml    ← CI/CD: builds backend, pushes to Artifact Registry, deploys to Cloud Run
├── backend/              ← Express REST API (deployed to GCP Cloud Run)
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── config/       ← TypeORM DataSource
│   │   ├── entity/       ← Task entity
│   │   ├── routes/       ← CRUD routes
│   │   └── middleware/   ← Error handler
│   ├── tests/            ← Mocha test suite
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
└── frontend/             ← Vite React SPA (deployed to Vercel)
    ├── src/
    │   ├── api/          ← Axios API layer
    │   ├── components/   
    │   ├── hooks/        ← TanStack Query hooks
    │   └── types/        ← Shared TypeScript types
    └── package.json
```

---

## Features

- Create, view, update status, and delete tasks
- Paginated task list with infinite scroll
- Task statuses: `todo`, `in-progress`, `done`
- Loading and error states throughout

---

## Running Locally

### Prerequisites

- Node.js >= 18
- Docker + Docker Compose

### Backend

```bash
cd backend
cp .env.example .env
docker compose up --build
# API available at http://localhost:3001
```

### Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:3001
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Running Tests

```bash
cd backend
npm test
```

12 test cases covering all four endpoints — `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`.

---

## API Reference

Base URL: `https://task-management-be-263983019933.europe-west2.run.app`

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /tasks        | Get all tasks (paginated: `?page=1&limit=10`) |
| POST   | /tasks        | Create a new task  |
| PUT    | /tasks/:id    | Update task status |
| DELETE | /tasks/:id    | Delete a task      |

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

### Paginated response (GET /tasks)

```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "nextPage": 2
}
```

---

## Deployment

### Backend — GCP Cloud Run

Automated via GitHub Actions on every push to `main` that touches `backend/`:

1. Builds Docker image
2. Pushes to GCP Artifact Registry (`europe-west2`)
3. Deploys new revision to Cloud Run (`task-management-be`)

Required GitHub secrets: `GCP_PROJECT_ID`, `GCP_SA_KEY`

### Frontend — Vercel

Import the repo on [vercel.com](https://vercel.com), set **Root Directory** to `frontend`, add env var `VITE_API_URL` pointing to the Cloud Run URL. Vercel handles the rest automatically on every push to `main`.
