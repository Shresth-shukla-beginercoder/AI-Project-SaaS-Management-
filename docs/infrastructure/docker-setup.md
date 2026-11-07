# Docker Infrastructure Guide

## 1. Local Development Overview

The repository provides a multi-container Docker Compose environment that can be run locally without external cloud dependencies:

| Service    | Image / Container        | Host Port | Internal Port | Description                                          |
| ---------- | ------------------------ | --------- | ------------- | ---------------------------------------------------- |
| `postgres` | `pgvector/pgvector:pg17` | 5432      | 5432          | PostgreSQL 17 with `vector` & `uuid-ossp` extensions |
| `redis`    | `redis:7-alpine`         | 6379      | 6379          | In-memory cache and BullMQ job queue broker          |
| `api`      | `apps/api/Dockerfile`    | 5000      | 5000          | NestJS REST API and WebSockets                       |
| `web`      | `apps/web/Dockerfile`    | 5173      | 80            | Nginx serving production React bundle                |
| `worker`   | `apps/worker/Dockerfile` | -         | -             | BullMQ background worker with system FFmpeg          |

## 2. Running the Infrastructure

### Starting Core Persistence Services Only (Recommended for Fast Local Dev)

If developing applications directly on your host machine with Node.js hot-reloading:

```bash
# Start PostgreSQL and Redis in the background
docker compose up -d postgres redis

# Verify health status
docker compose ps
```

### Starting the Full Stack in Docker

```bash
# Build and start all 5 containers
docker compose up -d --build

# Inspect aggregated logs
docker compose logs -f

# Stop all containers
docker compose down
```

## 3. Data Persistence & Volumes

- `postgres_data`: Named Docker volume preserving PostgreSQL tables, schemas, and vector indexes across container restarts.
- `redis_data`: Named Docker volume persisting Redis append-only files (AOF).

To reset all local databases and caches completely:

```bash
docker compose down -v
```

## 4. Production Docker Deployment

Use `docker-compose.prod.yml` for staging and self-hosted production deployments:

- Enforces strict environment variable injection without default fallback passwords.
- Container restart policy set to `always`.
- Production Nginx reverse proxy routing.
- Worker container includes optimized Alpine-based FFmpeg binaries.
