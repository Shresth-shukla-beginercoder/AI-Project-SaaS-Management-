# ProjectFlow AI — Enterprise AI Project Management SaaS

[![CI Pipeline](https://github.com/projectflow/projectflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/projectflow/projectflow-ai/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-22%20%7C%2024%20LTS-brightgreen.svg)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-12.x-orange.svg)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, high-performance monorepo foundation for an AI-powered project management platform featuring full-stack TypeScript, real-time collaboration, pgvector semantic search, and asynchronous background media processing.

---

## Table of Contents

- [1. Product Vision](#1-product-vision)
- [2. Technology Stack](#2-technology-stack)
- [3. Architecture Overview](#3-architecture-overview)
- [4. Monorepo Structure](#4-monorepo-structure)
- [5. Subsystem Architecture](#5-subsystem-architecture)
  - [Web Frontend (`apps/web`)](#web-frontend-appsweb)
  - [Core REST & WebSocket API (`apps/api`)](#core-rest--websocket-api-appsapi)
  - [Background Worker (`apps/worker`)](#background-worker-appsworker)
  - [Shared Workspace Packages (`packages/*`)](#shared-workspace-packages-packages)
- [6. Persistent Storage Infrastructure](#6-persistent-storage-infrastructure)
  - [PostgreSQL 17 & pgvector](#postgresql-17--pgvector)
  - [Redis 7 & BullMQ](#redis-7--bullmq)
  - [AWS S3 Cloud Storage Preparation](#aws-s3-cloud-storage-preparation)
- [7. Docker & Local Infrastructure Setup](#7-docker--local-infrastructure-setup)
- [8. Vercel Deployment Configuration](#8-vercel-deployment-configuration)
- [9. Environment Variables Configuration](#9-environment-variables-configuration)
- [10. Dependency Installation & Requirements](#10-dependency-installation--requirements)
- [11. Available Monorepo Scripts](#11-available-monorepo-scripts)
- [12. Development Workflow](#12-development-workflow)
- [13. Testing Strategy](#13-testing-strategy)
- [14. Git & Branching Workflow](#14-git--branching-workflow)
- [15. Security Principles & Architecture](#15-security-principles--architecture)
- [16. Future AI Architecture & Roadmap](#16-future-ai-architecture--roadmap)
- [17. Troubleshooting & FAQ](#17-troubleshooting--faq)

---

## 1. Product Vision

Modern software engineering and product teams juggle disconnected tools: Kanban boards for task tracking, video conferencing software for meetings, documentation silos for specs, and chat tools for discussion.

**ProjectFlow AI** unifies these streams into an intelligent single pane of glass:

- **Intelligent Task Decomposition**: Transform natural language project objectives and specs into structured milestones, epics, and subtasks.
- **Meeting Intelligence**: Automatically transcode meeting audio/video, transcribe conversations, identify speakers, and extract actionable follow-up tasks with zero human data entry.
- **Unified Semantic Knowledge Base**: Vectorize all workspace documentation, meeting transcripts, and comments using `pgvector` for instant natural language Q&A and contextual assistance.
- **Real-Time Collaboration**: Sub-second synchronization across Kanban boards, presence indicators, and live activity streams.

> **Note on Implementation Status**: This repository represents the **Phase 0 production infrastructure and scaffolding foundation**. All build systems, Docker orchestration, linters, TypeScript configs, dependencies, and project directory structures are configured. Domain business logic, database tables, and UI components are scheduled for subsequent implementation phases.

---

## 2. Technology Stack

### Frontend Application

| Layer                | Technology       | Version  | Purpose                                        |
| -------------------- | ---------------- | -------- | ---------------------------------------------- |
| UI Framework         | React            | 19.x     | Component runtime                              |
| Language             | TypeScript       | 5.7+     | Strict type safety                             |
| Bundler & Dev Server | Vite             | 6.x      | Fast HMR & optimized production bundling       |
| Routing              | React Router     | 7.x      | Client-side routing with SPA fallback          |
| Styling              | Tailwind CSS     | 3.4+     | Utility-first styling with CSS variables       |
| UI Component Kit     | shadcn/ui ready  | -        | Accessible Radix/Tailwind components           |
| Icons                | Lucide React     | Latest   | Consistent icon set                            |
| Server State         | TanStack Query   | 5.x      | Data fetching, caching, and optimistic updates |
| Client State         | Zustand          | 5.x      | Lightweight global UI state stores             |
| HTTP Client          | Axios            | 1.7+     | REST API communication with interceptors       |
| Form Engine          | React Hook Form  | 7.x      | High-performance uncontrolled form handling    |
| Validation           | Zod              | 3.24+    | TypeScript-first schema declaration            |
| Real-Time Client     | Socket.IO Client | 4.8+     | WebSocket connection to API                    |
| Charts & Data Viz    | Recharts         | 2.15+    | Composable SVG data visualizations             |
| Drag & Drop          | @dnd-kit         | 6.x/10.x | Kanban task boards & list reordering           |

### Backend API

| Layer            | Technology            | Version | Purpose                                           |
| ---------------- | --------------------- | ------- | ------------------------------------------------- |
| Framework        | NestJS                | 11.x    | Modular enterprise Node.js framework              |
| Language         | TypeScript            | 5.7+    | Strict typing & decorator metadata                |
| Architecture     | REST + WebSockets     | -       | Versioned REST API (`/api/v1`) & Socket.IO        |
| ORM              | Drizzle ORM           | 0.39+   | High-performance SQL query builder                |
| Database Driver  | `pg` (node-postgres)  | 8.13+   | Connection pooling & PostgreSQL client            |
| API Docs         | Swagger / OpenAPI     | 11.x    | Automated interactive API documentation           |
| Authentication   | Passport + JWT        | -       | Stateless access tokens + rotating refresh tokens |
| Password Hashing | Argon2                | 0.41+   | Memory-hard password hashing                      |
| Validation       | Class Validator & Zod | -       | Runtime request payload validation                |
| Security         | Helmet & Throttler    | -       | HTTP headers & Redis rate limiting                |

### Database & Storage

| Layer            | Technology    | Details                                            |
| ---------------- | ------------- | -------------------------------------------------- |
| Relational DB    | PostgreSQL 17 | Relational persistence, transactions, and JSONB    |
| Vector Engine    | `pgvector`    | Native vector embeddings & HNSW cosine search      |
| Migration Engine | Drizzle Kit   | Forward SQL migration generation and execution     |
| In-Memory Cache  | Redis 7       | BullMQ job broker, socket adapter, & rate limiting |
| Object Storage   | Amazon AWS S3 | Encrypted object storage with presigned URLs       |

### Background & Media Processing

| Component     | Technology       | Purpose                                              |
| ------------- | ---------------- | ---------------------------------------------------- |
| Queue Manager | BullMQ           | Distributed, robust Redis-backed job queues          |
| Media Engine  | FFmpeg & FFprobe | System binary audio extraction and video transcoding |
| Node Wrapper  | Fluent FFmpeg    | Programmatic media processing pipeline               |

### AI SDK Integrations (Dependencies Ready)

- **Vercel AI SDK**: Unified LLM abstraction layer (`ai`)
- **OpenAI**: `@ai-sdk/openai` (GPT-4o, embeddings)
- **Google GenAI**: `@ai-sdk/google` (Gemini 2.0)
- **Anthropic**: `@ai-sdk/anthropic` (Claude 3.5 Sonnet)

---

## 3. Architecture Overview

```
                                [ Web Browser / SPA ]
                                          |
                              HTTPS / WSS |
                                          v
                              [ Nginx / Cloud Proxy ]
                                          |
                                          v
                     +-----------------------------------------+
                     |         NestJS API (Port 5000)          |
                     |  - REST Controllers  - Socket Gateway   |
                     |  - Auth & RBAC       - DTO Validation   |
                     +----+------------------------------+----+
                          |                              |
           SQL via Drizzle|                              | Push Jobs
                          v                              v
           +-----------------------------+     +-----------------------------+
           |        PostgreSQL 17        |     |           Redis 7           |
           |  - Relational Data Tables   |     |  - BullMQ Streams / Queues  |
           |  - pgvector Embedding Store |     |  - Cache & Rate Limiting    |
           +-----------------------------+     +--------------+--------------+
                                                              |
                                                              | Pull Jobs
                                                              v
                                               +-----------------------------+
                                               |      Background Worker      |
                                               |  - FFmpeg Media Transcode   |
                                               |  - AI Speech Transcription  |
                                               |  - Vector Embedding Worker  |
                                               +--------------+--------------+
                                                              |
                                          +-------------------+-------------------+
                                          |                                       |
                                          v                                       v
                             [ Amazon S3 Object Storage ]            [ AI Providers (OpenAI/Anth) ]
```

---

## 4. Monorepo Structure

```text
AI Project Management SaaS/
│
├── apps/
│   ├── web/                     # React 19 + Vite frontend
│   │   ├── public/              # Static assets & favicon.svg
│   │   ├── src/
│   │   │   ├── app/             # Layouts, context providers, routes
│   │   │   ├── components/      # UI components (ui, forms, boards, charts)
│   │   │   ├── features/        # Domain features (auth, tasks, meetings, etc.)
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/             # Utility helpers (cn, formatting)
│   │   │   ├── services/        # API service clients
│   │   │   ├── stores/          # Zustand client stores
│   │   │   ├── styles/          # Tailwind & CSS variable files
│   │   │   └── main.tsx         # Application entry point
│   │   ├── Dockerfile           # Multi-stage production Nginx container
│   │   ├── nginx.conf           # SPA fallback Nginx configuration
│   │   ├── vercel.json          # Vercel deployment & routing rewrites
│   │   └── vite.config.ts       # Vite bundler configuration
│   │
│   ├── api/                     # NestJS 11 REST API
│   │   ├── src/
│   │   │   ├── common/          # Guards, interceptors, filters, pipes, decorators
│   │   │   ├── config/          # Environment configuration
│   │   │   ├── database/        # Drizzle schema definitions & migrations
│   │   │   ├── modules/         # Domain modules (auth, tasks, meetings, ai, etc.)
│   │   │   ├── realtime/        # Socket.IO gateways & events
│   │   │   ├── queues/          # BullMQ queue producers
│   │   │   ├── app.module.ts    # Root application module
│   │   │   └── main.ts          # Bootstrap entry point
│   │   ├── Dockerfile           # Production Node.js container
│   │   └── drizzle.config.ts    # Drizzle ORM migration configuration
│   │
│   └── worker/                  # BullMQ background media & AI worker
│       ├── src/
│       │   ├── config/          # Worker configuration
│       │   ├── processors/      # Queue job processors
│       │   ├── services/        # Storage, FFmpeg media, transcription, embeddings
│       │   └── main.ts          # Worker bootstrap entry point
│       └── Dockerfile           # Production container with system FFmpeg binary
│
├── packages/
│   ├── shared-types/            # Universal TypeScript interfaces & enums
│   ├── validation/              # Shared Zod validation schemas
│   ├── config/                  # Shared constants and environment schemas
│   └── eslint-config/           # Modern ESLint 9 flat configuration
│
├── infrastructure/
│   ├── docker/                  # PostgreSQL (pgvector init) & Redis configs
│   ├── aws/                     # S3 CORS policies & IAM permission templates
│   └── monitoring/              # Observability configs
│
├── database/                    # Shared database schemas, migrations, and seeds
├── docs/                        # Architectural documentation guides
└── .github/workflows/           # Automated CI & security pipelines
```

---

## 5. Subsystem Architecture

### Web Frontend (`apps/web`)

- **SPA Architecture**: Fully decoupled Single Page Application.
- **Client Routing**: Managed by React Router with catch-all fallback for dynamic nested workspace routes.
- **shadcn/ui-ready**: Tailwind CSS with standard semantic color variables (`--primary`, `--card`, `--muted`, `--accent`), dark-mode toggling, and class merging via `clsx` and `tailwind-merge`.
- **Decoupled API URLs**: Zero hardcoded endpoints; respects `VITE_API_URL` and `VITE_WS_URL`.

### Core REST & WebSocket API (`apps/api`)

- **Prefix**: Global API prefix at `/api/v1`.
- **Layered Architecture**: Controllers -> Services -> Repositories (Drizzle ORM).
- **Interactive Documentation**: Swagger OpenAPI UI available at `/api/docs`.
- **Real-Time Events**: Socket.IO gateway with room-based multiplexing for workspaces and task boards.

### Background Worker (`apps/worker`)

- **Isolation**: Runs as a distinct process / container to isolate heavy CPU operations (FFmpeg media processing, vector calculations) from the customer-facing API.
- **Reliable Queues**: BullMQ with exponential backoff retries, dead-letter queues, and stalled-job detection.
- **Native Media**: Alpine-based Docker image packages system `ffmpeg` and `ffprobe` packages.

### Shared Workspace Packages (`packages/*`)

- **`@projectflow/shared-types`**: Single source of truth for DTO interfaces, enum definitions, and WebSocket event types.
- **`@projectflow/validation`**: Shared Zod schemas ensuring consistent validation on both the browser and server.
- **`@projectflow/config`**: Monorepo constants and environment variable specifications.
- **`@projectflow/eslint-config`**: Shared ESLint 9 flat configuration with presets for React, NestJS, and pure TypeScript libraries.

---

## 6. Persistent Storage Infrastructure

### PostgreSQL 17 & pgvector

The PostgreSQL database runs with `pgvector` pre-installed via the official `pgvector/pgvector:pg17` image.
Initialization is handled automatically by `infrastructure/docker/postgres/init.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
```

### Redis 7 & BullMQ

Redis operates in append-only mode (`AOF`) with persistence to Docker named volume `redis_data`. It provides:

1. Asynchronous job queues for BullMQ.
2. In-memory caching for query acceleration.
3. Socket.IO Redis adapter support for multi-instance scaling.

### AWS S3 Cloud Storage Preparation

- Local development runs without requiring active AWS credentials.
- S3 client libraries (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) are configured.
- IAM least-privilege policy template: `infrastructure/aws/s3/iam-policy-example.json`.
- Direct-to-bucket CORS policy: `infrastructure/aws/s3/cors-policy.json`.

---

## 7. Docker & Local Infrastructure Setup

### Prerequisites

- Docker Engine v24+
- Docker Compose v2+

### Running Core Services (Database + Redis)

To run PostgreSQL and Redis while developing API and Frontend on the host:

```bash
docker compose up -d postgres redis
```

### Running the Entire Stack in Docker

```bash
# Build and launch all 5 containers (postgres, redis, api, web, worker)
docker compose up -d --build

# View real-time logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

---

## 8. Vercel Deployment Configuration

The React frontend (`apps/web`) is pre-configured for Vercel deployment:

- **Root Directory**: `apps/web`
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **SPA Rewrites**: Defined in `apps/web/vercel.json` to prevent HTTP 404 on page refresh:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Environment Variables**: Set `VITE_API_URL` to your production API URL (e.g. `https://api.projectflow.ai/api/v1`).

_Note: The API (`apps/api`) and worker (`apps/worker`) are long-running stateful containers and must be deployed to a container platform (AWS ECS, GCP Cloud Run, DigitalOcean, or Kubernetes), not Vercel._

---

## 9. Environment Variables Configuration

Copy environment templates to generate local `.env` files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/worker/.env.example apps/worker/.env
```

### Key Environment Variables

| Variable             | Scope       | Default Dev Value                                                           | Description                           |
| -------------------- | ----------- | --------------------------------------------------------------------------- | ------------------------------------- |
| `PORT`               | API         | `5000`                                                                      | Port for NestJS server                |
| `DATABASE_URL`       | API, Worker | `postgresql://postgres:postgres_dev_password@localhost:5432/projectflow_ai` | PostgreSQL connection string          |
| `REDIS_HOST`         | API, Worker | `localhost`                                                                 | Redis host                            |
| `REDIS_PORT`         | API, Worker | `6379`                                                                      | Redis port                            |
| `JWT_ACCESS_SECRET`  | API         | _random string_                                                             | Secret key for signing access tokens  |
| `JWT_REFRESH_SECRET` | API         | _random string_                                                             | Secret key for signing refresh tokens |
| `VITE_API_URL`       | Frontend    | `http://localhost:5000/api/v1`                                              | Backend REST API endpoint             |
| `VITE_WS_URL`        | Frontend    | `http://localhost:5000`                                                     | Backend WebSocket endpoint            |
| `AWS_REGION`         | API, Worker | `us-east-1`                                                                 | AWS S3 region (optional locally)      |
| `AWS_S3_BUCKET`      | API, Worker | `projectflow-ai-dev-storage`                                                | S3 bucket name (optional locally)     |

> **Security Note**: Never commit actual `.env` files or cryptographic secrets to source control. Generate secure keys in production via `openssl rand -base64 32`.

---

## 10. Dependency Installation & Requirements

Ensure your workstation has **Node.js 22 LTS or 24 LTS** and **pnpm 12+**:

```bash
# Enable modern pnpm via Corepack
corepack enable
corepack prepare pnpm@12.11.2 --activate

# Install all workspace dependencies
pnpm install
```

---

## 11. Available Monorepo Scripts

Run these commands from the repository root:

```bash
# Development (concurrently starts web, api, and worker via Turborepo)
pnpm run dev

# Targeted development
pnpm run dev:web        # Launch Vite React frontend
pnpm run dev:api        # Launch NestJS API in watch mode
pnpm run dev:worker     # Launch BullMQ worker in watch mode

# Production Builds
pnpm run build          # Build all shared packages and applications
pnpm run build:web      # Build web application to apps/web/dist
pnpm run build:api      # Build NestJS API to apps/api/dist
pnpm run build:worker   # Build worker to apps/worker/dist

# Code Quality & Testing
pnpm run lint           # Run ESLint 9 across all packages
pnpm run format         # Format all files using Prettier
pnpm run format:check   # Verify formatting without modifying files
pnpm run typecheck      # Run tsc across all workspaces
pnpm run test           # Run unit tests across all applications

# Database Commands (Drizzle ORM)
pnpm run db:generate    # Generate SQL migrations from schema
pnpm run db:migrate     # Execute pending migrations
pnpm run db:studio      # Launch Drizzle Studio web interface

# Docker Management
pnpm run docker:up      # Start Docker containers in background
pnpm run docker:down    # Stop Docker containers
pnpm run docker:logs    # Tail container logs
```

---

## 12. Development Workflow

1. **Start Services**: Run `docker compose up -d postgres redis`.
2. **Launch Watchers**: Run `pnpm run dev`.
3. **Frontend**: Open `http://localhost:5173`.
4. **Backend API**: Accessible at `http://localhost:5000/api/v1`.
5. **Add New Schemas / Types**: Add them to `packages/shared-types` or `packages/validation`, then build or run in dev mode. Turborepo handles downstream linking instantly.

---

## 13. Testing Strategy

- **Unit Tests**: Executed via Vitest (`apps/web`, `apps/worker`) and Jest (`apps/api`).
- **E2E API Tests**: Supertest configured in `apps/api/test/`.
- **Component Tests**: React Testing Library with `@testing-library/jest-dom` in `apps/web/test/`.
- **Continuous Integration**: GitHub Actions runs linting, formatting, typechecking, and tests on every pull request.

---

## 14. Git & Branching Workflow

1. **Branch Naming**:
   - `feature/<ticket-id>-description`
   - `fix/<ticket-id>-description`
   - `chore/<description>`
2. **Commit Hygiene**: Follow conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
3. **Pre-Commit Verification**: Run `pnpm run typecheck && pnpm run lint` before creating a pull request.

---

## 15. Security Principles & Architecture

- **Stateless Tokens**: Short-lived (15m) access tokens paired with rotating refresh tokens stored securely.
- **Argon2id Hashing**: Robust cryptographic protection for user passwords.
- **Multi-Tenant Isolation**: Explicit `workspace_id` scoping on all queries to eliminate cross-tenant leakage risks.
- **Zero Raw Public S3 Buckets**: Presigned time-limited URLs for all file uploads and downloads.
- **Defense-in-Depth**: Helmet HTTP headers, CORS whitelisting, and strict Redis-backed rate limiting.

---

## 16. Future AI Architecture & Roadmap

```
+-------------------------------------------------------------------------+
|                        ProjectFlow AI Roadmap                           |
+-------------------------------------------------------------------------+
| Phase 0: Scaffolding, Monorepo Setup, & DevOps Configuration (Done)     |
| Phase 1: Authentication, Workspaces, Projects, & Task CRUD              |
| Phase 2: Drizzle Relational Schema & pgvector Embedding Integration     |
| Phase 3: Real-Time Kanban Boards & Socket.IO Collaboration              |
| Phase 4: Meeting Audio Upload, FFmpeg Processing & AI Transcription     |
| Phase 5: RAG-based Project Knowledge Base Q&A & Document Assistant      |
| Phase 6: Production Staging, Cloud Deployment, & Load Testing          |
+-------------------------------------------------------------------------+
```

---

## 17. Troubleshooting & FAQ

#### Q: Docker PostgreSQL fails to initialize `pgvector`?

Ensure you are using `pgvector/pgvector:pg17` image. The `CREATE EXTENSION IF NOT EXISTS vector;` SQL command is mounted inside `/docker-entrypoint-initdb.d/init.sql` and executes automatically on first container creation.

#### Q: Port 5432 or 6379 already in use?

If you have a local PostgreSQL or Redis service running natively, stop them or change the exposed host port in `docker-compose.yml` (e.g. `"5433:5432"`).

#### Q: TypeScript errors in packages after checkout?

Run `pnpm run build` from the monorepo root. This compiles the shared packages (`@projectflow/shared-types`, `@projectflow/validation`, `@projectflow/config`) so that their build artifacts and type declarations (`dist/`) are available to `apps/*`.

---

## License

This project is licensed under the [MIT License](LICENSE).
