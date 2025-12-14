# Implementation Stages

Complete step-by-step implementation guide with no ambiguity. Every decision is specified.

## Overview

This document provides a complete, phase-by-phase implementation plan. Each stage includes:
- Exact tasks to complete
- Specific files to create
- Code examples where needed
- Acceptance criteria
- Dependencies between stages

**Total Stages:** 11 stages
**Estimated Timeline:** 8-12 weeks (depending on team size)

---

## Stage 1: Project Setup & Foundation

### Duration: 3-5 days

### Tasks

#### 1.1 Initialize Next.js Project
**Command:**
```bash
npx create-next-app@latest studio42-main-website --typescript --tailwind=false --app --no-src-dir --import-alias "@/*"
cd studio42-main-website
```

**Exact Configuration:**
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: No (we use custom CSS)
- App Router: Yes
- src/ directory: No (files in root)
- Import alias: `@/*` points to project root

**Files Created:**
- `package.json` (auto-generated)
- `tsconfig.json` (auto-generated)
- `next.config.js` (create manually)
- `.eslintrc.json` (auto-generated)

#### 1.2 Install Dependencies
**Exact Commands:**
```bash
npm install prisma @prisma/client
npm install zod react-hook-form @hookform/resolvers
npm install groq-sdk openai
npm install next-auth@beta
npm install nodemailer
npm install bcryptjs
npm install @types/bcryptjs --save-dev
npm install date-fns
```

**Version Specifications:**
- `prisma`: ^5.7.0
- `@prisma/client`: ^5.7.0
- `zod`: ^3.22.4
- `react-hook-form`: ^7.48.2
- `groq-sdk`: Latest (check npm for current version)
- `openai`: ^4.20.0
- `next-auth`: ^5.0.0-beta.4 (or latest beta)
- `nodemailer`: ^6.9.7
- `bcryptjs`: ^2.4.3
- `date-fns`: ^2.30.0

#### 1.3 Project Structure
**Create Exact Directory Structure:**
```
studio42-main-website/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── confirmation/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── blog/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── contacts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── email-config/
│   │       └── page.tsx
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       └── route.ts
│   │   ├── contacts/
│   │   │   └── route.ts
│   │   ├── admin/
│   │   │   ├── contacts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── email-config/
│   │   │       └── route.ts
│   │   └── ai/
│   │       └── chat/
│   │           └── route.ts
│   └── layout.tsx
├── components/
│   ├── products/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductPage.tsx
│   │   ├── ProductHero.tsx
│   │   ├── ProductOverview.tsx
│   │   ├── ProductFeatures.tsx
│   │   ├── ProductMedia.tsx
│   │   ├── ProductLinks.tsx
│   │   ├── ProductPricing.tsx
│   │   ├── ProductCTA.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ProductSkeleton.tsx
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   └── ContactConfirmation.tsx
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── ContactsTable.tsx
│   │   ├── ContactFilters.tsx
│   │   ├── ContactDetails.tsx
│   │   └── EmailConfigForm.tsx
│   ├── ai/
│   │   └── ChatWidget.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Breadcrumb.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── email.ts
│   ├── rate-limit.ts
│   ├── embeddings.ts
│   └── groq.ts
├── styles/
│   ├── globals.css
│   ├── design-tokens.css
│   └── utilities.css
├── types/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── tsconfig.json
└── package.json
```

#### 1.4 Environment Variables Setup
**Create `.env.example`:**
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
```

**Create `.env.local`** (gitignored, copy from `.env.example` and fill in)

#### 1.5 Next.js Configuration
**File: `next.config.js`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
```

#### 1.6 TypeScript Configuration
**File: `tsconfig.json`** (update from default)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Acceptance Criteria
- [ ] Next.js project initialized with exact configuration
- [ ] All dependencies installed with specified versions
- [ ] Directory structure created exactly as specified
- [ ] Environment variables file created
- [ ] Next.js and TypeScript configured
- [ ] Project runs with `npm run dev` without errors

### Dependencies
- None (first stage)

---

## Stage 2: Database Setup & Schema

### Duration: 2-3 days

### Tasks

#### 2.1 PostgreSQL Setup
**Exact Commands:**
```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install pgvector extension
sudo apt install postgresql-15-pgvector
# OR from source (see setup-installation.md)

# Create database
sudo -u postgres psql
CREATE DATABASE studio42_website;
CREATE USER studio42_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE studio42_website TO studio42_user;
\c studio42_website
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

#### 2.2 Prisma Setup
**Initialize Prisma:**
```bash
npx prisma init
```

**File: `prisma/schema.prisma`** (Complete schema - see database-schema.md for full details)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Copy complete schema from database-schema.md
// Include all models: Product, ProductMedia, Contact, EmailConfig, KnowledgeBase, Admin
```

#### 2.3 Run Migrations
**Commands:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 2.4 Create Vector Index
**SQL Command (run manually):**
```sql
CREATE INDEX knowledge_base_embedding_idx 
ON knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

#### 2.5 Prisma Client Setup
**File: `lib/prisma.ts`**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 2.6 Seed Database
**File: `prisma/seed.ts`**
```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@studio42.dev' },
    update: {},
    create: {
      email: 'admin@studio42.dev',
      passwordHash: hashedPassword,
      name: 'Admin User',
    },
  });

  // Create email config (disabled by default)
  await prisma.emailConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      enabled: false,
    },
  });

  // Create sample products
  const lms = await prisma.product.upsert({
    where: { slug: 'lms' },
    update: {},
    create: {
      slug: 'lms',
      name: 'AI Microlearning LMS',
      tagline: 'Intelligent learning management system',
      description: 'A comprehensive learning management system with AI-powered content recommendations, microlearning modules, and analytics.',
      status: 'AVAILABLE',
      thumbnail: '/images/lms-thumbnail.jpg',
      githubUrl: 'https://github.com/studio42/lms',
      youtubeUrl: 'https://youtube.com/@studio42',
      demoUrl: 'https://lms.studio42.dev',
      pricing: 'Starting at $99/month',
      features: [
        { title: 'AI-Powered', description: 'Intelligent content recommendations' },
        { title: 'Microlearning', description: 'Bite-sized learning modules' },
        { title: 'Analytics', description: 'Comprehensive progress tracking' },
      ],
    },
  });

  // Create placeholder products
  await prisma.product.createMany({
    data: [
      {
        slug: 'product-1',
        name: 'Product 1',
        tagline: 'Placeholder product',
        description: 'This is a placeholder product for demonstration purposes.',
        status: 'IN_DEVELOPMENT',
      },
      {
        slug: 'product-2',
        name: 'Product 2',
        tagline: 'Placeholder product',
        description: 'This is a placeholder product for demonstration purposes.',
        status: 'COMING_SOON',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update `package.json`:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npm install -D ts-node
npx prisma db seed
```

### Acceptance Criteria
- [ ] PostgreSQL database created
- [ ] pgvector extension installed and enabled
- [ ] Prisma schema matches database-schema.md exactly
- [ ] Migrations run successfully
- [ ] Vector index created
- [ ] Prisma client generated
- [ ] Seed script runs and creates initial data
- [ ] Admin user can be created and logged in

### Dependencies
- Stage 1 complete

---

## Stage 3: Design System & Styling

### Duration: 3-4 days

### Tasks

#### 3.1 Design Tokens
**File: `styles/design-tokens.css`**
```css
:root {
  /* Colors - Primary */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;
  
  /* Colors - Secondary */
  --color-secondary: #8b5cf6;
  --color-secondary-dark: #7c3aed;
  
  /* Colors - Text */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  
  /* Colors - Background */
  --color-background: #ffffff;
  --color-background-secondary: #f9fafb;
  --color-background-tertiary: #f3f4f6;
  
  /* Colors - Status */
  --color-status-available: #10b981;
  --color-status-available-bg: #d1fae5;
  --color-status-coming-soon: #f59e0b;
  --color-status-coming-soon-bg: #fef3c7;
  --color-status-in-development: #6366f1;
  --color-status-in-development-bg: #e0e7ff;
  
  /* Colors - Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Spacing - Base unit: 4px */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 80px;
  --spacing-5xl: 96px;
  
  /* Typography - Font Family */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Typography - Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  --font-size-5xl: 48px;
  --font-size-6xl: 64px;
  
  /* Typography - Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Typography - Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --line-height-loose: 1.7;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  --transition-bounce: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-Index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-chat-widget: 9999;
}
```

#### 3.2 Global Styles
**File: `styles/globals.css`**
```css
@import './design-tokens.css';

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-text-tertiary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
```

#### 3.3 Utility Classes
**File: `styles/utilities.css`**
```css
/* Container */
.container {
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
  }
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus ring */
.focus-ring {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### 3.4 Import Styles in Layout
**File: `app/layout.tsx`**
```typescript
import '../styles/globals.css';
import '../styles/utilities.css';
```

### Acceptance Criteria
- [ ] Design tokens file created with all specified variables
- [ ] Global styles applied
- [ ] Utility classes created
- [ ] Styles imported in root layout
- [ ] No Tailwind CSS classes used
- [ ] All color/spacing values use CSS variables

### Dependencies
- Stage 1 complete

---

## Stage 4: Authentication System

### Duration: 2-3 days

### Tasks

#### 4.1 NextAuth.js Setup
**File: `lib/auth.ts`**
```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        if (!isValid) {
          return null;
        }

        // Update last login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

**File: `app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

#### 4.2 Admin Login Page
**File: `app/admin/login/page.tsx`**
```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields */}
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### 4.3 Admin Layout with Auth
**File: `app/admin/layout.tsx`**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      {/* Admin header/navigation */}
      {children}
    </div>
  );
}
```

### Acceptance Criteria
- [ ] NextAuth.js configured with credentials provider
- [ ] Admin login page created
- [ ] Password hashing works correctly
- [ ] Session management works
- [ ] Admin layout protects routes
- [ ] Login redirects to dashboard on success
- [ ] Error handling works

### Dependencies
- Stage 2 complete (database)

---

## Stage 5: Product Showcase - Homepage Grid

### Duration: 4-5 days

### Tasks

#### 5.1 Products API Route
**File: `app/api/products/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        description: true,
        status: true,
        thumbnail: true,
        githubUrl: true,
        youtubeUrl: true,
        demoUrl: true,
        pricing: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          status: 'asc', // AVAILABLE first
        },
        {
          name: 'asc',
        },
      ],
    });

    // Truncate descriptions
    const productsWithTruncatedDescriptions = products.map((product) => ({
      ...product,
      description:
        product.description.length > 150
          ? `${product.description.substring(0, 150)}...`
          : product.description,
    }));

    return NextResponse.json(
      { products: productsWithTruncatedDescriptions },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

#### 5.2 ProductCard Component
**File: `components/products/ProductCard.tsx`** (See product-showcase.md for complete implementation)

#### 5.3 ProductGrid Component
**File: `components/products/ProductGrid.tsx`**
```typescript
import { Product } from '@/types';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No products available at this time.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 5.4 Homepage Implementation
**File: `app/(public)/page.tsx`**
```typescript
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      description: true,
      status: true,
      thumbnail: true,
      githubUrl: true,
      youtubeUrl: true,
      demoUrl: true,
      pricing: true,
    },
    orderBy: [
      { status: 'asc' },
      { name: 'asc' },
    ],
  });

  const productsWithTruncatedDescriptions = products.map((product) => ({
    ...product,
    description:
      product.description.length > 150
        ? `${product.description.substring(0, 150)}...`
        : product.description,
  }));

  return (
    <main>
      <section className="hero-section">
        <h1>Studio42.dev</h1>
        <p>Premium SaaS Products</p>
      </section>
      
      <section className="products-section">
        <h2>Our Products</h2>
        <ProductGrid products={productsWithTruncatedDescriptions} />
      </section>
    </main>
  );
}
```

### Acceptance Criteria
- [ ] Products API returns all products with correct data
- [ ] ProductCard component matches design specs exactly
- [ ] ProductGrid displays products in correct layout
- [ ] Responsive design works (1/2/3 columns)
- [ ] Hover effects work
- [ ] Loading states (skeleton) work
- [ ] Links navigate correctly
- [ ] Status badges display correctly

### Dependencies
- Stage 2 complete (database)
- Stage 3 complete (styling)

---

## Stage 6: Product Pages

### Duration: 4-5 days

### Tasks

#### 6.1 Product API Route (Single)
**File: `app/api/products/[slug]/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse features if string
    const features =
      typeof product.features === 'string'
        ? JSON.parse(product.features)
        : product.features;

    return NextResponse.json(
      {
        product: {
          ...product,
          features,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
```

#### 6.2 Product Page Components
Create all product page components as specified in product-showcase.md:
- ProductHero.tsx
- ProductOverview.tsx
- ProductFeatures.tsx
- ProductMedia.tsx
- ProductLinks.tsx
- ProductPricing.tsx
- ProductCTA.tsx

#### 6.3 Product Page Implementation
**File: `app/(public)/products/[slug]/page.tsx`**
```typescript
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductPageContent from '@/components/products/ProductPageContent';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      tagline: true,
      description: true,
      thumbnail: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found - Studio42.dev',
    };
  }

  return {
    title: `${product.name} - Studio42.dev`,
    description: product.tagline || product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.tagline || product.description.substring(0, 160),
      images: product.thumbnail ? [product.thumbnail] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const features =
    typeof product.features === 'string'
      ? JSON.parse(product.features)
      : product.features;

  return (
    <ProductPageContent
      product={{
        ...product,
        features,
      }}
    />
  );
}
```

### Acceptance Criteria
- [ ] Product page loads with correct data
- [ ] All sections display correctly
- [ ] Media carousel works
- [ ] Videos play when clicked
- [ ] Links work correctly
- [ ] Breadcrumb navigation works
- [ ] 404 page for invalid slugs
- [ ] SEO metadata correct
- [ ] Responsive design works

### Dependencies
- Stage 5 complete

---

## Stage 7: Contact System

### Duration: 4-5 days

### Tasks

#### 7.1 Contact Form Component
**File: `components/contact/ContactForm.tsx`** (See contact-system.md for complete implementation)

#### 7.2 Contact API Route
**File: `app/api/contacts/route.ts`** (See contact-system.md for complete implementation)

#### 7.3 Contact Page
**File: `app/(public)/contact/page.tsx`**
```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Have a question? We'd love to hear from you.</p>
      <ContactForm source={source} />
    </div>
  );
}
```

#### 7.4 Confirmation Page
**File: `app/(public)/contact/confirmation/page.tsx`**
```typescript
import ContactConfirmation from '@/components/contact/ContactConfirmation';

export default function ContactConfirmationPage() {
  return <ContactConfirmation />;
}
```

### Acceptance Criteria
- [ ] Contact form displays correctly
- [ ] URL parameter pre-populates product field
- [ ] Form validation works
- [ ] Form submission works
- [ ] Confirmation page displays
- [ ] Email notifications work (if enabled)
- [ ] Error handling works

### Dependencies
- Stage 2 complete (database)
- Stage 4 complete (auth, for admin viewing)

---

## Stage 8: Admin Dashboard

### Duration: 5-6 days

### Tasks

#### 8.1 Contacts Table Component
**File: `components/admin/ContactsTable.tsx`** (See admin-dashboard.md for specs)

#### 8.2 Contacts API Routes
**File: `app/api/admin/contacts/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const read = searchParams.get('read');
  const product = searchParams.get('product');
  const search = searchParams.get('search');

  const where: any = {};
  if (read === 'true') where.read = true;
  if (read === 'false') where.read = false;
  if (product) where.product = product;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

#### 8.3 Admin Dashboard Pages
- `/admin/dashboard/page.tsx` - Overview with statistics
- `/admin/contacts/page.tsx` - Contacts list
- `/admin/contacts/[id]/page.tsx` - Contact details
- `/admin/email-config/page.tsx` - Email configuration

### Acceptance Criteria
- [ ] Admin can view all contacts
- [ ] Filters work correctly
- [ ] Search works
- [ ] Pagination works
- [ ] Contact details page works
- [ ] Mark as read/responded works
- [ ] Statistics display correctly

### Dependencies
- Stage 4 complete (auth)
- Stage 7 complete (contacts)

---

## Stage 9: AI Assistant

### Duration: 6-7 days

### Tasks

#### 9.1 Embedding Generation
**File: `lib/embeddings.ts`**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}
```

#### 9.2 Knowledge Base Population Script
**File: `scripts/populate-knowledge-base.ts`**
```typescript
import { prisma } from '../lib/prisma';
import { generateEmbedding } from '../lib/embeddings';

async function populateKnowledgeBase() {
  // Get all products
  const products = await prisma.product.findMany();

  for (const product of products) {
    const content = `${product.name}\n\n${product.description}\n\nFeatures: ${JSON.stringify(product.features)}`;
    const embedding = await generateEmbedding(content);

    await prisma.knowledgeBase.upsert({
      where: { id: `product-${product.slug}` },
      update: {
        title: product.name,
        content,
        category: 'product',
        productSlug: product.slug,
        embedding: embedding as any,
      },
      create: {
        id: `product-${product.slug}`,
        title: product.name,
        content,
        category: 'product',
        productSlug: product.slug,
        embedding: embedding as any,
      },
    });
  }
}

populateKnowledgeBase();
```

#### 9.3 AI Chat API Route
**File: `app/api/ai/chat/route.ts`** (See ai-assistant.md for complete implementation)

#### 9.4 Chat Widget Component
**File: `components/ai/ChatWidget.tsx`** (See ai-assistant.md for complete implementation)

### Acceptance Criteria
- [ ] Chat widget appears on all pages
- [ ] AI responds to questions
- [ ] Semantic search works
- [ ] Tool calling works
- [ ] Form submission via AI works
- [ ] Knowledge base populated
- [ ] Error handling works

### Dependencies
- Stage 2 complete (database with pgvector)
- Stage 7 complete (contact form)

---

## Stage 10: Email System

### Duration: 2-3 days

### Tasks

#### 10.1 Email Service
**File: `lib/email.ts`**
```typescript
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export async function sendEmail({
  to,
  subject,
  template,
  variables,
}: {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
}) {
  const emailConfig = await prisma.emailConfig.findFirst();

  if (!emailConfig?.enabled) {
    throw new Error('Email is not enabled');
  }

  // Replace template variables
  let body = template;
  Object.entries(variables).forEach(([key, value]) => {
    body = body.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  });

  const transporter = nodemailer.createTransport({
    host: emailConfig.smtpHost,
    port: emailConfig.smtpPort,
    secure: emailConfig.smtpSecure,
    auth: {
      user: emailConfig.smtpUser,
      pass: emailConfig.smtpPassword,
    },
  });

  await transporter.sendMail({
    from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
    to,
    subject,
    html: body,
  });
}
```

#### 10.2 Email Configuration Admin Page
**File: `app/admin/email-config/page.tsx`** (See admin-dashboard.md for specs)

### Acceptance Criteria
- [ ] Email configuration page works
- [ ] SMTP settings save correctly
- [ ] Test email sends
- [ ] User confirmation emails send
- [ ] Admin notification emails send
- [ ] Template variables work

### Dependencies
- Stage 4 complete (auth)
- Stage 7 complete (contacts)

---

## Stage 11: Testing & Deployment

### Duration: 5-7 days

### Tasks

#### 11.1 Unit Tests
- Test all API routes
- Test utility functions
- Test validation schemas

#### 11.2 Integration Tests
- Test form submissions
- Test authentication flow
- Test email sending

#### 11.3 E2E Tests (Playwright)
- Test user journeys
- Test admin workflows
- Test AI assistant

#### 11.4 Performance Optimization
- Image optimization
- Code splitting
- Caching strategies

#### 11.5 Deployment
- Production build
- Environment setup
- Database migration
- SSL certificate
- Domain configuration

### Acceptance Criteria
- [ ] 90%+ test coverage
- [ ] All tests pass
- [ ] Performance targets met
- [ ] Production deployment successful
- [ ] All features work in production

### Dependencies
- All previous stages complete

---

## Implementation Checklist

Track progress through each stage:

- [ ] Stage 1: Project Setup & Foundation
- [ ] Stage 2: Database Setup & Schema
- [ ] Stage 3: Design System & Styling
- [ ] Stage 4: Authentication System
- [ ] Stage 5: Product Showcase - Homepage Grid
- [ ] Stage 6: Product Pages
- [ ] Stage 7: Contact System
- [ ] Stage 8: Admin Dashboard
- [ ] Stage 9: AI Assistant
- [ ] Stage 10: Email System
- [ ] Stage 11: Testing & Deployment

---

## Notes

- Each stage must be completed before moving to the next
- All acceptance criteria must be met
- Code must match specifications exactly
- No shortcuts or "good enough" implementations
- Test as you go, don't wait until Stage 11

