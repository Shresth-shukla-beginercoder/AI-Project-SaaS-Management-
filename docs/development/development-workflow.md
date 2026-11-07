# Development Workflow

## 1. Prerequisites

Ensure your host environment meets the following specifications:

- **Node.js**: v22 LTS or v24 LTS (recommended)
- **pnpm**: v9.0.0 or higher (`corepack enable && corepack prepare pnpm@12.11.2 --activate`)
- **Docker & Docker Compose**: Docker Engine v24+ with Compose v2+
- **Git**: v2.30+

## 2. Quickstart Step-by-Step

### Step 1: Environment File Initialization

Copy the root environment template:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/worker/.env.example apps/worker/.env
```

### Step 2: Start Infrastructure Services

Launch PostgreSQL 17 (with pgvector) and Redis 7 in Docker:

```bash
docker compose up -d postgres redis
```

Verify that both containers report `healthy`:

```bash
docker compose ps
```

### Step 3: Install Monorepo Dependencies

```bash
pnpm install
```

### Step 4: Run Development Servers

Start all applications concurrently with live hot-reloading via Turborepo:

```bash
pnpm run dev
```

Or run individual apps independently:

```bash
pnpm run dev:web     # React frontend at http://localhost:5173
pnpm run dev:api     # NestJS API at http://localhost:5000/api/v1
pnpm run dev:worker  # BullMQ background worker
```

## 3. Database Workflows (Drizzle ORM)

When modifying database schemas:

1. Define schema files in `apps/api/src/database/schema/` or `database/schema/`.
2. Generate migration SQL files:
   ```bash
   pnpm run db:generate
   ```
3. Apply migrations to the local database:
   ```bash
   pnpm run db:migrate
   ```
4. Explore and manage database records interactively with Drizzle Studio:
   ```bash
   pnpm run db:studio
   ```

## 4. Quality Assurance Commands

- **Code Formatting**: `pnpm run format` (formats with Prettier)
- **Format Verification**: `pnpm run format:check`
- **Linting**: `pnpm run lint` (ESLint flat config)
- **Type Checking**: `pnpm run typecheck` (TypeScript strict mode)
- **Unit & Integration Tests**: `pnpm run test`
- **Production Build Check**: `pnpm run build`
