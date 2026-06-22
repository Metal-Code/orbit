# Orbit — Team Project Timeline & AI Knowledge Base

> The complete story of how **your** product is being built.
>
> Orbit is a collaborative product-timeline platform. Teams capture every decision,
> milestone, commit, and discussion in a single chronological feed, then ask an
> AI assistant questions about the entire history of the project — scoped to their
> workspace, with no cross-project leakage.

Live → [orbit-murex-one.vercel.app](https://orbit-murex-one.vercel.app)  
Backend → [orbit-mef4.onrender.com](https://orbit-mef4.onrender.com)  
GitHub → [github.com/Metal-Code/orbit](https://github.com/Metal-Code/orbit)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Backend](#backend)
8. [RAG & AI Pipeline](#rag--ai-pipeline)
9. [Frontend](#frontend)
10. [API Reference](#api-reference)
11. [Authentication Flow](#authentication-flow)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Overview

Orbit is organized around three concepts:

| Concept | Description |
|---|---|
| **Organization** | A company or team. Created by an owner who shares an invite code with teammates. |
| **Project** | A product or software initiative inside an org. Has its own timeline and AI assistant. |
| **Timeline Entry** | A single event — a dev commit, a business milestone, a design decision, a meeting note — logged with title, description, type, links, and file attachments. |

Any member of a project can log entries. Non-technical stakeholders (founders, PMs, clients) can log business events alongside developers. The AI assistant then lets anyone ask natural-language questions over the full history of that project.

---

## Architecture

```
Browser (React)
      │
      ▼
Frontend (Vercel)          ──────────────────────────────────────┐
      │                                                           │
      │  REST API (JWT)                                           │
      ▼                                                           │
Backend (FastAPI on Render)                                       │
      │                                                           │
      ├── SQLite (via SQLAlchemy)   ← persistent data            │
      ├── AWS S3                    ← file attachments            │
      ├── Redis (Upstash)           ← 3-day chat history         │
      ├── ChromaDB                  ← vector embeddings          │
      └── Mistral AI API            ← embeddings + LLM           │
                                                                  │
Gmail SMTP ←────────────────────────────────── OTP emails ───────┘
```

---

## Tech Stack

### Backend
| Layer | Choice |
|---|---|
| Framework | **FastAPI** |
| ORM | **SQLAlchemy** + **Alembic** |
| Database | **SQLite** (dev) → **PostgreSQL** (prod-ready) |
| Auth | **JWT** via `python-jose` + **bcrypt** passwords |
| File Storage | **AWS S3** (presigned URL direct uploads) |
| Vector Store | **ChromaDB** (persistent local) |
| Embeddings | **Mistral AI** (`mistral-embed`) |
| LLM | **Mistral AI** (`mistral-small-latest`) |
| Chat History | **Redis** (Upstash, 3-day TTL) |
| Email | **Gmail SMTP** via `smtplib` |
| Server | **Uvicorn** |

### Frontend
| Layer | Choice |
|---|---|
| Framework | **TanStack Start v1** (React 19, SSR) |
| Build | **Vite 7** |
| Routing | **TanStack Router** (file-based, type-safe) |
| Data Fetching | **TanStack Query v5** + **Axios** |
| Forms | `react-hook-form` + `zod` |
| Styling | **Tailwind CSS v4** + **shadcn/ui** + **Radix UI** |
| Icons | `lucide-react` |
| Language | **TypeScript 5** (strict) |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **AWS S3** | File attachment storage |
| **Upstash Redis** | Chat history (serverless Redis) |
| **GitHub Actions** | CI/CD pipeline |

---

## Repository Structure

```
orbit/
├── backend/                        ← FastAPI backend
│   ├── main.py                     ← App entry point, router registration, CORS
│   │
│   ├── core/
│   │   ├── config.py               ← All env variables
│   │   ├── database.py             ← SQLAlchemy engine + get_db()
│   │   └── security.py             ← bcrypt hashing + JWT creation/verification
│   │
│   ├── models/                     ← SQLAlchemy ORM table definitions
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── project.py
│   │   ├── project_member.py
│   │   ├── timeline_entry.py
│   │   ├── link.py
│   │   ├── attachment.py
│   │   └── pending_registration.py ← Temporary OTP verification store
│   │
│   ├── schemas/                    ← Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── project.py
│   │   ├── timeline_entry.py
│   │   ├── link.py
│   │   ├── attachment.py
│   │   └── chat.py
│   │
│   ├── routers/                    ← HTTP route handlers (thin layer)
│   │   ├── auth.py
│   │   ├── organizations.py
│   │   ├── projects.py
│   │   ├── timeline.py
│   │   ├── upload.py               ← S3 presigned URL generation
│   │   ├── chat.py                 ← AI chat endpoint
│   │   ├── chat_history.py         ← Redis chat history endpoints
│   │   └── report.py               ← Bug/feedback report (emails via Gmail)
│   │
│   ├── services/                   ← Business logic layer
│   │   ├── auth_service.py         ← Register, OTP flow, login, JWT
│   │   ├── organization_service.py ← Create org, join via invite code
│   │   ├── project_service.py      ← Create project, membership, invite codes
│   │   ├── timeline_service.py     ← CRUD for entries + triggers RAG embedding
│   │   ├── s3_service.py           ← Presigned URL generation via boto3
│   │   ├── chat_service.py         ← Bridges router to RAG pipeline
│   │   └── chat_history_service.py ← Save/fetch/clear Redis chat history
│   │
│   ├── rag/                        ← Custom RAG pipeline (no LangChain)
│   │   ├── embedder.py             ← Mistral embed API calls
│   │   ├── vector_store.py         ← ChromaDB add/query/delete with project_id filter
│   │   ├── retriever.py            ← Semantic search over project entries
│   │   ├── llm.py                  ← Mistral chat completion with context prompt
│   │   └── pipeline.py             ← Orchestrates retriever → llm → sources
│   │
│   ├── dependencies/
│   │   └── auth.py                 ← get_current_user() FastAPI dependency
│   │
│   ├── chroma_db/                  ← ChromaDB persistent storage (gitignored)
│   ├── devcycle.db                 ← SQLite database file (gitignored)
│   ├── .env                        ← Environment variables (gitignored)
│   ├── requirements.txt
│   └── .python-version             ← Pins Python 3.11
│
├── frontend/                       ← TanStack Start React app
│   ├── src/
│   │   ├── routes/                 ← File-based routes
│   │   ├── components/             ← Feature + UI components
│   │   ├── lib/
│   │   │   ├── api.ts              ← Axios instance + auth interceptor
│   │   │   ├── types.ts            ← Shared TypeScript types
│   │   │   └── utils.ts            ← Helpers
│   │   ├── hooks/
│   │   └── styles.css              ← Tailwind v4 + design tokens
│   ├── .env.local                  ← VITE_API_URL
│   └── package.json
│
└── .github/
    └── workflows/
        └── deploy.yml              ← GitHub Actions CI/CD
```

---

## Getting Started

### Prerequisites

- Python 3.11
- Node.js / Bun ≥ 1.1
- A Mistral AI API key (`console.mistral.ai`)
- An AWS account with an S3 bucket
- An Upstash Redis database (`upstash.com`)
- Gmail account with App Password enabled

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env` (see [Environment Variables](#environment-variables)).

```bash
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend
bun install
bun run dev
```

Frontend runs on `http://localhost:8080`.

---

## Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL=sqlite:///./devcycle.db

# JWT
SECRET_KEY=your_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-south-1

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Gmail SMTP (for OTP emails)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Report email recipient
REPORT_EMAIL=your@gmail.com

# OTP
OTP_EXPIRE_SECONDS=120
```

### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:8000
```

---

## Backend

### Data Model

```
Organization
└── Users (members, one org per user)
└── Projects
    └── ProjectMembers (project-level access)
    └── TimelineEntries
        └── Links
        └── Attachments
```

### Layered Architecture

```
Router → Service → Model
```

- **Routers** handle HTTP only — validate input, call services, return responses
- **Services** hold all business logic
- **Models** define database tables via SQLAlchemy ORM

### Key Design Decisions

**Multi-tenancy** — Every user belongs to one org. Every project belongs to one org. Every timeline entry belongs to one project. All queries are scoped by membership — no cross-org or cross-project data leakage.

**Project-level access** — Being in an org doesn't automatically give access to all projects. Users join specific projects via invite codes. Only org owners can generate project invite codes.

**S3 presigned uploads** — Files never pass through the backend server. The backend generates a presigned URL, the frontend uploads directly to S3, then sends the resulting URL to the backend to store. This keeps the backend stateless with respect to files.

**OTP verification** — New users are not saved to the `users` table until they verify their email. Registration data is held in a `pending_registrations` table with a 2-minute OTP expiry. On verification, the user is moved from pending to users.

---

## RAG & AI Pipeline

### How it works

Every timeline entry is embedded and stored in ChromaDB when it's created. When a user asks a question, the question is embedded, ChromaDB finds the most semantically similar entries filtered by `project_id`, and those entries are passed as context to Mistral's LLM to generate an answer.

```
New timeline entry created
        ↓
Entry text (title + type + description + added_by + date + links + attachments)
gets embedded via Mistral embed API
        ↓
Vector + metadata (project_id, title, links[], attachments[]) stored in ChromaDB

User asks a question
        ↓
Question embedded
        ↓
ChromaDB vector search WHERE project_id = X AND distance < 0.8
        ↓
Top 5 most relevant entries returned
        ↓
LLM prompt: "Given these project entries: [...] Answer: [question]"
        ↓
Response: { answer: "...", sources: [{ title, links, attachments }] }
```

### Project Isolation

ChromaDB queries are always filtered by `project_id`. A user in Project A can never get answers from Project B's data.

### Sources

If the retrieved entries contain links or attachments, they are returned in a structured `sources` array alongside the text answer. The frontend renders these as clickable chips — the LLM's text answer deliberately does not repeat URLs.

### Chat History

Each question-answer pair is saved to Upstash Redis under the key `chat:{project_id}:{user_id}` with a 3-day TTL. When the chat panel opens, the frontend fetches this history and restores the conversation. Messages older than 3 days are automatically deleted by Redis.

### Pipeline Files

| File | Responsibility |
|---|---|
| `rag/embedder.py` | Calls `mistral-embed` to convert text → vector |
| `rag/vector_store.py` | ChromaDB add/query/delete, distance filtering, metadata storage |
| `rag/retriever.py` | Wraps vector_store query with project_id filter |
| `rag/llm.py` | Builds prompt and calls `mistral-small-latest` |
| `rag/pipeline.py` | Orchestrates retriever → llm → sources, filters generic/irrelevant responses |

---

## Frontend

### Routes

| Route | Purpose |
|---|---|
| `/` | Marketing landing |
| `/about` | About page |
| `/report` | Public bug/feedback report form |
| `/register` | Create account (triggers OTP) |
| `/verify-otp` | Enter OTP to complete registration |
| `/login` | Email + password login |
| `/join` | Accept org or project invite via URL code |
| `/dashboard` | List and create projects |
| `/projects/:id/timeline` | Project timeline + AI chat assistant |

### Key Components

| Component | Purpose |
|---|---|
| `TimelineChatbot` | AI chat panel — fetches history on open, sends questions, renders sources as chips |
| `AddEntryModal` | Form to create timeline entry with links and file attachments |
| `EntryDetailPanel` | Slide-out drawer with full entry details, links, attachments |
| `OrgSetupModal` | First-run flow to create or join an org |
| `NewProjectModal` | Create project, shows invite code on success |
| `InviteModal` | Org invite code + copyable join link |
| `ShareProjectModal` | Project invite code + copyable join link |
| `JoinProjectModal` | Redeem a project invite code |

---

## API Reference

All authenticated endpoints require `Authorization: Bearer <token>`.

### Auth
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Initiate registration, sends OTP |
| `POST` | `/auth/verify-otp?email=&otp=` | Verify OTP, creates user |
| `POST` | `/auth/resend-otp?email=` | Resend OTP |
| `POST` | `/auth/login` | Login, returns JWT |
| `GET`  | `/auth/me` | Get current user |

### Organizations
| Method | Path | Description |
|---|---|---|
| `POST` | `/organizations/` | Create org, returns invite_code |
| `GET`  | `/organizations/me` | Get current user's org |
| `GET`  | `/organizations/{id}` | Get org by ID |
| `POST` | `/organizations/join?invite_code=` | Join org |

### Projects
| Method | Path | Description |
|---|---|---|
| `POST` | `/projects/` | Create project, returns invite_code |
| `GET`  | `/projects/` | List user's projects |
| `GET`  | `/projects/{id}` | Get project |
| `POST` | `/projects/join?invite_code=` | Join project |
| `GET`  | `/projects/{id}/invite-code` | Get project invite code (owner only) |
| `DELETE` | `/projects/{id}` | Delete project (owner only) |

### Timeline
| Method | Path | Description |
|---|---|---|
| `POST` | `/projects/{id}/timeline` | Add timeline entry with links + attachments |
| `GET`  | `/projects/{id}/timeline` | Get all entries for project |
| `GET`  | `/projects/{id}/timeline/{entry_id}` | Get single entry |
| `DELETE` | `/projects/{id}/timeline/{entry_id}` | Delete entry |

### Chat
| Method | Path | Description |
|---|---|---|
| `POST` | `/projects/{id}/chat` | Ask AI a question about the project |
| `GET`  | `/projects/{id}/chat/history` | Get last 3 days of chat history |
| `DELETE` | `/projects/{id}/chat/history` | Clear chat history |

### Upload
| Method | Path | Description |
|---|---|---|
| `GET` | `/upload/presigned-url?file_name=&file_type=` | Get S3 presigned URL for direct upload |

### Report
| Method | Path | Description |
|---|---|---|
| `POST` | `/report/` | Submit bug report or feedback (multipart/form-data) |

---

## Authentication Flow

```
Register
  └── POST /auth/register       → saves to pending_registrations, sends OTP via Gmail
  └── POST /auth/verify-otp     → verifies OTP, creates user, clears pending record
  └── POST /auth/resend-otp     → regenerates OTP (2 min expiry)

Login
  └── POST /auth/login          → verifies password, returns JWT
  └── Token stored in localStorage["orbit_token"]
  └── 401 anywhere → clear token, redirect to /login

Join Org
  └── POST /organizations/join?invite_code=XXX

Join Project
  └── POST /projects/join?invite_code=XXX
  └── User must already be in the org
```

---

## Deployment

### Backend (Render)

1. Connect GitHub repo to Render as a Web Service
2. Set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from the [Backend `.env`](#backend-env) section
6. Add `.python-version` file with `3.11.0` to pin Python version

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

### CI/CD (GitHub Actions)

Push to `main` → GitHub Actions runs lint/build checks → auto-deploys to Render (backend) and Vercel (frontend).

### AWS S3 Setup

1. Create bucket (e.g. `orbit-attachments`) in your preferred region
2. Uncheck "Block all public access"
3. Add bucket policy for public read:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```
4. Add CORS configuration allowing your frontend origin with `GET`, `PUT`, `POST` methods
5. Create IAM user with `AmazonS3FullAccess`, generate access keys

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'jose'` | venv not activated. Run `venv\Scripts\activate` first. |
| `table X has no column named Y` | Model changed after DB was created. Run `ALTER TABLE X ADD COLUMN Y` in sqlite3 shell. |
| CORS errors from frontend | Add your frontend origin to `allow_origins` in `main.py` and redeploy backend. |
| S3 upload fails with CORS | Add your frontend URL to S3 bucket CORS config. |
| OTP not received | Gmail App Password not set correctly, or sending to unverified email on Resend. Check `GMAIL_APP_PASSWORD` in env. |
| Chat panel doesn't restore history | `GET /projects/{id}/chat/history` failed — check Redis connection and `UPSTASH_REDIS_REST_URL` env var. |
| ChromaDB returns irrelevant results | Distance threshold too high. Lower `max_distance` in `rag/vector_store.py`. |
| `mistralai` import error | Pin to `mistralai==1.2.5` in requirements.txt. |
| Render deploy fails with Python 3.14 | Add `.python-version` file with `3.11.0` to `backend/` folder. |
| 401 bouncing to login on every request | Token expired or missing. Log in again. Token stored in `localStorage["orbit_token"]`. |

---

## License

Proprietary — © Orbit. All rights reserved.