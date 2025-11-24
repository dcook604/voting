# Architecture Overview

- **Frontend**: React + Vite SPA served via nginx or via backend static hosting. Handles council/admin interfaces, consumes REST API via `/api/v1`. Uses React Query, Zustand (TBD) for state, component library (e.g., Radix + Tailwind) to be decided.
- **Backend**: Node.js (Express + TypeScript). Provides auth, batch/infraction management, voting, exports, notifications, audit logs. Persistence via Prisma/Knex (abstracted for MariaDB/Postgres). Background jobs handled inline (BullMQ/queue TBD) for email reminders.
- **Database**: MariaDB (Docker) with possibility of PostgreSQL. Schema defined in `db_structure.md`.
- **Storage**: MinIO service for attachments/evidence; backend signs download URLs based on requester permissions.
- **Mail**: External Mailu SMTP configured via env; backend handles transactional emails.
- **Reverse Proxy**: Deployment expects existing proxy (Coolify) or local `docker-compose` using nginx + certbot (later addition).
- **Integrations**: Webhooks/REST clients for EspoCRM/ListMonk triggered on batch finalization.

## Key Flows
1. **Magic-link auth**: Admin triggers invitation → backend emails signed token → frontend consumes token, exchanges for JWT, stores in httpOnly cookie.
2. **Voting**: SPA fetches pending infractions, council votes via API; backend validates deadline/mode, stores vote, emits audit log.
3. **Imports**: Admin uploads CSV → backend parses, validates, creates infractions + attachments (async). Errors surfaced to UI.
4. **Exports**: On finalize, backend generates CSV + PDF snapshot, stores metadata, emails summary and optional webhook payloads.

## Module Boundaries
- `apps/backend/src/modules` (auth, batches, infractions, votes, notifications, exports, audit)
- Shared DTOs/types under `apps/backend/src/types` reused by frontend via generated client (future `packages/types`).
- Frontend routes segmented by role with guard components enforcing RBAC.

## Deployment
- Docker Compose orchestrates db, minio, backend, frontend.
- Secrets injected via `.env` files or Coolify variable management.
- Observability via structured logging (pino) and future metrics endpoint.
