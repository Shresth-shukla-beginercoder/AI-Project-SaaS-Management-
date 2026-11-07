# System Architecture

## 1. Architectural Overview

ProjectFlow AI is engineered as an enterprise-grade, distributed AI-assisted project management platform designed around high-throughput asynchronous processing, real-time collaboration, and dense vector similarity search.

```
                              +-------------------------+
                              |   Client Web Browser    |
                              |   (React 19 + Vite SPA) |
                              +------------+------------+
                                           |
                    HTTPS / REST API       |        WebSocket (Socket.IO)
                                           v
                              +------------+------------+
                              |    Nginx Reverse Proxy  |
                              +------------+------------+
                                           |
                                           v
                              +-------------------------+
                              |      NestJS API         |
                              |  (Port 5000, REST + WS) |
                              +----+---------------+----+
                                   |               |
                   SQL via Drizzle |               | Enqueue Jobs
                                   v               v
                +--------------------+           +--------------------+
                |   PostgreSQL 17    |           |      Redis 7       |
                |   with pgvector    |           | (BullMQ & Caching) |
                +--------------------+           +---------+----------+
                                                           |
                                                           | Dequeue Jobs
                                                           v
                                                 +--------------------+
                                                 | Background Worker  |
                                                 | (FFmpeg, AI, S3)   |
                                                 +---------+----------+
                                                           |
                                           +---------------+---------------+
                                           |                               |
                                           v                               v
                                  +-----------------+             +-----------------+
                                  | Amazon S3       |             | AI Providers    |
                                  | Object Storage  |             | (OpenAI, Anth)  |
                                  +-----------------+             +-----------------+
```

## 2. Core Subsystems

### 2.1 Web Frontend (`apps/web`)

- **Framework**: React 19 + TypeScript bundled via Vite.
- **Routing**: React Router with client-side SPA routing and Vercel routing rewrites.
- **Styling**: Tailwind CSS with shadcn/ui-ready design tokens and CSS variable theming.
- **State Management**:
  - Server state: TanStack Query (cache invalidation, optimistic UI, background fetching).
  - Client / UI state: Zustand stores (modals, active panel, layout state).
- **Forms & Validation**: React Hook Form coupled with Zod schema resolution.
- **Real-Time Client**: Socket.IO client subscribed to workspace and board event channels.
- **Interactive Drag-and-Drop**: `@dnd-kit/core` and `@dnd-kit/sortable` for Kanban boards and task reordering.

### 2.2 Core API (`apps/api`)

- **Framework**: NestJS 11 with modular domain architecture.
- **Data Layer**: Drizzle ORM communicating with PostgreSQL 17.
- **API Documentation**: Automated Swagger / OpenAPI documentation at `/api/docs`.
- **Security & Hardening**: Helmet HTTP security headers, CORS origin enforcement, and NestJS Throttler rate limiting.
- **Authentication**: Stateless JWT access and refresh token rotation with Argon2 password hashing.
- **Real-Time Gateway**: Socket.IO gateway for broadcasting updates, presence, and task board changes.

### 2.3 Background Worker (`apps/worker`)

- **Queue Engine**: BullMQ backed by Redis 7 streams and sets.
- **Responsibilities**:
  - Media transcoding and audio extraction via FFmpeg and FFprobe system binaries.
  - Asynchronous chunked AI transcriptions.
  - Vector embedding calculation for semantic search.
  - Document indexing and automated AI task summarization.
  - Cloud storage lifecycle operations and presigned URL coordination.

### 2.4 Persistence Layer (`database`)

- **Relational Data**: PostgreSQL 17 storing structured entities (workspaces, projects, tasks, comments, audits).
- **Vector Search**: PostgreSQL `pgvector` extension storing embedding vectors (e.g., 1536-dimensional embeddings for task descriptions, document sections, and meeting transcripts).
- **Schema Management**: Drizzle Kit generating forward SQL migration scripts.

### 2.5 In-Memory Cache & Message Broker

- **Technology**: Redis 7.
- **Roles**:
  - Distributed job queue persistence for BullMQ.
  - Session state and token invalidation blacklists.
  - Real-Time socket adapter for horizontal multi-instance pub/sub scaling.
  - Rate limiting counter store.
