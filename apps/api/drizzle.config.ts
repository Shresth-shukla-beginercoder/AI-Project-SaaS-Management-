import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/*.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/projectflow_ai',
  },
  verbose: true,
  strict: true,
});
