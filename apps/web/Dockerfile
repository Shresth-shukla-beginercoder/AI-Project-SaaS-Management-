# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

# Copy root configs and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./

# Copy packages and apps
COPY packages ./packages
COPY apps/web ./apps/web

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build web application
RUN pnpm --filter=@projectflow/web run build

# Production Stage with Nginx
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
