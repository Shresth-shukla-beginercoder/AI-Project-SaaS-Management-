# Database Architecture

## 1. Engine & Extensions

The platform relies on **PostgreSQL 17** paired with the **`pgvector`** extension.

### Why PostgreSQL 17 + pgvector?

- **Unified Relational & Vector Persistence**: Avoids maintaining a separate vector database (e.g. Pinecone, Weaviate), reducing infrastructure complexity, operational cost, and distributed transaction sync bugs.
- **Relational Filtering with Vector Search**: Execute vector distance queries joined with strict workspace-level tenant isolation filters in a single atomic SQL query.
- **ACID Guarantees**: Transactional consistency across project status transitions, audit logs, and embedding updates.

## 2. ORM & Migration Strategy: Drizzle ORM

ProjectFlow AI selects **Drizzle ORM** over Prisma or TypeORM for:

- **Zero Overhead**: Generates lightweight, performant SQL without heavy engine binaries or query-translation penalties.
- **TypeScript First**: Full static type inference directly from SQL table definitions.
- **Native pgvector Support**: First-class `vector` column type and HNSW/IVFFlat index declarations.
- **Declarative Migrations**: `drizzle-kit generate` produces clean, auditable SQL files stored in source control.

## 3. Directory Layout

```text
database/
├── schema/                 # Source of truth for database table declarations
│   ├── users.ts            # User accounts, credentials, and profiles
│   ├── workspaces.ts       # Multi-tenant workspaces and memberships
│   ├── projects.ts         # Projects, milestones, and workflows
│   ├── tasks.ts            # Tasks, priorities, statuses, tags, & embeddings
│   ├── documents.ts        # Knowledge base docs and chunked vector embeddings
│   └── meetings.ts         # Meeting metadata, transcripts, and AI summaries
├── migrations/             # Generated incremental SQL migrations
├── seeds/                  # Seed scripts for testing environments
└── README.md
```

## 4. Vector Search Indexing Strategy

When vector embeddings are introduced in Phase 2:

- **Dimensions**: 1536 (OpenAI `text-embedding-3-small`) or 768 (Google `text-embedding-004`).
- **Distance Metric**: Cosine distance (`<=>`) or Inner Product (`<#>`).
- **Index Type**: Hierarchical Navigable Small World (`HNSW`) index for sub-millisecond retrieval with high recall:
  ```sql
  CREATE INDEX IF NOT EXISTS tasks_embedding_hnsw_idx
  ON tasks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
  ```

## 5. Multi-Tenancy Architecture

All project resources inherit a strict hierarchical multi-tenant structure:

- Workspace -> Organization / Team -> Projects -> Tasks / Documents
- Database queries must explicitly constrain by `workspace_id` to guarantee tenant isolation and prevent cross-tenant data leakage.
