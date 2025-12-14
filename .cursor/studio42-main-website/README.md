# Studio42.dev Main Website

**Premium SaaS product showcase and marketing website with AI-powered assistant**

A visually stunning, top-of-class marketing website for studio42.dev that showcases multiple SaaS products, provides a universal contact system, and includes an intelligent AI assistant powered by Groq with semantic search capabilities.

## Quick Links

- **[Main Documentation](studio42-main-website.md)** - Complete project overview
- **[Setup Guide](docs/setup-installation.md)** - Installation and setup instructions
- **[Architecture](docs/architecture.md)** - System design and components
- **[Database Schema](docs/database-schema.md)** - Database structure with pgvector
- **[API Documentation](docs/api-specifications.md)** - All API endpoints

## Features

✅ **Product Showcase** - Portfolio-style grid with individual product pages  
✅ **Universal Contact System** - Dynamic form with URL parameter support  
✅ **AI Assistant** - Groq-powered chat with semantic search  
✅ **Admin Dashboard** - Contact management and email configuration  
✅ **Custom Design** - Top-of-class visual design beyond standard frameworks  

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Custom CSS
- **Backend:** Next.js API Routes, Node.js 20+
- **Database:** PostgreSQL 15+ with pgvector
- **AI:** Groq API (OpenAI-compatible)
- **Authentication:** NextAuth.js

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd studio42-main-website

# Install dependencies
npm install

# Setup database (see setup guide)
# Configure .env file

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Start development server
npm run dev
```

## Documentation

All documentation is in the `docs/` folder:

- **[Setup & Installation](docs/setup-installation.md)**
- **[Architecture](docs/architecture.md)**
- **[Database Schema](docs/database-schema.md)**
- **[API Specifications](docs/api-specifications.md)**
- **[Environment Variables](docs/environment-variables.md)**
- **[Features:](docs/features/)**
  - [Product Showcase](docs/features/product-showcase.md)
  - [Contact System](docs/features/contact-system.md)
  - [AI Assistant](docs/features/ai-assistant.md)
  - [Admin Dashboard](docs/features/admin-dashboard.md)

## Status

**Current Phase:** Planning & Documentation

**Next Steps:**
1. Initialize Next.js 16 project
2. Setup database with Prisma and pgvector
3. Begin development milestones

## License

To be determined

---

For complete project information, see [Main Documentation](studio42-main-website.md).

