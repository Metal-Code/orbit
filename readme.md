# Orbit — Full-Stack Deep Dive

> The complete story of how **your** product is being built.
>
> Orbit is a collaborative product‑timeline platform. Teams capture every
> decision, milestone, commit, and discussion in a single chronological feed,
> then ask an AI assistant questions about the history of the project.
>
> This README is the **unified reference for the entire system** — the
> **React / TanStack Start frontend** and the **FastAPI backend** that powers
> it.

---

## Table of Contents

### Part I — Project Overview
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Repository Layout](#repository-layout)
4. [End-to-End Request Flow](#end-to-end-request-flow)

### Part II — Frontend (`/` — TanStack Start + React 19)
5. [Frontend Overview](#frontend-overview)
6. [Frontend Tech Stack](#frontend-tech-stack)
7. [Frontend Project Structure](#frontend-project-structure)
8. [Getting Started (Frontend)](#getting-started-frontend)
9. [Frontend Environment Variables](#frontend-environment-variables)
10. [Frontend Scripts](#frontend-scripts)
11. [Routing](#routing)
12. [State, Data & API Layer](#state-data--api-layer)
13. [Authentication Flow (Client)](#authentication-flow-client)
14. [Core Frontend Features](#core-frontend-features)
15. [Styling & Theming](#styling--theming)
16. [Responsive Design](#responsive-design)
17. [Components Reference](#components-reference)

### Part III — Backend (`backend/` — FastAPI)
18. [Backend Overview](#backend-overview)
19. [Backend Tech Stack](#backend-tech-stack)
20. [Backend Project Structure](#backend-project-structure)
21. [Architecture & Design Principles](#architecture--design-principles)
22. [Database Models](#database-models)
23. [Schemas](#schemas)
24. [Services](#services)
25. [Routers & API Endpoints](#routers--api-endpoints)
26. [Authentication & Security (Server)](#authentication--security-server)
27. [OTP Registration Flow](#otp-registration-flow)
28. [Organization & Project Access Control](#organization--project-access-control)
29. [File Uploads via AWS S3](#file-uploads-via-aws-s3)
30. [RAG & AI Pipeline](#rag--ai-pipeline)
31. [Chat History via Redis](#chat-history-via-redis)
32. [Email via Gmail SMTP](#email-via-gmail-smtp)
33. [Bug Report Endpoint](#bug-report-endpoint)
34. [Backend Environment Variables](#backend-environment-variables)
35. [Setup & Running the Backend](#setup--running-the-backend)
36. [Backend Requirements](#backend-requirements)

### Part IV — Operations
37. [Deployment](#deployment)
38. [Troubleshooting](#troubleshooting)
39. [License](#license)

---

# Part I — Project Overview

## System Overview

Orbit has two top-level deliverables that ship as one product:

| Surface | Stack | Responsibility |
|---|---|---|
| **Frontend** | TanStack Start v1 (React 19, SSR) on Vite 7 | Marketing site, auth UX, dashboard, timeline UI, AI chat panel |
| **Backend**  | FastAPI + SQLAlchemy + ChromaDB + Redis | Auth, orgs/projects, timeline storage, S3 uploads, RAG pipeline, chat history |

They communicate over HTTP/JSON. The frontend sends a bearer JWT on every
authenticated request; the backend validates, executes business logic, and
returns JSON.

The product supports:

- Multi-tenant **organizations** and **projects** with role-based access
- **OTP email verification** for new accounts
- A chronological **project timeline** with rich entries, links, and S3 attachments
- A per-project **AI chat assistant** backed by a custom RAG pipeline
  (Mistral embeddings + ChromaDB + Mistral LLM)
- Persistent **3-day chat history** via Redis (Upstash)
- Bug/feedback report submission

## High-Level Architecture

```text
                ┌────────────────────────────────────────┐
                │  Frontend  (TanStack Start, Vite 7)    │
                │  - React 19 + SSR                      │
                │  - Axios client w/ bearer interceptor  │
                │  - TanStack Query                       │
                └──────────────┬─────────────────────────┘
                               │  HTTPS  /  Authorization: Bearer <jwt>
                               ▼
                ┌────────────────────────────────────────┐
                │   Backend  (FastAPI, Uvicorn)          │
                │   Routers → Services → Models          │
                └──┬───────────┬──────────┬──────────┬───┘
                   │           │          │          │
                   ▼           ▼          ▼          ▼
              ┌────────┐  ┌────────┐  ┌────────┐ ┌──────────┐
              │ SQLite │  │  AWS   │  │Chroma  │ │  Redis   │
              │  (ORM) │  │   S3   │  │  DB    │ │ (Upstash)│
              └────────┘  └────────┘  └────────┘ └──────────┘
                                          ▲
                                          │
                                   ┌──────┴───────┐
                                   │  Mistral AI  │
                                   │ embed + LLM  │
                                   └──────────────┘
```

## Repository Layout

```text
.
├── src/                    ← Frontend (TanStack Start)
├── remotion/               ← Remotion video assets for the landing hero
├── backend/                ← FastAPI backend (separate Python project)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md               ← (this file)
```

The frontend lives at the repository root. The backend lives in `backend/`
and is a self-contained Python project with its own virtualenv and
`requirements.txt`.

## End-to-End Request Flow

A typical "ask the AI a question" round trip:

```text
User types in <TimelineChatbot />
        ↓
POST /projects/{id}/chat   (Authorization: Bearer <orbit_token>)
        ↓
FastAPI router → chat_service.get_chat_answer()
        ↓
verify ProjectMember row exists for this user
        ↓
rag/pipeline.py:
  - embed question via Mistral
  - ChromaDB query (where project_id == X, distance < 0.8, top 5)
  - mistral-small-latest generates an answer
  - sources[] assembled from entries with links/attachments
        ↓
chat_history_service.save_message()
  → Redis key chat:{project_id}:{user_id}, TTL 3 days
        ↓
Response: { answer, sources }
        ↓
<TimelineChatbot /> renders answer + clickable source chips
```

---

# Part II — Frontend

## Frontend Overview

The frontend is an **SSR‑capable React 19 application** built on
**TanStack Start** (file‑based routing + server functions on a Vite 7 build).
It talks to the backend over HTTP (default `http://localhost:8000`) using a
small Axios client with a bearer‑token interceptor.

The app is organized into three surfaces:

| Surface | Purpose | Routes |
|---|---|---|
| **Marketing**   | Public landing, about, and report pages | `/`, `/about`, `/report` |
| **Auth**        | Register, login, OTP verification, invite‑link join | `/register`, `/login`, `/verify-otp`, `/join` |
| **Application** | Dashboard, per‑project timeline, AI chat assistant | `/dashboard`, `/projects/$id/timeline` |

## Frontend Tech Stack

| Layer | Choice |
|---|---|
| Framework | **TanStack Start v1** (React 19, SSR + server functions) |
| Build / Dev server | **Vite 7** with `@tanstack/router-plugin` |
| Routing | **TanStack Router** (file‑based, type‑safe) |
| Data fetching | **TanStack Query v5** + **Axios** |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) + plain CSS in `src/styles.css` |
| UI primitives | **shadcn/ui** built on **Radix UI** |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Toasts | `sonner` |
| Animations | `tw-animate-css` + custom CSS keyframes |
| Date utilities | `date-fns` |
| Video assets | **Remotion** (landing hero loop) |
| Lint / Format | ESLint 9 (flat config), Prettier 3 |
| Language | TypeScript 5 (strict) |

## Frontend Project Structure

```text
.
├── src/
│   ├── routes/                      # File-based routes (TanStack Router)
│   │   ├── __root.tsx               # Root layout (html/head/body shell)
│   │   ├── index.tsx                # /                  — landing
│   │   ├── about.tsx                # /about
│   │   ├── report.tsx               # /report
│   │   ├── login.tsx                # /login
│   │   ├── register.tsx             # /register
│   │   ├── verify-otp.tsx           # /verify-otp
│   │   ├── join.tsx                 # /join              — accept invite code
│   │   ├── dashboard.tsx            # /dashboard         — orgs + projects
│   │   └── projects.$id.timeline.tsx# /projects/:id/timeline
│   │
│   ├── components/                  # Feature + presentation components
│   │   ├── MarketingNav.tsx         # Public header w/ mobile drawer
│   │   ├── Navbar.tsx               # Authenticated app header
│   │   ├── HeroTimeline.tsx         # Landing-page animated timeline
│   │   ├── TimelineChatbot.tsx      # AI chat panel (history + new msgs)
│   │   ├── EntryDetailPanel.tsx     # Right-side detail drawer for an entry
│   │   ├── AddEntryModal.tsx        # Create timeline entry
│   │   ├── NewProjectModal.tsx      # Create project (+ invite code)
│   │   ├── OrgSetupModal.tsx        # First-run org create/join
│   │   ├── InviteModal.tsx          # Org invite code + link
│   │   ├── ShareProjectModal.tsx    # Project invite code + link
│   │   ├── JoinProjectModal.tsx     # Redeem a project invite code
│   │   ├── TypeBadge.tsx            # Colored badge per entry type
│   │   ├── OrbitLogo.tsx            # Brand mark
│   │   ├── icons/                   # Custom SVG icons
│   │   └── ui/                      # shadcn/ui primitives
│   │
│   ├── lib/
│   │   ├── api.ts                   # Axios instance + auth interceptors
│   │   ├── utils.ts                 # cn() classnames helper
│   │   ├── types.ts                 # Shared TypeScript types
│   │   └── ...                      # Error capture, config helpers
│   │
│   ├── hooks/                       # Reusable hooks (e.g. use-mobile)
│   ├── styles.css                   # Tailwind v4 entry + design tokens
│   ├── router.tsx                   # Router + QueryClient wiring
│   ├── server.ts                    # SSR entry
│   ├── start.ts                     # Server-fn middleware registration
│   └── routeTree.gen.ts             # AUTO-GENERATED — do not edit
│
├── remotion/                        # Remotion video assets (landing hero)
├── vite.config.ts
├── tsconfig.json
├── components.json                  # shadcn/ui config
├── eslint.config.js
└── package.json
```

## Getting Started (Frontend)

### Prerequisites

- **Bun** ≥ 1.1 (or `npm` / `pnpm` — the lockfile is Bun's `bun.lock`)
- A running instance of the **Orbit backend** (see [Setup & Running the Backend](#setup--running-the-backend)) reachable on `http://localhost:8000` (or whatever you set `VITE_API_URL` to)

### Install & run

```bash
bun install
bun run dev
```

The app starts on **http://localhost:8080** by default.

## Frontend Environment Variables

Public client variables must be prefixed with `VITE_`.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | no | `http://localhost:8000` | Base URL of the Orbit backend |

Create a `.env.local` at the project root:

```bash
VITE_API_URL=https://api.your-orbit.example.com
```

> Server‑only secrets (read inside server functions) use `process.env.*` and
> must NOT be prefixed with `VITE_`. None are required by the current frontend.

## Frontend Scripts

| Command | What it does |
|---|---|
| `bun run dev`        | Start the dev server (HMR, SSR) on port 8080 |
| `bun run build`      | Production build |
| `bun run build:dev`  | Build in development mode (useful for previews) |
| `bun run preview`    | Preview the built app |
| `bun run lint`       | Run ESLint over the project |
| `bun run format`     | Format with Prettier |

## Routing

The app uses **TanStack Router's file‑based routing**. The route tree is
**auto‑generated** into `src/routeTree.gen.ts` — never edit it by hand.

| File | URL | Notes |
|---|---|---|
| `routes/__root.tsx` | — | HTML shell, providers, error / 404 boundaries |
| `routes/index.tsx`  | `/` | Marketing landing w/ `<HeroTimeline />` |
| `routes/about.tsx`  | `/about` | About page |
| `routes/report.tsx` | `/report` | Public report page |
| `routes/login.tsx`  | `/login` | Email + password |
| `routes/register.tsx` | `/register` | Sends OTP |
| `routes/verify-otp.tsx` | `/verify-otp` | OTP confirmation |
| `routes/join.tsx`   | `/join` | Accept org/project invite code |
| `routes/dashboard.tsx` | `/dashboard` | List + create orgs / projects |
| `routes/projects.$id.timeline.tsx` | `/projects/:id/timeline` | Per‑project timeline + chat |

Navigation **must** use `<Link to="...">` from `@tanstack/react-router`, not
plain `<a href>` (preserves preload + type safety).

## State, Data & API Layer

### Axios client — `src/lib/api.ts`

A single shared Axios instance is exported as `api`:

- **Base URL** from `VITE_API_URL` (fallback `http://localhost:8000`).
- **Request interceptor** attaches `Authorization: Bearer <token>` from
  `localStorage["orbit_token"]` to every request, **except** for the public
  auth endpoints (`/auth/register`, `/auth/login`, `/auth/verify-otp`,
  `/auth/resend-otp`, `/auth/forgot-password`, `/auth/reset-password`).
- **Response interceptor** catches `401` responses, clears the token, and
  redirects the browser to `/login` (unless the failure came from a public
  auth path).

```ts
import { api, TOKEN_KEY } from "@/lib/api";

const { data } = await api.get(`/projects/${id}/timeline`);
```

### TanStack Query

A `QueryClient` is created in `src/router.tsx` and provided through the
router context, so loaders can call `ensureQueryData(...)` and components
can read with `useSuspenseQuery(...)`. For simple modal flows the
components call `api` directly with local `useState`.

## Authentication Flow (Client)

```text
/register  ──►  POST /auth/register      ──►  /verify-otp
                                              POST /auth/verify-otp
                                              POST /auth/resend-otp
/login     ──►  POST /auth/login         ──►  stores orbit_token in localStorage
                                              ──►  /dashboard
/join?code=...  ──►  POST /organizations/join or /projects/{id}/join
```

- The bearer token is stored client‑side under `localStorage["orbit_token"]`
  (key exported as `TOKEN_KEY`).
- A `401` response anywhere in the app clears the token and bounces the user
  back to `/login`.
- Theme preference is persisted under `localStorage["orbit.theme"]` and
  applied as `data-theme` on `<html>` for CSS variable theming.

## Core Frontend Features

### 1. Marketing Landing (`/`)

- Split layout: pitch copy on the left, looping **Remotion**‑rendered hero
  video on the right (see `remotion/`).
- Animated `<HeroTimeline />` component below the fold.
- Theme toggle (dark / light) wired to `data-theme`.
- Fully responsive header with a hamburger drawer (`MarketingNav`).

### 2. Dashboard (`/dashboard`)

- Lists the user's organizations and projects.
- **First run**: shows `<OrgSetupModal />` to create or join an org.
- Create new projects via `<NewProjectModal />` (returns an invite code).
- Invite teammates via `<InviteModal />` / `<ShareProjectModal />`.

### 3. Project Timeline (`/projects/:id/timeline`)

- Vertical chronological feed of all entries for the project.
- **Type badges** — colored chips per entry type (`TypeBadge`).
- **Add entry** via `<AddEntryModal />` — supports links and S3 attachments.
- Click an entry to open `<EntryDetailPanel />` on the right.
- **AI Chat Assistant** (`<TimelineChatbot />`):
  - On open / page load, fetches `GET /projects/{id}/chat/history` and
    hydrates the conversation as alternating user/assistant pairs.
  - New questions are sent to `POST /projects/{id}/chat` and rendered
    inline with sources.
  - If the history is empty, falls back to a default greeting.

### 4. Invite & Join

- Org admins generate invite codes from `<InviteModal />`.
- Project owners share project invite links (`/join?code=...`).
- `/join` route redeems the code and adds the user to the org/project.

### 5. File uploads (S3 presigned URLs)

The frontend never sends files through the backend. Instead it:

1. Requests `GET /upload/presigned-url?file_name=...&file_type=...`.
2. PUTs the file **directly to S3** using the returned presigned URL.
3. Includes the final public `file_url` in the timeline-entry submission.

This keeps the backend stateless and avoids streaming large files through it.

## Styling & Theming

- **Tailwind CSS v4** is configured through `@tailwindcss/vite` and the
  CSS entry `src/styles.css` — there is no legacy `tailwind.config.js`.
- Design tokens are declared as CSS custom properties (`--bg`, `--text`,
  `--border`, …) on `:root` and overridden under
  `[data-theme="light"]` / `[data-theme="dark"]`.
- **shadcn/ui** components live in `src/components/ui/`. Add new primitives
  with the standard shadcn CLI; `components.json` already wires the paths.
- Always reference semantic tokens (`text-foreground`, `bg-background`,
  `var(--text)`) — do **not** hardcode `text-white`, `bg-black`, or hex
  values in components, or dark mode will break.

## Responsive Design

The site is mobile‑first and tested on phone, tablet, and desktop:

- **`MarketingNav`** collapses into a hamburger drawer below ~960px.
- **`Navbar`** (authenticated) reflows for narrow viewports.
- The landing split layout stacks vertically on mobile.
- Timeline cards, modals, and the chat panel use fluid widths + safe-area
  insets.
- CSS media queries live in `src/styles.css` (`@media (max-width: 960px)`,
  `@media (max-width: 640px)`).

## Components Reference

| Component | Purpose |
|---|---|
| `MarketingNav` | Public header with theme toggle + mobile drawer |
| `Navbar` | App header for authenticated pages |
| `OrbitLogo` | Brand mark (SVG) |
| `HeroTimeline` | Animated landing-page timeline preview |
| `TypeBadge` | Colored badge per entry type |
| `AddEntryModal` | Create a new timeline entry |
| `EntryDetailPanel` | Slide-out details for a selected entry |
| `TimelineChatbot` | AI chat: hydrates history, sends new questions |
| `NewProjectModal` | Create a project; surfaces the invite code |
| `OrgSetupModal` | First-run create-or-join organization flow |
| `InviteModal` | Show org invite code + copyable join link |
| `ShareProjectModal` | Show project invite code + copyable join link |
| `JoinProjectModal` | Redeem a project invite code |
| `ui/*` | shadcn/Radix primitives (button, dialog, input, …) |

---

# Part III — Backend

## Backend Overview

The Orbit backend is a **FastAPI** REST API that powers a multi-tenant team
project timeline platform. It handles:

- Multi-tenant organization and project management with role-based access
- OTP-based email verification for new user registration
- JWT authentication for all protected endpoints
- Timeline entry management with links and file attachments
- Direct-to-S3 file uploads via presigned URLs
- A custom RAG (Retrieval-Augmented Generation) pipeline using Mistral AI and ChromaDB
- Per-project AI chat assistant with 3-day Redis-backed history
- Email delivery via Gmail SMTP
- Bug/feedback report submission

## Backend Tech Stack

| Concern | Technology |
|---|---|
| Framework | **FastAPI** |
| Server | **Uvicorn** (ASGI) |
| ORM | **SQLAlchemy** 2.x |
| Database | **SQLite** (development) |
| Auth | **JWT** via `python-jose`, passwords via `bcrypt` + `passlib` |
| File Storage | **AWS S3** via `boto3` |
| Vector Store | **ChromaDB** (persistent local) |
| Embeddings | **Mistral AI** (`mistral-embed`) |
| LLM | **Mistral AI** (`mistral-small-latest`) |
| Chat History | **Redis** via Upstash (`upstash-redis`) |
| Email | **Gmail SMTP** via Python `smtplib` |
| Validation | **Pydantic** v2 |
| File Handling | `python-multipart` |

## Backend Project Structure

```text
backend/
│
├── main.py                        ← App entry point
│
├── core/
│   ├── config.py                  ← Env variable loading
│   ├── database.py                ← SQLAlchemy engine + session + get_db()
│   └── security.py                ← Password hashing + JWT
│
├── models/                        ← SQLAlchemy ORM models (DB tables)
│   ├── user.py
│   ├── organization.py
│   ├── project.py
│   ├── project_member.py
│   ├── timeline_entry.py
│   ├── link.py
│   ├── attachment.py
│   └── pending_registration.py
│
├── schemas/                       ← Pydantic request/response models
│   ├── user.py
│   ├── organization.py
│   ├── project.py
│   ├── timeline_entry.py
│   ├── link.py
│   ├── attachment.py
│   └── chat.py
│
├── routers/                       ← HTTP layer (thin, delegates to services)
│   ├── auth.py
│   ├── organizations.py
│   ├── projects.py
│   ├── timeline.py
│   ├── upload.py
│   ├── chat.py
│   ├── chat_history.py
│   └── report.py
│
├── services/                      ← All business logic
│   ├── auth_service.py
│   ├── organization_service.py
│   ├── project_service.py
│   ├── timeline_service.py
│   ├── s3_service.py
│   ├── chat_service.py
│   └── chat_history_service.py
│
├── rag/                           ← Custom RAG pipeline
│   ├── embedder.py
│   ├── vector_store.py
│   ├── retriever.py
│   ├── llm.py
│   └── pipeline.py
│
├── dependencies/
│   └── auth.py                    ← get_current_user() FastAPI dependency
│
├── chroma_db/                     ← ChromaDB persistent data (gitignored)
├── devcycle.db                    ← SQLite database (gitignored)
├── .env                           ← Secrets (gitignored)
├── .python-version                ← Pins Python 3.11 for Render
└── requirements.txt
```

## Architecture & Design Principles

### Layered Architecture

Every request follows this path:

```text
HTTP Request
     ↓
Router         ← validates input, calls service, returns response
     ↓
Service        ← all business logic lives here
     ↓
Model / DB     ← SQLAlchemy ORM queries
     ↓
HTTP Response
```

Routers never contain business logic. Services never handle HTTP concerns.
This separation keeps the codebase clean and testable.

### Dependency Injection

FastAPI's `Depends()` system is used throughout:

```python
# Every protected route injects the current user
@router.get("/me")
def me(current_user = Depends(get_current_user)):
    return current_user

# Every DB operation injects a session
@router.post("/projects/")
def create(db: Session = Depends(get_db), ...):
    ...
```

### Error Handling

Services raise `ValueError` with human-readable messages. Routers catch them
and convert to HTTP exceptions:

```python
try:
    return some_service_call(...)
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
```

## Database Models

### `User`

```text
users
├── id               INTEGER PK
├── full_name        TEXT NOT NULL
├── email            TEXT UNIQUE NOT NULL
├── hashed_password  TEXT NOT NULL
├── role             TEXT DEFAULT 'member'   ← 'owner' or 'member'
├── org_id           INTEGER FK → organizations.id (nullable)
├── is_verified      BOOLEAN DEFAULT True
└── created_at       DATETIME
```

`is_verified` defaults to `True` because users only get inserted into this
table after OTP verification. Unverified registration data lives in
`pending_registrations`.

### `Organization`

```text
organizations
├── id           INTEGER PK
├── name         TEXT UNIQUE NOT NULL
├── description  TEXT
├── invite_code  TEXT UNIQUE NOT NULL    ← 8-char uppercase UUID fragment
├── created_by   INTEGER                ← user id (no FK to avoid circular ref)
└── created_at   DATETIME
```

The invite code is generated at creation time using
`str(uuid.uuid4())[:8].upper()`. It is what users paste to join the org.

### `Project`

```text
projects
├── id           INTEGER PK
├── name         TEXT NOT NULL
├── description  TEXT
├── org_id       INTEGER FK → organizations.id
├── created_by   INTEGER                ← user id (no FK to avoid circular ref)
├── invite_code  TEXT UNIQUE NOT NULL   ← project-level join code
└── created_at   DATETIME
```

Projects have their own invite codes separate from org invite codes. Being
in an org does not automatically give project access.

### `ProjectMember`

```text
project_members
├── id          INTEGER PK
├── project_id  INTEGER FK → projects.id
└── user_id     INTEGER                 ← no FK (avoids circular ref)
```

This is the join table for project membership. A user must have a row here
to access a project's timeline.

### `TimelineEntry`

```text
timeline_entries
├── id              INTEGER PK
├── title           TEXT NOT NULL
├── description     TEXT
├── type            TEXT NOT NULL       ← Dev / Design / Business / Meeting / Milestone
├── project_id      INTEGER FK → projects.id
├── added_by_name   TEXT NOT NULL       ← snapshotted from user at creation time
├── added_by_email  TEXT NOT NULL       ← snapshotted from user at creation time
└── created_at      DATETIME (IST)
```

`added_by_name` and `added_by_email` are snapshotted rather than FK-linked so
the entry remains accurate even if the user later changes their name or is
deleted.

### `Link`

```text
links
├── id                  INTEGER PK
├── url                 TEXT NOT NULL
├── label               TEXT            ← optional display name
└── timeline_entry_id   INTEGER FK → timeline_entries.id
```

One-to-many with `TimelineEntry`. A single entry can have unlimited links.

### `Attachment`

```text
attachments
├── id                  INTEGER PK
├── file_name           TEXT NOT NULL
├── file_url            TEXT NOT NULL   ← S3 public URL
├── file_type           TEXT NOT NULL   ← image / video / document / zip / etc.
├── label               TEXT            ← optional display name
├── timeline_entry_id   INTEGER FK → timeline_entries.id
└── uploaded_at         DATETIME
```

Stores only the S3 URL — the actual file lives in S3.

### `PendingRegistration`

```text
pending_registrations
├── id               INTEGER PK
├── full_name        TEXT NOT NULL
├── email            TEXT UNIQUE NOT NULL
├── hashed_password  TEXT NOT NULL
├── otp              TEXT NOT NULL
└── otp_expires_at   DATETIME NOT NULL
```

Temporary holding table for unverified registrations. On OTP verification,
the row is deleted and a `User` row is created. On re-registration attempts
with the same email, the existing pending record is updated rather than
creating a duplicate.

## Schemas

Pydantic schemas are kept separate from SQLAlchemy models. Each resource has
at minimum:

- `XCreate` — what the client sends in (request body)
- `XResponse` — what the server sends back

All response schemas include `model_config = ConfigDict(from_attributes=True)`
(Pydantic v2) so they can be populated directly from SQLAlchemy model
instances.

### Notable Schema Decisions

**`TimelineEntryCreate`** includes nested `List[LinkCreate]` and
`List[AttachmentCreate]` — entry, links, and attachments are all submitted
in one request body.

**`UserResponse`** never includes `hashed_password` — passwords never leave
the server.

**`ChatResponse`** includes both `answer` (string) and `sources` (structured
list of entries with links and attachments):

```python
class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource] = []

class ChatSource(BaseModel):
    entry_id: int
    title: str
    links: List[SourceLink] = []
    attachments: List[SourceAttachment] = []
```

## Services

### `auth_service.py`

| Function | Description |
|---|---|
| `initiate_registration()` | Checks email not taken, generates OTP, saves to `pending_registrations`, emails OTP |
| `complete_registration()` | Verifies OTP and expiry, creates `User`, deletes pending record |
| `resend_otp()` | Generates new OTP, updates pending record, resends email |
| `login_user()` | Verifies password with bcrypt, returns JWT token |
| `get_user_by_email()` | Simple DB lookup used by auth dependency |

### `organization_service.py`

| Function | Description |
|---|---|
| `create_organization()` | Creates org with random invite code, sets creator as owner |
| `join_organization()` | Validates invite code, links user to org as member |
| `get_organization()` | Returns user's current org |

### `project_service.py`

| Function | Description |
|---|---|
| `create_project()` | Creates project with invite code, auto-adds creator as ProjectMember |
| `get_projects()` | Returns only projects where current user has a ProjectMember row |
| `get_project()` | Returns project if user has membership, else raises error |
| `join_project()` | Validates project invite code, checks same org, adds ProjectMember |
| `delete_project()` | Owner-only, deletes project and all ProjectMember rows |
| `get_project_invite_code()` | Owner-only, returns project's invite code |

### `timeline_service.py`

| Function | Description |
|---|---|
| `create_entry()` | Saves entry, links, attachments; then triggers RAG embedding |
| `get_entries()` | Returns all entries for a project ordered by `created_at ASC` |
| `get_entry()` | Returns single entry with links and attachments |
| `delete_entry()` | Deletes entry from DB and from ChromaDB vector store |

After saving a new entry, `create_entry` builds an `embed_text` string:

```text
Title: ...
Type: ...
Description: ...
Added by: ...
Date: ...
Links: label: url, label: url
Attachments: label (type), label (type)
```

This text (plus structured links/attachments metadata) is stored in ChromaDB.

### `s3_service.py`

| Function | Description |
|---|---|
| `generate_presigned_url()` | Creates a 5-minute presigned PUT URL for direct S3 upload, returns both presigned URL and final public file URL |

### `chat_service.py`

| Function | Description |
|---|---|
| `get_chat_answer()` | Verifies project membership, delegates to RAG pipeline |

### `chat_history_service.py`

| Function | Description |
|---|---|
| `save_message()` | Appends question/answer/sources/timestamp to Redis list, resets 3-day TTL |
| `get_history()` | Fetches and parses chat history from Redis |
| `clear_history()` | Deletes the Redis key for this user+project |

Redis key pattern: `chat:{project_id}:{user_id}`

## Routers & API Endpoints

> The frontend Axios client (`src/lib/api.ts`) targets every one of these
> paths.

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Initiate registration, send OTP |
| POST | `/auth/verify-otp?email=&otp=` | Public | Verify OTP, create user |
| POST | `/auth/resend-otp?email=` | Public | Resend OTP |
| POST | `/auth/login` | Public | Login, return JWT |
| GET | `/auth/me` | Required | Get current user profile |

### Organizations — `/organizations`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/organizations/` | Required | Create org |
| GET | `/organizations/me` | Required | Get current user's org |
| GET | `/organizations/{org_id}` | Required | Get org by ID (must be member) |
| POST | `/organizations/join?invite_code=` | Required | Join org via invite code |

### Projects — `/projects`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/projects/` | Required | Create project |
| GET | `/projects/` | Required | List user's projects |
| GET | `/projects/{id}` | Required | Get project (must be member) |
| POST | `/projects/join?invite_code=` | Required | Join project |
| GET | `/projects/{id}/invite-code` | Required (owner) | Get project invite code |
| DELETE | `/projects/{id}` | Required (owner) | Delete project |

### Timeline — `/projects/{id}/timeline`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/projects/{id}/timeline` | Required | Add entry with links + attachments |
| GET | `/projects/{id}/timeline` | Required | List all entries |
| GET | `/projects/{id}/timeline/{entry_id}` | Required | Get single entry |
| DELETE | `/projects/{id}/timeline/{entry_id}` | Required | Delete entry |

### Upload — `/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/upload/presigned-url?file_name=&file_type=` | Required | Get S3 presigned URL |

### Chat — `/projects/{id}/chat`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/projects/{id}/chat` | Required | Ask AI question, returns answer + sources |
| GET | `/projects/{id}/chat/history` | Required | Fetch last 3 days of chat |
| DELETE | `/projects/{id}/chat/history` | Required | Clear chat history |

**Chat history response shape** (consumed by `<TimelineChatbot />`):

```json
[
  {
    "question": "tell me about the latest entry",
    "answer":   "The latest entry is…",
    "sources":  [ /* ...entry refs... */ ],
    "timestamp": "2026-06-12T10:00:00"
  }
]
```

Each item maps to **two** chat messages: a user message (`question`) and an
assistant message (`answer` + `sources`), rendered in order before any new
user messages.

### Report — `/report`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/report/` | Public | Submit bug/feedback (multipart/form-data) |

## Authentication & Security (Server)

### Password Storage

Passwords are hashed using `bcrypt` via `passlib.context.CryptContext`. Plain
passwords are never stored.

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### JWT Tokens

Tokens are created with `python-jose`:

```python
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

The `sub` claim stores the user's email. On each protected request,
`get_current_user()` decodes the token and fetches the user from the DB.

### Protected Route Pattern

```python
from dependencies.auth import get_current_user

@router.get("/me")
def me(current_user = Depends(get_current_user)):
    return current_user
```

`get_current_user` reads the `Authorization: Bearer <token>` header, verifies
the JWT, and returns the User model instance. A 401 is raised if the token is
missing, invalid, or expired.

## OTP Registration Flow

```text
1. POST /auth/register { full_name, email, password }
         ↓
   Check if email already in users table → 400 if taken
         ↓
   Generate 6-digit OTP
   Calculate expiry = now + 120 seconds
         ↓
   Upsert into pending_registrations
   (if email already pending, update OTP + expiry instead of inserting)
         ↓
   Send OTP email via Gmail SMTP (background thread)
         ↓
   Return { message: "OTP sent to your email" }

2. POST /auth/verify-otp?email=&otp=
         ↓
   Fetch pending_registrations row for email → 400 if not found
   Compare OTP → 400 "Invalid OTP" if mismatch
   Check expiry → 400 "OTP has expired" if past
         ↓
   Create User row with is_verified=True
   Delete pending_registrations row
         ↓
   Return UserResponse

3. POST /auth/resend-otp?email=
         ↓
   Fetch pending_registrations row → 400 if not found
   Generate new OTP, new expiry
   Update pending row
   Resend email (background thread)
         ↓
   Return { message: "OTP resent successfully" }
```

Email sending runs in a background thread so the HTTP response returns
immediately without waiting for SMTP:

```python
def send_otp_email(email, full_name, otp):
    def send():
        # smtplib SMTP_SSL code
        ...
    threading.Thread(target=send).start()
```

## Organization & Project Access Control

### Two-Level Access

```text
Level 1: Organization
  └── User joins org via org invite code
  └── Being in an org alone grants no project access

Level 2: Project
  └── User joins specific project via project invite code
  └── Only after joining can they see timeline, use chat, add entries
```

### Roles

| Role | Can Do |
|---|---|
| `owner` | Create projects, delete projects, share project invite codes, share org invite code |
| `member` | View projects they're in, add timeline entries, use chat |

Role is set at the org level (`user.role`). There are no per-project roles —
all project members have equal access within the project.

### Invite Code Generation

Both org and project invite codes use the same pattern:

```python
invite_code = str(uuid.uuid4())[:8].upper()
# e.g. "A3F9B2C1"
```

## File Uploads via AWS S3

### Why Presigned URLs

Files never pass through the backend server. This keeps the backend
stateless, avoids memory/bandwidth issues, and scales naturally.

### Upload Flow

```text
1. Frontend picks a file
         ↓
2. GET /upload/presigned-url?file_name=timestamp-filename.ext&file_type=image/png
         ↓
3. Backend calls S3:
   s3_client.generate_presigned_url("put_object", Params={...}, ExpiresIn=300)
         ↓
4. Returns:
   { presigned_url: "https://s3.amazonaws.com/...?X-Amz-Signature=...",
     file_url: "https://bucket.s3.region.amazonaws.com/filename" }
         ↓
5. Frontend PUTs file directly to presigned_url
   (no Authorization header — S3 handles auth via query params)
         ↓
6. Frontend includes file_url in the timeline entry form submission
         ↓
7. POST /projects/{id}/timeline includes:
   { ..., attachments: [{ file_name, file_url, file_type, label }] }
         ↓
8. Backend saves file_url to attachments table
```

### File Naming

The frontend prefixes filenames with a Unix timestamp to ensure uniqueness:

```text
1780914830563-Screenshot_2026-06-07.png
```

## RAG & AI Pipeline

### Purpose

Every timeline entry is embedded and stored in a vector database. Users can
ask natural-language questions about a project and the AI answers using only
that project's entries as context.

### Pipeline Overview

```text
Timeline Entry Created
        ↓
embed_text built from: title + type + description + added_by + date + links + attachments
        ↓
mistral-embed API → 1024-dim float vector
        ↓
ChromaDB stores: vector + metadata { project_id, title, links (JSON), attachments (JSON) }

User Sends Question
        ↓
Question embedded via mistral-embed
        ↓
ChromaDB query: WHERE project_id = X AND distance < 0.8, top 5 results
        ↓
Retrieved entries passed as context to mistral-small-latest
        ↓
LLM generates natural language answer
        ↓
Sources (entries with links/attachments) extracted from results
        ↓
Response: { answer: "...", sources: [...] }
```

### File Breakdown

**`rag/embedder.py`** — wraps Mistral's embedding API:

```python
def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(model="mistral-embed", inputs=[text])
    return response.data[0].embedding
```

**`rag/vector_store.py`** — manages ChromaDB operations:

- `add_entry_to_vector_store(entry_id, project_id, text, title, links, attachments)`
- `query_vector_store(question, project_id, top_k=5, max_distance=0.8)`
- `delete_entry_from_vector_store(entry_id)`

Distance filtering (`max_distance=0.8`) prevents irrelevant entries from
appearing when questions are unrelated to project content.

**`rag/retriever.py`** — thin wrapper over `query_vector_store`. Returns list
of dicts with `entry_id`, `text`, `title`, `links`, `attachments`.

**`rag/llm.py`** — builds a constrained prompt and calls Mistral:

```python
prompt = f"""You are an assistant for a software project's timeline. Answer the user's
question based only on the following project timeline entries. Be concise and helpful.
Do NOT include raw URLs or list attachment/link names in your answer text — these will
be displayed separately as clickable elements.

Project Timeline Entries:
{context_text}

Question: {question}

Answer:"""
```

**`rag/pipeline.py`** — orchestrates the full flow:

1. Retrieves relevant entries
2. Generates answer
3. Filters out generic/non-informative responses
4. Builds `sources` array from entries that have links or attachments
5. Returns `{ answer, sources }`

### Project Isolation

ChromaDB `where` filter ensures complete isolation:

```python
results = collection.query(
    query_embeddings=[embedding],
    n_results=top_k,
    where={"project_id": project_id}
)
```

A user in Project A cannot receive answers based on Project B's data.

### Sources

When an entry has links or attachments, they are returned in the structured
`sources` array so the frontend can render them as clickable chips — not as
text in the AI's answer.

## Chat History via Redis

### Why Redis

Chat history is inherently temporary. Redis has native TTL support — keys
auto-expire without any cron jobs or cleanup scripts.

### Storage Pattern

```text
Key:   chat:{project_id}:{user_id}
Value: JSON array of message objects
TTL:   259200 seconds (3 days)
```

Each message object:

```json
{
  "question": "...",
  "answer": "...",
  "sources": [...],
  "timestamp": "2026-06-12T10:00:00"
}
```

### Behavior

- On every chat response, the new message is appended to the Redis list and
  TTL is reset
- On page load, `GET /projects/{id}/chat/history` fetches the full array
- After 3 days of inactivity, Redis auto-deletes the key
- `DELETE /projects/{id}/chat/history` manually clears it

## Email via Gmail SMTP

### Why Gmail SMTP

Resend (the original email provider) requires a verified domain to send to
arbitrary email addresses. Gmail SMTP works immediately with just an App
Password.

### Setup

1. Enable 2-Step Verification on Gmail
2. Create an App Password: Google Account → Security → App Passwords
3. Use the 16-character App Password (not your regular password)

### Implementation

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_otp_email(email, full_name, otp):
    def send():
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your Orbit Verification Code"
        msg["From"] = GMAIL_USER
        msg["To"] = email
        msg.attach(MIMEText(html_content, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, email, msg.as_string())
    threading.Thread(target=send).start()
```

Runs in a background thread so the `/register` endpoint returns immediately.

## Bug Report Endpoint

`POST /report/` accepts `multipart/form-data` (not JSON) with:

```text
description  string   required
full_name    string   optional
email        string   optional
attachments  files    optional, multiple
```

The report is emailed to `REPORT_EMAIL` (your configured email) with
full_name, email, description, and any file attachments. This endpoint is
public — no JWT required.

## Backend Environment Variables

```env
# Database
DATABASE_URL=sqlite:///./devcycle.db

# JWT
SECRET_KEY=long_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OTP
OTP_EXPIRE_SECONDS=120

# AWS S3
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=ap-south-1

# Mistral AI
MISTRAL_API_KEY=your_mistral_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Gmail SMTP
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Reports
REPORT_EMAIL=you@gmail.com
```

## Setup & Running the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with all variables above

# Run development server
uvicorn main:app --reload
```

- API: `http://localhost:8000`
- Interactive Swagger docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Backend Requirements

```text
fastapi
uvicorn
sqlalchemy
pydantic[email]
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
bcrypt==4.0.1
boto3
psycopg2-binary
python-multipart
chromadb
mistralai==1.2.5
upstash-redis
redis
```

---

# Part IV — Operations

## Deployment

### Frontend

The project targets an **Edge runtime** (e.g. Cloudflare Workers) via
TanStack Start. To deploy:

1. Set `VITE_API_URL` in your hosting provider's environment to the public
   URL of the deployed backend.
2. Run `bun run build`.
3. Deploy the build output through your provider's TanStack Start /
   Cloudflare Workers integration.

> When deploying via Lovable, the platform handles the build and edge
> runtime automatically — just click **Publish**.

### Backend (Render)

1. Connect GitHub repo to Render as a **Web Service**
2. Set **Root Directory** to `backend`
3. **Runtime:** Python
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add a `.python-version` file in `backend/` containing `3.11.0` to pin
   Python version (Render defaults to 3.14 which has compatibility issues)
7. Add all backend environment variables in Render's Environment tab
8. Every push to `main` triggers auto-redeploy via GitHub Actions

After deploy, point the frontend's `VITE_API_URL` at the Render URL and add
that frontend origin to the backend's `FRONTEND_URL` (CORS allowlist).

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Blank page, console: *"Failed to resolve import"* | A route or component imports a file that doesn't exist. Create it or remove the import. |
| Every API call 401s and bounces to `/login` | Missing/expired token in `localStorage["orbit_token"]`. Log in again. |
| CORS errors hitting the backend | Backend `FRONTEND_URL` must match your deployed frontend origin and allow the `Authorization` header. |
| `routeTree.gen.ts` shows TypeScript errors | A `createFileRoute("...")` string doesn't match its filename. Fix the string to match the file path. |
| Dark/light styling broken after edit | A component hardcoded `text-white` / `bg-black`. Replace with semantic tokens. |
| Chat panel doesn't restore previous messages | `GET /projects/{id}/chat/history` returned non‑array or failed — check network tab and Redis credentials. |
| OTP email never arrives | `GMAIL_USER` / `GMAIL_APP_PASSWORD` invalid, or Gmail 2FA / App Password not configured. |
| AI answers reference the wrong project | ChromaDB `where={"project_id": …}` filter missing or wrong — verify in `rag/vector_store.py`. |
| S3 PUT fails with 403 | Presigned URL expired (5 min TTL) or bucket CORS doesn't allow PUT from your origin. |
| Render deploy fails on `bcrypt` / native build | Ensure `.python-version` is set to `3.11.0` in `backend/`. |

## License

Proprietary — © Orbit. All rights reserved.
