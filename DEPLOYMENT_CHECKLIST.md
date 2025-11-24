# Deployment Checklist for Coolify

## Pre-Deployment

- [ ] Repository is connected to Coolify
- [ ] Environment variables are configured (see `QUICK_START.md`)
- [ ] JWT_SECRET is generated (32+ character random string)
- [ ] SMTP credentials are ready
- [ ] Domain names are configured (if using custom domains)

## Deployment Steps

1. **Create Resource in Coolify**
   - Type: Docker Compose
   - Repository: Your voting app repo
   - Branch: main (or your deployment branch)

2. **Set Environment Variables**
   - Copy from `QUICK_START.md`
   - Set all required variables in Coolify UI
   - Double-check `DATABASE_URL` format

3. **Deploy**
   - Click "Deploy" in Coolify
   - Monitor logs for:
     - Database connection success
     - Prisma migrations running
     - Backend starting on port 4000
     - Frontend building successfully

4. **Verify Deployment**
   - Health check: `GET /api/v1/health`
   - Frontend loads at your domain
   - Can request magic link

## Post-Deployment

- [ ] Create first admin user via magic link
- [ ] Test batch creation
- [ ] Test file upload
- [ ] Test email notifications
- [ ] Set up database backups
- [ ] Set up uploads volume backups

## Important Notes

- **Database migrations** run automatically on first backend startup
- **File uploads** are stored in `/app/uploads` (persisted via Docker volume)
- **No external storage** needed - everything is local
- **SMTP is required** for magic links and notifications

## Rollback

If deployment fails:
1. Check logs in Coolify
2. Verify environment variables
3. Check database connectivity
4. Review Prisma migration errors

## Support Files

- `DEPLOYMENT.md` - Detailed deployment guide
- `QUICK_START.md` - Quick reference for Coolify
- `docker-compose.yml` - Service configuration
- `.env.example` - Environment variable template


