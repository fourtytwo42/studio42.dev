# Studio42.dev Main Website

Premium SaaS product showcase and marketing website for Studio42.dev.

## Features

- **Product Showcase**: Beautiful product pages with media carousels, features, and pricing
- **Universal Contact System**: Dynamic contact form with URL parameter support
- **AI Assistant**: Groq-powered chat widget with semantic search
- **Admin Dashboard**: Secure admin interface for managing contacts and email configuration
- **Email System**: Configurable SMTP email notifications

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Custom CSS
- **Backend**: Next.js API Routes, Node.js 20+
- **Database**: PostgreSQL 15+ with pgvector extension, Prisma ORM
- **AI**: Groq API (OpenAI-compatible) with tool calling
- **Email**: SMTP (Nodemailer, optional/admin-configurable)
- **Auth**: NextAuth.js v5 (beta)
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ with pgvector extension
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studio42.dev
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
# Create database and enable pgvector
sudo -u postgres psql
CREATE DATABASE studio42_website;
CREATE USER studio42_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE studio42_website TO studio42_user;
\c studio42_website
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

5. Run migrations and seed:
```bash
npm run db:migrate
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Base URL for authentication
- `GROQ_API_KEY` - Groq API key for AI assistant
- `OPENAI_API_KEY` - OpenAI API key for embeddings (optional)
- `GROQ_MODEL` - Groq model name (default: llama-3.1-70b-versatile)
- `EMBEDDING_MODEL` - Embedding model (default: text-embedding-3-small)

## Testing

The project maintains 90%+ test coverage with:
- Unit tests (Jest)
- Integration tests (Jest)
- E2E tests (Playwright)

Run all tests:
```bash
npm run test:all
```

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t studio42-website .
docker run -p 3000:3000 --env-file .env.local studio42-website
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Set up reverse proxy (nginx recommended) with SSL

## Project Structure

```
studio42.dev/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin pages (protected)
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── ai/                # AI assistant components
│   ├── contact/           # Contact form components
│   └── products/           # Product components
├── lib/                    # Utility libraries
├── prisma/                 # Prisma schema and migrations
├── scripts/                # Utility scripts
├── styles/                 # CSS files
└── __tests__/             # Test files
```

## License

Private - Studio42.dev
