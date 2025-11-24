# Task Board

## In Progress
- _none_

## Backlog
1. Storage integration (MinIO/S3) and attachment management.
2. SMTP provider integration hardening.
3. Automated tests + CI pipeline + linting rules.
4. Database persistence (replace in-memory stores with Prisma/Knex).

## Done
- Backend auth + invitation flow (magic-link prototype with SMTP).
- Batch + infraction CRUD endpoints with CSV import (POST/GET/PATCH/DELETE for batches, nested infractions, CSV upload via multer).
- Voting endpoints + audit logging + tamper hash (hash chain, deadline/finalization checks, vote aggregation, audit trail).
- Export service (CSV/PDF) + email notifications (finalization emails via SMTP, downloadable reports with vote tallies).
- Frontend dashboard + voting UI + admin tools (React SPA with real API integration, voting buttons, batch creation, login flow, responsive design).
