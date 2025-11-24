# Quick Start for Coolify Deployment

## Step 1: Connect Repository

1. In Coolify, create a new resource
2. Select "Docker Compose"
3. Connect your Git repository (or upload the code)

## Step 2: Configure Environment Variables

Set these in Coolify's environment variables UI:

### Required Variables

```bash
# Database
DB_ROOT_PASSWORD=<secure-password>
DB_NAME=voting
DB_USER=voting
DB_PASSWORD=<secure-password>

# Backend
JWT_SECRET=<generate-with-openssl-rand-hex-32>
DATABASE_URL=mysql://voting:<DB_PASSWORD>@db:3306/voting
SMTP_HOST=<your-smtp-host>
SMTP_PORT=587
SMTP_USER=<your-smtp-user>
SMTP_PASSWORD=<your-smtp-password>
SMTP_FROM="Strata Voting <noreply@yourdomain.com>"
APP_BASE_URL=https://yourdomain.com

# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### Generate JWT Secret

```bash
openssl rand -hex 32
```

## Step 3: Deploy

1. Coolify will detect `docker-compose.yml`
2. Click "Deploy"
3. Wait for services to start
4. Database migrations run automatically on first backend startup

## Step 4: Access

- Frontend: Your configured domain
- Backend API: `https://api.yourdomain.com/api/v1`
- Health check: `https://api.yourdomain.com/api/v1/health`

## First Admin User

1. Use the magic link endpoint to create an admin:
   ```bash
   curl -X POST https://api.yourdomain.com/api/v1/auth/magic-link \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@yourdomain.com","role":"admin"}'
   ```
2. Check your email for the magic link
3. Click the link to log in

## Troubleshooting

- **Database connection errors**: Verify `DATABASE_URL` format and credentials
- **Migrations failing**: Check database user has CREATE/DROP permissions
- **Email not sending**: Verify SMTP credentials and test connection
- **File uploads failing**: Check uploads volume is mounted in Coolify

## File Storage

Attachments are stored in `/app/uploads` inside the backend container. This is persisted via Docker volumes. Ensure regular backups of this volume.


