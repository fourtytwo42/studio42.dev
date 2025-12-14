# Deployment Guide

Complete guide for deploying Studio42.dev main website to production.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ with pgvector extension
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Server with at least 2GB RAM, 2 CPU cores

## Server Setup

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 15
sudo apt install postgresql postgresql-contrib

# Install pgvector extension
sudo apt install postgresql-15-pgvector
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE studio42_website;
CREATE USER studio42_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE studio42_website TO studio42_user;
\c studio42_website
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### 3. Application Setup

```bash
# Clone repository
git clone <repository-url> /var/www/studio42.dev
cd /var/www/studio42.dev

# Install dependencies
npm ci --production=false

# Set up environment variables
cp .env.example .env.production
nano .env.production
# Edit with production values

# Run migrations
npm run db:migrate

# Seed database (optional, for initial setup)
npm run db:seed
```

### 4. Build Application

```bash
npm run build
```

## Deployment Options

### Option 1: PM2 (Recommended)

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "studio42-website" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker

```bash
# Build Docker image
docker build -t studio42-website .

# Run container
docker run -d \
  --name studio42-website \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  studio42-website
```

### Option 3: Systemd Service

Create `/etc/systemd/system/studio42-website.service`:

```ini
[Unit]
Description=Studio42.dev Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/studio42.dev
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable studio42-website
sudo systemctl start studio42-website
```

## Nginx Configuration

Create `/etc/nginx/sites-available/studio42.dev`:

```nginx
server {
    listen 80;
    server_name studio42.dev www.studio42.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name studio42.dev www.studio42.dev;

    ssl_certificate /etc/letsencrypt/live/studio42.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studio42.dev/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/studio42.dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d studio42.dev -d www.studio42.dev
```

## Environment Variables

Required production environment variables:

```env
# Database
DATABASE_URL=postgresql://studio42_user:password@localhost:5432/studio42_website

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://studio42.dev

# AI
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
GROQ_MODEL=llama-3.1-70b-versatile
EMBEDDING_MODEL=text-embedding-3-small

# Application
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://studio42.dev
```

## Post-Deployment

1. **Verify Application**:
   - Visit https://studio42.dev
   - Test product pages
   - Test contact form
   - Test admin login

2. **Monitor Logs**:
   ```bash
   # PM2
   pm2 logs studio42-website
   
   # Systemd
   sudo journalctl -u studio42-website -f
   
   # Docker
   docker logs -f studio42-website
   ```

3. **Set up Monitoring** (Optional):
   - Configure uptime monitoring
   - Set up error tracking (Sentry, etc.)
   - Configure log aggregation

## Updates

To update the application:

```bash
cd /var/www/studio42.dev
git pull
npm ci
npm run db:migrate
npm run build
pm2 restart studio42-website
# OR
sudo systemctl restart studio42-website
# OR
docker-compose restart
```

## Backup

Regular backups recommended:

```bash
# Database backup
pg_dump -U studio42_user studio42_website > backup_$(date +%Y%m%d).sql

# Restore
psql -U studio42_user studio42_website < backup_20240101.sql
```

## Troubleshooting

### Application won't start
- Check logs: `pm2 logs` or `journalctl -u studio42-website`
- Verify environment variables
- Check database connection
- Verify port 3000 is available

### Database connection errors
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials
- Verify pgvector extension: `psql -c "SELECT * FROM pg_extension WHERE extname='vector';"`

### SSL certificate issues
- Renew certificate: `sudo certbot renew`
- Check nginx configuration: `sudo nginx -t`

