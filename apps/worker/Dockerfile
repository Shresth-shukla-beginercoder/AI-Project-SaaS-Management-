# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

# Copy root configs and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./

# Copy packages and worker app
COPY packages ./packages
COPY apps/worker ./apps/worker

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build worker
RUN pnpm --filter=@projectflow/worker run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies: ffmpeg and ffprobe
RUN apk add --no-cache ffmpeg

# Create unprivileged user
USER node

# Copy build artifacts and dependencies from builder
COPY --chown=node:node --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --chown=node:node --from=builder /app/apps/worker/package.json ./apps/worker/package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --chown=node:node --from=builder /app/packages ./packages

WORKDIR /app/apps/worker

CMD ["node", "dist/main.js"]
