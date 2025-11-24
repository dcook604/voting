# Technical Guide

## Backend
- **Runtime**: Node 20 LTS, Express 5, TypeScript.
- **Structure**: `src/` contains `app.ts`, `routes/`, `controllers/`, `services/`, `repositories/`, `middlewares/`. Each module exports DTO interfaces.
- **ORM**: Placeholder for Prisma (add `schema.prisma` later) or Knex; keep repository layer abstract.
- **Validation**: Zod schemas per request to ensure consistent API responses.
- **Auth**: Magic-link tokens hashed with bcrypt; JWTs signed with HS256 using `JWT_SECRET`.
- **Config**: `src/config.ts` loads env via dotenv; never access `process.env` directly elsewhere.
- **Logging**: pino w/ request ID middleware.
- **Testing**: Vitest + supertest skeleton (add coverage when handlers implemented).

## Frontend
- **Tooling**: Vite + React + TypeScript + React Router + TanStack Query.
- **State**: Query cache + small Zustand store for auth/session metadata.
- **Styling**: Tailwind CSS (preconfigured) with CSS variables for theming.
- **API client**: Lightweight fetch wrapper with interceptors for auth refresh.
- **Testing**: Vitest + React Testing Library baseline.

## Shared Conventions
- Use absolute imports via `tsconfig.json` path aliases (`@/` on frontend, `~/` on backend).
- Responses follow `{ success, data, error }`. Errors bubble through centralized handler.
- Keep files under 300 LOC. Extract helpers/services as needed.
- Prefer dependency inversion: controllers orchestrate services; services call repositories; repositories talk to DB/storage.
- Update `docs/status.md` and `tasks/tasks.md` with progress.

## Pending
- Add migration tooling (Prisma migrate / Knex).
- Hook linter/formatter (ESLint + Prettier) for both apps.
- Add CI workflow (GitHub Actions) once code matures.
