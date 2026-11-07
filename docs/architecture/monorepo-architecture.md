# Monorepo Architecture

## 1. Monorepo Organization

ProjectFlow AI utilizes a pnpm workspace and Turborepo monorepo architecture to maximize code sharing, ensure strict type safety across boundaries, and provide lightning-fast incremental builds with caching.

```text
├── apps/
│   ├── web/               # React 19 + Vite frontend application
│   ├── api/               # NestJS 11 REST API & WebSocket server
│   └── worker/            # BullMQ background media & AI worker
│
├── packages/
│   ├── shared-types/      # Universal TypeScript types, enums, & contracts
│   ├── validation/        # Zod validation schemas shared between client & server
│   ├── config/            # Shared configuration constants & environment definitions
│   └── eslint-config/     # Shared ESLint 9 flat configuration presets
```

## 2. Dependency Graph and Boundaries

```
                 +----------------------+
                 |      apps/web        |
                 +----------+-----------+
                            |
           +----------------+----------------+
           |                |                |
           v                v                v
+------------------+ +--------------+ +---------------+
| @projectflow/    | | @projectflow/| | @projectflow/ |
| shared-types     | | validation   | | config        |
+------------------+ +-------+------+ +---------------+
           ^                 |               ^
           |                 v               |
           |         +----------------+      |
           |         |   apps/api     |------+
           |         +----------------+      |
           |                 |               |
           +-----------------+---------------+
           |                 |
           +--------+        |
                    |        v
                 +--+-------------------+
                 |    apps/worker       |
                 +----------------------+
```

### Dependency Rules:

1. **Apps never depend on apps**: `apps/web` cannot import directly from `apps/api` or `apps/worker`. Communication occurs strictly over HTTPS/WSS protocols and serialized payloads.
2. **Shared logic lives in `packages/`**: Domain types belong in `@projectflow/shared-types`. Form and payload schemas belong in `@projectflow/validation`.
3. **Workspace protocol**: Inter-workspace references use the `workspace:*` specifier in `package.json`.

## 3. Tooling and Automation

### Turborepo Pipeline (`turbo.json`)

- **Topological Sorting**: Builds upstream dependencies (`packages/*`) prior to downstream applications (`apps/*`).
- **Cache Fingerprinting**: Files, dependencies, and environment variables are hashed to bypass rebuilds when artifacts remain unchanged.
- **Parallel Execution**: Independent tasks like linting, typechecking, and testing execute concurrently.

### Build and Compilation Tooling

- `packages/*` use `tsup` for rapid Dual-Format (ESM + CommonJS) compilation with `.d.ts` declaration generation.
- `apps/web` uses `vite` and `tsc -b`.
- `apps/api` uses Nest CLI with `ts-node` in development and compiled output in production.
- `apps/worker` uses `tsup` for production bundling and `tsx` for rapid hot-reloading.
