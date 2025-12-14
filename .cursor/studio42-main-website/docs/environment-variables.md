# Environment Variables

Complete reference for all environment variables used in Studio42.dev main website.

## Required Variables

### Database

**DATABASE_URL**
- **Type:** String (PostgreSQL connection string)
- **Format:** `postgresql://user:password@host:port/database`
- **Example:** `postgresql://studio42_user:password@localhost:5432/studio42_website`
- **Required:** Yes
- **Description:** PostgreSQL database connection string with pgvector support

### Next.js

**NEXT_PUBLIC_APP_URL**
- **Type:** String (URL)
- **Format:** `http://localhost:3000` (development) or `https://studio42.dev` (production)
- **Required:** Yes
- **Description:** Public URL of the application, used for absolute URLs and redirects

**NODE_ENV**
- **Type:** String
- **Values:** `development` | `production` | `test`
- **Default:** `development`
- **Required:** Yes
- **Description:** Node.js environment mode

### Groq API

**GROQ_API_KEY**
- **Type:** String (API key)
- **Format:** `gsk_...`
- **Required:** Yes
- **Description:** Groq API key for AI assistant
- **Where to get:** [Groq Console](https://console.groq.com/)

### OpenAI API (for Embeddings)

**OPENAI_API_KEY**
- **Type:** String (API key)
- **Format:** `sk-...`
- **Required:** Yes (for knowledge base embeddings)
- **Description:** OpenAI API key for generating text embeddings
- **Where to get:** [OpenAI Platform](https://platform.openai.com/)

### Authentication

**NEXTAUTH_SECRET**
- **Type:** String (random secret)
- **Format:** Base64 string (32+ characters)
- **Required:** Yes
- **Description:** Secret key for NextAuth.js session encryption
- **Generate:** `openssl rand -base64 32`

**NEXTAUTH_URL**
- **Type:** String (URL)
- **Format:** `http://localhost:3000` (development) or `https://studio42.dev` (production)
- **Required:** Yes
- **Description:** Base URL for NextAuth.js callbacks

## Optional Variables

### Email Configuration

**Note:** Email can also be configured via admin panel. These environment variables provide defaults.

**SMTP_HOST**
- **Type:** String (hostname)
- **Example:** `smtp.gmail.com`
- **Required:** No (can be configured in admin panel)
- **Description:** SMTP server hostname

**SMTP_PORT**
- **Type:** Number
- **Example:** `587` (TLS) or `465` (SSL)
- **Required:** No
- **Description:** SMTP server port

**SMTP_USER**
- **Type:** String (email)
- **Example:** `noreply@studio42.dev`
- **Required:** No
- **Description:** SMTP authentication username

**SMTP_PASSWORD**
- **Type:** String
- **Required:** No
- **Description:** SMTP authentication password
- **Security:** Should be encrypted in database

**SMTP_FROM_EMAIL**
- **Type:** String (email)
- **Example:** `noreply@studio42.dev`
- **Required:** No
- **Description:** Default "from" email address

**SMTP_FROM_NAME**
- **Type:** String
- **Example:** `Studio42`
- **Required:** No
- **Description:** Default "from" name

### Development

**NEXT_PUBLIC_DEBUG**
- **Type:** Boolean
- **Values:** `true` | `false`
- **Default:** `false`
- **Required:** No
- **Description:** Enable debug mode (shows additional logging)

### Analytics (Future)

**NEXT_PUBLIC_GA_ID**
- **Type:** String
- **Format:** `G-XXXXXXXXXX`
- **Required:** No
- **Description:** Google Analytics tracking ID

**NEXT_PUBLIC_PLAUSIBLE_DOMAIN**
- **Type:** String
- **Required:** No
- **Description:** Plausible Analytics domain

## Environment File Structure

### .env.example

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studio42_website"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Groq API
GROQ_API_KEY="your_groq_api_key_here"

# OpenAI API (for embeddings)
OPENAI_API_KEY="your_openai_api_key_here"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email (Optional - can be configured in admin panel)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM_EMAIL=""
SMTP_FROM_NAME="Studio42"

# Development
NEXT_PUBLIC_DEBUG="false"
```

### .env.local (Development)

For local development, create `.env.local` (gitignored):

```env
# Override .env with local values
DATABASE_URL="postgresql://localhost:5432/studio42_website_dev"
```

### .env.production (Production)

For production, set environment variables via:
- Server environment variables
- Docker environment variables
- CI/CD pipeline secrets
- Cloud platform secrets manager

**Never commit production secrets to git!**

## Security Best Practices

### 1. Never Commit Secrets

- Add `.env` to `.gitignore`
- Use `.env.example` for documentation
- Use environment variable management tools

### 2. Use Strong Secrets

- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- Use strong database passwords
- Rotate API keys regularly

### 3. Separate Environments

- Use different values for development and production
- Never use production keys in development
- Use separate databases for each environment

### 4. Encrypt Sensitive Data

- Encrypt SMTP passwords in database
- Use secure storage for API keys
- Consider using secret management services

### 5. Limit Access

- Restrict who can view environment variables
- Use least privilege principle
- Audit access regularly

## Variable Validation

The application should validate required environment variables on startup:

```typescript
// lib/env.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'GROQ_API_KEY',
  'OPENAI_API_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

## Production Checklist

Before deploying to production, ensure:

- [ ] All required variables are set
- [ ] Production database URL is configured
- [ ] Production API keys are set (not development keys)
- [ ] `NEXTAUTH_SECRET` is unique and secure
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] `NODE_ENV=production`
- [ ] Email configuration is set (if using email)
- [ ] SSL certificate is configured
- [ ] Environment variables are stored securely
- [ ] Backup/restore procedures are documented

## Troubleshooting

### Variable Not Found

**Problem:** `process.env.VARIABLE_NAME` is undefined

**Solutions:**
- Check variable name spelling (case-sensitive)
- Restart development server after changing `.env`
- Verify variable is in `.env` file
- Check if variable needs `NEXT_PUBLIC_` prefix for client-side

### Client-Side Variables

**Rule:** Only variables prefixed with `NEXT_PUBLIC_` are available in browser

**Example:**
```env
# Available in browser
NEXT_PUBLIC_APP_URL="https://studio42.dev"

# NOT available in browser (server-only)
DATABASE_URL="postgresql://..."
GROQ_API_KEY="..."
```

### Type Errors

**Problem:** Environment variable type mismatch

**Solutions:**
- Use type validation (Zod, etc.)
- Convert strings to numbers: `parseInt(process.env.PORT)`
- Handle boolean strings: `process.env.DEBUG === 'true'`

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

