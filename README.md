# Strata Remote Voting App

A self-hosted web platform for strata councils to review infractions and cast Yes/No/Abstain votes remotely with auditable results, per the "Strata Remote Voting App" system design. This repository contains both backend and frontend services, shared documentation, and deployment tooling.

## Repository layout

- `apps/backend` – Express + TypeScript API service (REST) covering infractions, votes, imports, exports, and auth flows.
- `apps/frontend` – React + Vite SPA for admins, council members, and observers.
- `docs/` – architecture, technical references, status updates, decision logs.
- `tasks/` – active development tasks and backlog items.
- `project_specs.md` – authoritative product + delivery specification (living document).
- `db_structure.md` – canonical database schema reference.
- `docker-compose.yml` – local/dev deployment stack.

## Getting started

### Local Development

1. Install dependencies for each app:
   ```bash
   cd apps/backend && npm install
   cd apps/frontend && npm install
   ```
2. Copy `.env.example` to `.env` in the root directory and configure:
   - Database credentials
   - JWT secret (generate with `openssl rand -hex 32`)
   - SMTP settings for email
3. Start database and run migrations:
   ```bash
   docker compose up db -d
   cd apps/backend
   npx prisma migrate dev
   ```
4. Start services:
   ```bash
   # Backend
   cd apps/backend && npm run dev
   
   # Frontend (in another terminal)
   cd apps/frontend && npm run dev
   ```

### Production Deployment (Coolify)

See `DEPLOYMENT.md` for detailed Coolify deployment instructions.

Quick start:
1. Connect repository to Coolify
2. Use Docker Compose deployment
3. Configure environment variables in Coolify UI
4. Deploy - migrations run automatically on first startup

## Contributing

- Follow the patterns and conventions documented in `docs/technical.md`.
- Keep files <300 lines where possible and document complex logic lightly.
- Update `docs/status.md` and `tasks/tasks.md` as work progresses.
- Ensure tests run locally (`npm run test` in each app) before pushing changes.
