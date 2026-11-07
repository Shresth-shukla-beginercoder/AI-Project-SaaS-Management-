# Database Infrastructure

This directory houses the shared database definitions, schema artifacts, migrations, and seed scripts for the ProjectFlow AI platform.

## Technology Stack

- **RDBMS**: PostgreSQL 17
- **Vector Search Extension**: `pgvector`
- **ORM / Query Builder**: Drizzle ORM
- **Migration Engine**: Drizzle Kit

## Directory Structure

```text
database/
├── schema/         # Database table definitions, relations, and vector indexes
├── migrations/     # Generated SQL migration files managed by Drizzle Kit
├── seeds/          # Deterministic seed data scripts for local development & testing
└── README.md       # Database documentation and operations guide
```

## pgvector Extension

The PostgreSQL database container automatically initializes the `vector` extension via `infrastructure/docker/postgres/init.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
```

This supports storing dense embeddings (e.g. OpenAI `text-embedding-3-small` at 1536 dimensions or Google embeddings at 768 dimensions) directly in PostgreSQL tables alongside application data, enabling fast approximate nearest neighbor (ANN) vector similarity search via HNSW or IVFFlat indexes.

## Workflow Commands

Run all database commands from the repository root:

- `pnpm db:generate` - Generate new SQL migration files based on schema changes.
- `pnpm db:migrate` - Execute pending SQL migrations against the active database.
- `pnpm db:studio` - Launch Drizzle Studio web GUI at `http://localhost:4983` to inspect tables and records.
