# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

# Copy root configs and workspace manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./

# Copy packages and API app
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build API
RUN pnpm --filter=@projectflow/api run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create unprivileged user
USER node

# Copy build artifacts and dependencies from builder
COPY --chown=node:node --from=builder /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --chown=node:node --from=builder /app/packages ./packages

WORKDIR /app/apps/api

EXPOSE 5000

CMD ["node", "dist/main.js"]
