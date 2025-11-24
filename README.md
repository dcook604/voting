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

1. Install dependencies for each app:
   ```bash
   cd apps/backend && npm install
   cd apps/frontend && npm install
   ```
2. Copy `.env.example` to `.env` within each app and adjust secrets (DB URL, SMTP, object storage, etc.).
3. From repo root, use Docker Compose for end-to-end dev:
   ```bash
   docker compose up --build
   ```
4. Refer to `docs/architecture.md` and `docs/technical.md` for deeper context before implementing new features.

## Contributing

- Follow the patterns and conventions documented in `docs/technical.md`.
- Keep files <300 lines where possible and document complex logic lightly.
- Update `docs/status.md` and `tasks/tasks.md` as work progresses.
- Ensure tests run locally (`npm run test` in each app) before pushing changes.
