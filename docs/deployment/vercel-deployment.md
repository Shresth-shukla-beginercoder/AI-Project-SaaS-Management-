# Vercel Deployment Guide (Frontend Only)

## 1. Architectural Scope

**Important Architectural Boundary**:
Only the React frontend application (`apps/web`) is deployed to Vercel.
The backend REST/WebSocket API (`apps/api`) and the asynchronous background worker (`apps/worker`) are separate long-running stateful services (requiring persistent WebSocket connections and background worker processes) and must **NOT** be deployed as Vercel serverless functions.

## 2. Vercel Project Configuration

When importing this repository into Vercel:

1. **Framework Preset**: Select **Vite** (or Other).
2. **Root Directory**: Click "Edit" and set the Root Directory to:
   ```text
   apps/web
   ```
3. **Build Command**:
   ```bash
   pnpm run build
   ```
   (Vercel will leverage Turborepo caching automatically).
4. **Output Directory**:
   ```text
   dist
   ```
5. **Install Command**:
   ```bash
   pnpm install
   ```

## 3. Environment Variables on Vercel

Configure these in the Vercel Dashboard under **Project Settings -> Environment Variables**:

| Variable Name  | Example Production Value            | Description               |
| -------------- | ----------------------------------- | ------------------------- |
| `VITE_API_URL` | `https://api.projectflow.ai/api/v1` | Public REST API base URL  |
| `VITE_WS_URL`  | `https://api.projectflow.ai`        | Public WebSocket endpoint |

_Never commit `.env` or production credentials to Git._

## 4. SPA Routing and Fallback (`vercel.json`)

Vite SPAs require client-side routing fallback so that deep links (such as `/workspaces/123/tasks/456`) resolve to `index.html` rather than throwing HTTP 404 errors. This is configured in `apps/web/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 5. Connecting Frontend to the Backend

1. **CORS Configuration**: The NestJS API configured on your server/cloud must whitelist your Vercel deployment domains (e.g. `https://your-project.vercel.app`) in the `CORS_ORIGIN` environment variable.
2. **Cookie / Token Security**: In production, ensure authentication cookies or JWT refresh tokens set `SameSite=None; Secure` when the API and frontend reside on different domains.
