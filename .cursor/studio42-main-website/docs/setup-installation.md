# Setup & Installation Guide

Complete setup and installation instructions for Studio42.dev main website.

## Prerequisites

### Required Software

- **Node.js:** Version 20.x LTS or higher
- **PostgreSQL:** Version 15 or higher
- **Git:** For version control
- **npm or yarn:** Package manager

### System Requirements

- **OS:** Linux (Ubuntu 22.04+ recommended), macOS, or Windows
- **RAM:** Minimum 2GB (4GB+ recommended)
- **Disk Space:** Minimum 5GB free space
- **Network:** Internet connection for package installation and API access

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd studio42-main-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. PostgreSQL Setup

#### Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
```

**Windows:**
Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)

#### Install pgvector Extension

**Ubuntu/Debian:**
```bash
sudo apt install postgresql-15-pgvector
```

**From Source:**
```bash
git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

#### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE studio42_website;

# Create user (optional)
CREATE USER studio42_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE studio42_website TO studio42_user;

# Connect to database
\c studio42_website

# Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify extension
SELECT * FROM pg_extension WHERE extname = 'vector';

# Exit
\q
```

### 4. Environment Configuration

#### Create .env File

```bash
cp .env.example .env
```

#### Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://studio42_user:your_password@localhost:5432/studio42_website"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Groq API
GROQ_API_KEY="your_groq_api_key"

# OpenAI (for embeddings)
OPENAI_API_KEY="your_openai_api_key"

# Admin Authentication
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (Optional - can be configured in admin panel)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM_EMAIL=""
SMTP_FROM_NAME="Studio42"
```

#### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Use the output as `NEXTAUTH_SECRET`.

### 5. Database Setup

#### Run Migrations

```bash
npm run db:migrate
```

This will:
- Create all database tables
- Set up indexes
- Create pgvector extension (if not already created)

#### Create Vector Index

After migrations, create the vector index:

```bash
# Connect to database
psql -U studio42_user -d studio42_website

# Create HNSW index
CREATE INDEX knowledge_base_embedding_idx 
ON knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

# Exit
\q
```

#### Seed Initial Data

```bash
npm run db:seed
```

This will create:
- Admin user (default: admin@studio42.dev / password: admin123 - CHANGE THIS!)
- Email configuration (disabled by default)
- Sample products (LMS + placeholders)
- Sample knowledge base entries

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Post-Installation Setup

### 1. Create Admin User

**Option A: Via Seed Script (Default)**
- Default credentials: `admin@studio42.dev` / `admin123`
- **IMPORTANT:** Change password immediately after first login

**Option B: Manual Creation**
```bash
# Run admin creation script
npm run create-admin
# Follow prompts to create admin user
```

**Option C: Via Database**
```bash
# Connect to database
psql -U studio42_user -d studio42_website

# Hash password (use bcrypt)
# Then insert:
INSERT INTO admins (id, email, password_hash, name, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@studio42.dev',
  '$2b$10$hashed_password_here',
  'Admin Name',
  NOW(),
  NOW()
);
```

### 2. Configure Email (Optional)

1. Log in to admin dashboard: `http://localhost:3000/admin`
2. Navigate to Email Configuration
3. Enable email notifications
4. Configure SMTP settings
5. Test email sending

### 3. Populate Knowledge Base

**Option A: Automatic from Products**
```bash
npm run populate-kb
```

This script will:
- Extract product information from database
- Generate embeddings
- Store in knowledge base

**Option B: Manual Entry**
1. Log in to admin dashboard
2. Navigate to Knowledge Base
3. Add entries manually
4. Embeddings will be generated automatically

### 4. Customize Content

1. **Update Products:**
   - Edit product information in database or via admin interface
   - Add product media (videos, images)
   - Update product descriptions

2. **Customize Pages:**
   - Edit homepage content
   - Update About page
   - Add blog posts

3. **Configure Branding:**
   - Update site title and description
   - Customize colors and styling
   - Add logo and favicon

## Production Deployment

### 1. Build Application

```bash
npm run build
```

### 2. Environment Variables

Set production environment variables:
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://studio42.dev`
- `DATABASE_URL` (production database)
- All API keys (production keys)

### 3. Start Production Server

```bash
npm run start
```

### 4. Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name studio42.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Certificate

Use Let's Encrypt for free SSL:

```bash
sudo certbot --nginx -d studio42.dev
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

**Solutions:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify connection string in `.env`
- Check firewall settings
- Verify user permissions

### pgvector Extension Not Found

**Problem:** `ERROR: extension "vector" does not exist`

**Solutions:**
- Install pgvector extension (see Installation Steps)
- Verify extension is enabled: `CREATE EXTENSION IF NOT EXISTS vector;`
- Check PostgreSQL version compatibility

### Groq API Errors

**Problem:** API calls failing

**Solutions:**
- Verify `GROQ_API_KEY` in `.env`
- Check API key is valid
- Verify rate limits not exceeded
- Check network connectivity

### Email Not Sending

**Problem:** Emails not being sent

**Solutions:**
- Verify email is enabled in admin panel
- Check SMTP configuration
- Test SMTP connection
- Check email server logs
- Verify firewall allows SMTP port

### Vector Search Not Working

**Problem:** Semantic search returns no results

**Solutions:**
- Verify vector index is created
- Check embeddings are generated
- Verify OpenAI API key for embedding generation
- Check similarity threshold in search query

## Verification Checklist

After installation, verify:

- [ ] Application starts without errors
- [ ] Database connection works
- [ ] Homepage loads correctly
- [ ] Product pages display
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] AI chat widget appears
- [ ] AI assistant responds to questions
- [ ] Email configuration accessible (if configured)
- [ ] Vector search works (test with AI assistant)

## Next Steps

1. **Customize Content:**
   - Update product information
   - Add real product media
   - Customize styling

2. **Configure Production:**
   - Set up production database
   - Configure production environment variables
   - Set up SSL certificate
   - Configure domain DNS

3. **Security Hardening:**
   - Change default admin password
   - Review security settings
   - Set up monitoring
   - Configure backups

4. **Performance Optimization:**
   - Enable caching
   - Optimize images
   - Configure CDN (if needed)
   - Monitor performance

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Groq API Documentation](https://console.groq.com/docs)

