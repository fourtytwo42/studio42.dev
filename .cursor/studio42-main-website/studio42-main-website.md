---
title: Studio42.dev Main Website
status: planning
category: SaaS / Marketing Website
tags: [saas, marketing, website, nextjs, postgresql, ai-assistant, groq]
keywords: [saas landing page, product showcase, contact form, ai assistant, semantic search]
github: [To be created]
demo: https://studio42.dev
created: 2025-01-XX
---

# Studio42.dev Main Website

**Premium SaaS product showcase and marketing website with AI-powered assistant**

A visually stunning, top-of-class marketing website for studio42.dev that showcases multiple SaaS products, provides a universal contact system, and includes an intelligent AI assistant powered by Groq with semantic search capabilities.

## Concept

**Problem Statement:** 
Studio42.dev needs a professional, visually impressive main website that:
- Showcases multiple SaaS products in an attractive portfolio-style layout
- Provides a unified contact system that works across all product subdomains
- Includes an AI assistant that can answer questions about all products
- Serves as a sales and marketing hub for all SaaS offerings
- Maintains a premium, top-of-class visual design that stands out

**Solution Vision:**
A comprehensive marketing website featuring:
- Portfolio-style product grid showcasing all SaaS products
- Individual product pages with detailed information, videos, and links
- Universal contact page with dynamic form population from URL parameters
- Admin dashboard for managing contacts and email configuration
- Floating AI chat assistant with semantic search knowledge base
- Modern, custom-designed UI that goes beyond standard frameworks

**Core Philosophy:**
- **Visual Excellence:** Top-of-class design that sells and impresses
- **Unified Experience:** One contact system works across all products
- **Intelligent Assistance:** AI that knows everything about all products
- **Complete Documentation:** All information needed to build without asking questions
- **Custom Design:** Beyond standard Tailwind, unique and memorable

**Target Users:**
- **Primary:** Potential customers browsing SaaS products
- **Secondary:** Sales team managing inquiries
- **Tertiary:** Admin managing contacts and configuration

**Success Metrics:**
- **Conversion:** Contact form submissions and demo requests
- **Engagement:** Time on site, pages viewed, AI assistant usage
- **Visual Appeal:** Professional appearance that reflects quality
- **Technical:** Fast load times, responsive design, 99.9% uptime

---

## 📚 Documentation Index

### Getting Started
- **[Implementation Stages](docs/implementation-stages.md)** - **START HERE** - Complete step-by-step implementation guide with no ambiguity
- **[Development Guide](docs/development-guide.md)** - Development workflow, coding standards, best practices
- **[Setup & Installation Guide](docs/setup-installation.md)** - Complete setup instructions, database configuration, initial deployment
- **[Environment Variables](docs/environment-variables.md)** - Complete ENV configuration reference

### Architecture & Design
- **[System Architecture](docs/architecture.md)** - Complete system design, component breakdown, technology stack
- **[Database Schema](docs/database-schema.md)** - Complete database schema, relationships, indexes, pgvector setup
- **[API Specifications](docs/api-specifications.md)** - All API endpoints, request/response formats, authentication
- **[UI/UX Flows](docs/ui-ux-flows.md)** - Complete user journeys, wireframes, interaction patterns
- **[Implementation Details](docs/implementation-details.md)** - Code examples, file structure, coding patterns, state management
- **[Component Library](docs/component-library.md)** - Reusable UI component specifications
- **[Decisions & Patterns](docs/decisions-patterns.md)** - Key architectural decisions, design patterns, and conventions

### Features & Functionality
- **[Product Showcase System](docs/features/product-showcase.md)** - Product cards, pages, navigation
- **[Universal Contact System](docs/features/contact-system.md)** - Contact form, URL parameters, admin management
- **[AI Assistant Integration](docs/features/ai-assistant.md)** - Groq integration, semantic search, tool calling
- **[Admin Dashboard](docs/features/admin-dashboard.md)** - Contact management, email configuration

### Operations
- **[Testing Guide](docs/testing-guide.md)** - Testing strategy, coverage requirements, E2E tests
- **[Deployment Guide](docs/deployment-guide.md)** - Production deployment, scaling, monitoring
- **[Security Guide](docs/security-guide.md)** - Security best practices, data protection, authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 15+ with pgvector extension
- Groq API key
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd studio42-main-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

For detailed setup instructions, see [Setup & Installation Guide](docs/setup-installation.md).

---

## 📋 Project Overview

### Core Features

- **Product Showcase**
  - Portfolio-style grid layout with product cards
  - Individual product pages with comprehensive information
  - Embedded videos (click-to-play, carousel for multiple)
  - Links to GitHub repositories and YouTube channels
  - Status badges (Available, Coming Soon, In Development)
  - Breadcrumb navigation

- **Universal Contact System**
  - Dynamic form population from URL parameters (`?source=`)
  - Contact form with all relevant fields
  - Form submission to database
  - Confirmation page after submission
  - Optional email notifications (admin configurable)
  - Admin dashboard for viewing all contacts

- **AI Assistant**
  - Floating chat widget (bottom-right corner)
  - Semantic search using pgvector
  - Knowledge base of all product information
  - Tool calling for form submission
  - Groq API integration with OpenAI-compatible format

- **Admin Dashboard**
  - Secure login (not linked from public pages)
  - Contact management table
  - Email configuration (enable/disable, SMTP settings)
  - View all form submissions

- **Additional Pages**
  - About Studio42 page
  - Blog/News section
  - Footer with social links
  - Legal pages (Privacy Policy, Terms of Service)

### Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Custom CSS (beyond Tailwind)
- **Backend:** Next.js API Routes, Node.js 20+
- **Database:** PostgreSQL 15+ with pgvector extension, Prisma ORM
- **AI:** Groq API (OpenAI-compatible, tool calling support)
- **Email:** SMTP (configurable, optional)
- **Authentication:** NextAuth.js or similar for admin
- **Testing:** Jest, React Testing Library, Playwright
- **Deployment:** Self-hosted on VM

### Initial Products

- **LMS** (lms.studio42.dev) - Almost complete
- **Placeholder Product 1** - Template for future products
- **Placeholder Product 2** - Template for future products

---

## 🎯 Implementation Stages

**See [Complete Implementation Stages Guide](docs/implementation-stages.md) for detailed step-by-step instructions.**

The project is divided into 11 implementation stages with no ambiguity:

1. **Stage 1:** Project Setup & Foundation (3-5 days)
   - Next.js initialization with exact configuration
   - Dependencies installation with specific versions
   - Project structure creation
   - Environment variables setup

2. **Stage 2:** Database Setup & Schema (2-3 days)
   - PostgreSQL setup with pgvector extension
   - Prisma schema implementation
   - Migrations and seed data

3. **Stage 3:** Design System & Styling (3-4 days)
   - Design tokens (CSS variables)
   - Global styles
   - Utility classes
   - No Tailwind CSS

4. **Stage 4:** Authentication System (2-3 days)
   - NextAuth.js setup
   - Admin login page
   - Protected routes

5. **Stage 5:** Product Showcase - Homepage Grid (4-5 days)
   - Products API route
   - ProductCard component
   - ProductGrid component
   - Homepage implementation

6. **Stage 6:** Product Pages (4-5 days)
   - Single product API route
   - All product page components
   - SEO metadata
   - Media carousel

7. **Stage 7:** Contact System (4-5 days)
   - Contact form component
   - Contact API route
   - Confirmation page
   - URL parameter handling

8. **Stage 8:** Admin Dashboard (5-6 days)
   - Contacts table
   - Filters and search
   - Contact details page
   - Statistics dashboard

9. **Stage 9:** AI Assistant (6-7 days)
   - Embedding generation
   - Knowledge base population
   - AI chat API route
   - Chat widget component

10. **Stage 10:** Email System (2-3 days)
    - Email service implementation
    - Email configuration admin page
    - Template system

11. **Stage 11:** Testing & Deployment (5-7 days)
    - Unit tests
    - Integration tests
    - E2E tests
    - Performance optimization
    - Production deployment

**Total Estimated Timeline:** 8-12 weeks

**Important:** Each stage has specific acceptance criteria that must be met before proceeding to the next stage.

---

## 📖 Documentation Structure

All documentation is organized in the `docs/` folder:

```
docs/
├── setup-installation.md          # Setup and installation
├── development-guide.md            # Development workflow and milestones
├── environment-variables.md        # ENV configuration
├── architecture.md                 # System architecture
├── database-schema.md              # Database design with pgvector
├── api-specifications.md           # API documentation
├── ui-ux-flows.md                  # User experience flows
├── implementation-details.md       # Code examples and patterns
├── component-library.md            # UI component specifications
├── decisions-patterns.md           # Architectural decisions
├── testing-guide.md                # Testing strategy
├── deployment-guide.md             # Production deployment
├── security-guide.md               # Security best practices
└── features/
    ├── product-showcase.md
    ├── contact-system.md
    ├── ai-assistant.md
    └── admin-dashboard.md
```

---

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed initial data
- `npm run db:reset` - Reset database and reseed
- `npm run test` - Run all tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run E2E tests

---

## 🧪 Testing

- **Coverage Target:** 90%+
- **Pass Rate:** 100%
- **Methodology:** Test-as-you-go per milestone
- **Types:** Unit tests, integration tests, E2E tests (Playwright)

See [Testing Guide](docs/testing-guide.md) for details.

---

## 📝 License

**To be determined** - Will be specified before public release

---

## 🤝 Contributing

**Contributing guidelines to be added** - Project is currently in planning phase

---

## Status

**Current Phase:** Planning & Documentation

**Completed:**
- ✅ Project requirements gathering
- ✅ Technology stack decisions
- ✅ Feature specifications

**In Progress:**
- 🔄 Project documentation creation

**Next Steps:**
1. ✅ All documentation files complete
2. Begin Stage 1: Project Setup & Foundation (see [Implementation Stages](docs/implementation-stages.md))
3. Follow stages sequentially
4. Complete all acceptance criteria before moving to next stage

**Blockers:**
- None currently

**Version:** 0.1.0 (Planning Phase)  
**Last Updated:** 2025-01-XX

---

## Resources & References

**Documentation:**
- [Next.js 16 Documentation](https://nextjs.org/docs) - Framework documentation
- [Prisma Documentation](https://www.prisma.io/docs) - ORM documentation
- [pgvector Documentation](https://github.com/pgvector/pgvector) - Vector similarity search
- [Groq API Documentation](https://console.groq.com/docs) - AI API integration
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication

**Design Inspiration:**
- Premium SaaS landing pages (Vercel, Linear, Stripe)
- Modern portfolio websites
- High-end product showcase sites

**Research:**
- Semantic search implementation patterns
- OpenAI-compatible tool calling
- Vector embedding strategies
- Email configuration best practices

---

## Notes

**Design Philosophy:**
- Top-of-class visual design that stands out
- Custom styling beyond standard Tailwind
- Premium feel that reflects quality of products
- Responsive and accessible

**Future Considerations:**
- Additional products as they're completed
- Blog content management system
- Analytics and tracking integration
- A/B testing for conversion optimization
- Multi-language support

---

## Related Projects

- [AI Microlearning LMS](../ai-microlearning-lms/ai-microlearning-lms.md) - One of the products to be showcased
- Future SaaS products will be added as they're completed

---

**Status:** Planning  
**Version:** 0.1.0  
**Last Updated:** 2025-01-XX

