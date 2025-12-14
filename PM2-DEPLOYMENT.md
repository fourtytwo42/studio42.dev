# PM2 Deployment Guide

## Current Deployment Status

✅ **Application is running with PM2**

- **App Name**: studio42-website
- **Status**: Online
- **Port**: 3000
- **Mode**: Production
- **Auto-restart**: Enabled
- **Startup script**: Configured

## PM2 Commands

### Basic Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs studio42-website

# View logs (last 100 lines)
pm2 logs studio42-website --lines 100

# Restart application
pm2 restart studio42-website

# Stop application
pm2 stop studio42-website

# Delete application
pm2 delete studio42-website

# Reload application (zero-downtime)
pm2 reload studio42-website
```

### Monitoring

```bash
# Monitor CPU and Memory
pm2 monit

# View detailed info
pm2 info studio42-website

# View process list
pm2 list
```

### Logs

```bash
# View all logs
pm2 logs

# View only error logs
pm2 logs studio42-website --err

# View only output logs
pm2 logs studio42-website --out

# Clear logs
pm2 flush
```

## Updating the Application

When you need to update the application:

```bash
cd /home/hendo420/studio42.dev

# Pull latest changes
git pull

# Install dependencies (if needed)
npm ci

# Run database migrations (if needed)
npm run db:migrate

# Rebuild application
npm run build

# Restart with PM2
pm2 restart studio42-website
```

## Configuration

The PM2 configuration is in `ecosystem.config.js`:

- **Script**: `.next/standalone/server.js` (standalone mode)
- **Instances**: 1
- **Memory limit**: 1GB (auto-restart if exceeded)
- **Logs**: Stored in `./logs/` directory
- **Auto-restart**: Enabled
- **Min uptime**: 10 seconds before considering stable

## Environment Variables

Make sure your `.env.production` or `.env.local` file has all required variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GROQ_API_KEY`
- `OPENAI_API_KEY` (optional, for embeddings)
- `NODE_ENV=production`

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs studio42-website --err

# Check if port is in use
lsof -i :3000

# Check database connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Application crashes

```bash
# View error logs
pm2 logs studio42-website --err --lines 50

# Check memory usage
pm2 monit

# Restart with more memory
pm2 restart studio42-website --update-env
```

### View process details

```bash
pm2 info studio42-website
```

## Startup on Boot

PM2 startup has been configured. The application will automatically start on system reboot.

To reconfigure startup:
```bash
pm2 startup
pm2 save
```

## Accessing the Application

- **Local**: http://localhost:3000
- **Network**: http://192.168.50.110:3000 (if accessible)

For production, set up Nginx reverse proxy with SSL (see `DEPLOYMENT.md`).

