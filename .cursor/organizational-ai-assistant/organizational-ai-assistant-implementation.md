# Organizational AI Assistant - Implementation & Build Plan

**Complete implementation guide, development setup, coding patterns, deployment strategy, and testing requirements.**

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Setup](#development-setup)
3. [Database Setup](#database-setup)
4. [Development Phases](#development-phases)
5. [Coding Patterns & Conventions](#coding-patterns--conventions)
6. [Authentication Implementation](#authentication-implementation)
7. [AI Integration Implementation](#ai-integration-implementation)
8. [Email Integration Implementation](#email-integration-implementation)
9. [File Processing Implementation](#file-processing-implementation)
10. [Semantic Search Implementation](#semantic-search-implementation)
11. [Cost Tracking Implementation](#cost-tracking-implementation)
12. [Error Handling & Retry Logic](#error-handling--retry-logic)
13. [Web Search Implementation](#web-search-implementation)
14. [Rate Limiting Implementation](#rate-limiting-implementation)
15. [Testing Strategy](#testing-strategy)
16. [Deployment Strategy](#deployment-strategy)
17. [Performance Optimization](#performance-optimization)

## Project Structure

```
organizational-ai-assistant/
├── .env.local                    # Local environment variables
├── .env.example                  # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── prisma/
│   ├── schema.prisma            # Prisma schema
│   └── migrations/               # Database migrations
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── sso/
│   │   │   │   └── callback/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [conversationId]/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── emails/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── files/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── email/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── preferences/
│   │   │   │       └── page.tsx
│   │   │   ├── admin/            # Admin-only routes
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── departments/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── sso/
│   │   │   │   │   ├── initiate/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── callback/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── ldap/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── refresh/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── chat/
│   │   │   │   ├── conversations/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       └── messages/
│   │   │   │   │           ├── route.ts
│   │   │   │   │           └── [messageId]/
│   │   │   │   │               └── correct/
│   │   │   │   │                   └── route.ts
│   │   │   │   └── stream/
│   │   │   │       └── route.ts
│   │   │   ├── emails/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── send/
│   │   │   │   │   └── route.ts
│   │   │   │   └── accounts/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts
│   │   │   ├── files/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── download/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── save/
│   │   │   │   │       └── route.ts
│   │   │   │   └── upload/
│   │   │   │       └── route.ts
│   │   │   ├── calendar/
│   │   │   │   ├── events/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── accounts/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts
│   │   │   ├── search/
│   │   │   │   ├── route.ts
│   │   │   │   └── semantic/
│   │   │   │       └── route.ts
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── departments/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── settings/
│   │   │   │       └── route.ts
│   │   │   └── notifications/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── read/
│   │   │               └── route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── ToolCallIndicator.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RecentFiles.tsx
│   │   │   └── ProactiveReminders.tsx
│   │   ├── email/
│   │   │   ├── EmailList.tsx
│   │   │   ├── EmailView.tsx
│   │   │   └── EmailComposer.tsx
│   │   └── admin/
│   │       ├── UserManagement.tsx
│   │       └── DepartmentManagement.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── prisma.ts         # Prisma client
│   │   │   └── rls.ts            # RLS helper functions
│   │   ├── auth/
│   │   │   ├── jwt.ts            # JWT utilities
│   │   │   ├── sso.ts            # SSO integration
│   │   │   └── ldap.ts           # LDAP integration
│   │   ├── ai/
│   │   │   ├── openai.ts         # OpenAI client
│   │   │   ├── tools.ts          # Tool definitions
│   │   │   ├── embeddings.ts     # Embedding generation
│   │   │   └── context.ts        # Context management
│   │   ├── email/
│   │   │   ├── microsoft.ts      # Microsoft Graph API
│   │   │   ├── google.ts         # Gmail API
│   │   │   └── imap.ts           # IMAP client
│   │   ├── calendar/
│   │   │   ├── microsoft.ts      # Microsoft Graph Calendar
│   │   │   └── google.ts         # Google Calendar API
│   │   ├── file-processing/
│   │   │   ├── extractors.ts     # File content extractors
│   │   │   └── storage.ts        # File storage utilities
│   │   ├── search/
│   │   │   ├── semantic.ts       # Semantic search
│   │   │   └── keyword.ts        # Keyword search
│   │   ├── audit/
│   │   │   └── logger.ts         # Audit logging
│   │   └── utils/
│   │       ├── permissions.ts    # Permission checking
│   │       └── validation.ts     # Zod schemas
│   ├── types/
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── email.ts
│   │   ├── file.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useWebSocket.ts
│   │   └── ...
│   ├── middleware.ts             # Next.js middleware (auth, permissions)
│   └── server/
│       ├── websocket.ts          # WebSocket server
│       └── workers/
│           ├── email-sync.ts     # Email polling worker
│           ├── embedding.ts      # Embedding generation worker
│           └── notifications.ts  # Notification worker
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
│   ├── setup-db.ts
│   └── seed.ts
└── README.md
```

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pgvector extension
- Git

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd organizational-ai-assistant

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up environment variables (see .env.example)
# - DATABASE_URL
# - OPENAI_API_KEY
# - JWT_SECRET
# - LDAP configuration (if using)
# - SSO configuration (if using)
# - Email provider credentials

# Set up database
npm run db:setup

# Run migrations
npm run db:migrate

# Seed database (development only)
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/org_ai?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="3d"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.1-mini" # or "gpt-5.1-nano"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# Application
NODE_ENV="development"
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File Storage
FILE_STORAGE_PATH="./storage/files"

# Email/Calendar (OAuth)
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
MICROSOFT_TENANT_ID="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Web Search (Tavily API - recommended)
TAVILY_API_KEY="tvly-..."

# Alternative Web Search Providers
SERPAPI_KEY="..." # SerpAPI (alternative to Tavily)

# LDAP (optional)
LDAP_URL="ldap://ldap.example.com"
LDAP_BASE_DN="dc=example,dc=com"
LDAP_BIND_DN="cn=admin,dc=example,dc=com"
LDAP_BIND_PASSWORD="..."

# SSO (optional)
SSO_PROVIDER="microsoft" # or "google", "saml"
SAML_ENTRY_POINT="..."
SAML_CERT="..."

# Web Search
WEB_SEARCH_ENABLED=true

# Background Jobs (optional - if using Redis)
REDIS_URL="redis://localhost:6379"
```

## Database Setup

### Prisma Schema

See `prisma/schema.prisma` for complete schema. Key points:

1. **Enable pgvector:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add pgvector extension
// Run: CREATE EXTENSION IF NOT EXISTS vector;
```

2. **Vector type for embeddings:**
```prisma
model Embedding {
  id           String   @id @default(uuid())
  embedding    Unsupported("vector(1536)") // pgvector type
  // ... other fields
}
```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Create migration
npm run db:migrate:create --name migration_name

# Apply migrations
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Studio (database GUI)
npm run db:studio
```

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup and structure
- [ ] Database schema and migrations
- [ ] Authentication (JWT, basic auth)
- [ ] Basic UI layout (Tailwind, Heroicons)
- [ ] User management (CRUD)
- [ ] Department management
- [ ] Permission system (RBAC)

**Testing:** 90% coverage required, 100% passing

### Phase 2: Core Features (Weeks 3-4)
- [ ] Email integration (Microsoft Graph, Gmail)
- [ ] Calendar integration
- [ ] Basic chat interface
- [ ] OpenAI integration (chat only, no tools yet)
- [ ] File upload and storage
- [ ] Basic search (keyword only)

**Testing:** 90% coverage required, 100% passing

### Phase 3: AI & Search (Weeks 5-6)
- [ ] Semantic search implementation (pgvector)
- [ ] Embedding generation pipeline
- [ ] File processing (PDF, Word, Excel, etc.)
- [ ] OpenAI tools implementation
- [ ] Context management and summarization
- [ ] Tool execution engine

**Testing:** 90% coverage required, 100% passing

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Proactive reminders
- [ ] Team relay functionality
- [ ] Web search integration
- [ ] Advanced chat features (streaming, tool calls)
- [ ] Email sending via AI
- [ ] Calendar event creation via AI

**Testing:** 90% coverage required, 100% passing

### Phase 5: Polish & Admin (Weeks 9-10)
- [ ] Admin interface
- [ ] Dashboard implementation
- [ ] Notification system
- [ ] Audit logging
- [ ] SSO/LDAP integration
- [ ] Settings and preferences
- [ ] Data retention policies

**Testing:** 90% coverage required, 100% passing

### Phase 6: Testing & Deployment (Week 11-12)
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deployment setup
- [ ] Production deployment

**Testing:** 90% coverage required, 100% passing

## Coding Patterns & Conventions

### TypeScript

- **Strict mode:** Enabled
- **Type safety:** All functions typed, avoid `any`
- **Interfaces:** Define interfaces for all data structures
- **Enums:** Use for constants (roles, statuses, etc.)

### API Routes

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth/jwt';
import { checkPermission } from '@/lib/utils/permissions';
import { auditLog } from '@/lib/audit/logger';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await authenticate(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check permissions
    const hasPermission = await checkPermission(user, 'resource', 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Set RLS context
    await setRLSContext(user.id);

    // 4. Execute business logic
    const data = await getData();

    // 5. Audit log
    await auditLog({
      userId: user.id,
      actionType: 'resource_read',
      resourceType: 'example',
    });

    // 6. Return response
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Queries (Prisma with RLS)

```typescript
// Always set user context before queries
import { setRLSContext } from '@/lib/db/rls';
import { prisma } from '@/lib/db/prisma';

async function getEmails(userId: string) {
  // Set RLS context
  await setRLSContext(userId);

  // Query - RLS policies automatically filter
  const emails = await prisma.email.findMany({
    where: {
      unread: true,
    },
    orderBy: {
      receivedAt: 'desc',
    },
    take: 20,
  });

  return emails;
}
```

### AI Tool Definitions

```typescript
// src/lib/ai/tools.ts
export const tools = [
  {
    type: 'function',
    function: {
      name: 'search_emails',
      description: 'Search user\'s emails',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 10 },
        },
        required: ['query'],
      },
    },
  },
  // ... more tools
];

// Tool execution
export async function executeTool(
  toolName: string,
  arguments: any,
  userId: string,
  departmentIds: string[]
) {
  // Check permissions
  // Execute tool
  // Return result
  // Log to audit
}
```

### Component Patterns

```typescript
// Server Component (default)
// src/app/dashboard/page.tsx
import { authenticate } from '@/lib/auth/jwt';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default async function DashboardPage() {
  const user = await authenticate();
  // Fetch data server-side
  const data = await getDashboardData(user.id);
  
  return <Dashboard user={user} data={data} />;
}

// Client Component (when needed)
// src/components/chat/ChatInterface.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat();
  // Client-side interactivity
  return (/* ... */);
}
```

## Authentication Implementation

### JWT Implementation

```typescript
// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

export function generateToken(userId: string, payload: object) {
  return jwt.sign(
    { userId, ...payload },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}
```

### Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  // Check auth
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = verifyToken(token);
    // Add user to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

## AI Integration Implementation

### API Choice and Rationale

**Using Chat Completions API with Function Calling**

**Why This Approach:**
- **Direct Control:** Full control over tool execution, permissions, and error handling
- **Custom Tools:** Easy to implement organizational-specific tools (email, calendar, files)
- **Real-time:** Lower latency for chat interface
- **Flexible:** Can modify behavior per request based on user context
- **Cost-effective:** Pay per request, no assistant storage overhead

**Not Using:**
- **Assistants API:** Less control, built-in tools don't fit our needs, harder permissions
- **Codex CLI:** Terminal tool, not a library, requires ChatGPT Plus accounts
- **Third-party frameworks:** Direct OpenAI SDK gives us full control

**Best Practices:**
- Use official `openai` npm package (not third-party wrappers)
- Implement tool execution with proper error handling
- Track all API usage for cost management
- Implement retry logic with exponential backoff
- Cache tool definitions (they don't change often)

### OpenAI Client

```typescript
// src/lib/ai/openai.ts
import OpenAI from 'openai';
import { trackAPICall, checkUsageLimit } from './cost-tracking';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatCompletionOptions {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  toolChoice?: 'auto' | 'required' | 'none' | { type: 'function'; function: { name: string } };
  userId: string;
  departmentId: string;
  organizationId: string;
  systemPrompt?: string;
}

export async function chatCompletion(options: ChatCompletionOptions) {
  const { messages, tools = [], toolChoice = 'auto', userId, departmentId, organizationId, systemPrompt } = options;

  // Check usage limits
  const tokenLimit = await checkUsageLimit(userId, departmentId, organizationId, 'daily_tokens');
  if (!tokenLimit.allowed) {
    throw new Error(`Daily token limit exceeded. Limit: ${tokenLimit.limit}, Remaining: ${tokenLimit.remaining}`);
  }

  const model = process.env.OPENAI_MODEL || 'gpt-5.1-mini';

  // Add system prompt if provided
  const fullMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: fullMessages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: toolChoice,
      temperature: 0.7,
      max_tokens: 4000, // Adjust based on model limits
    });

    // Track usage
    const inputTokens = response.usage?.prompt_tokens || 0;
    const outputTokens = response.usage?.completion_tokens || 0;

    await trackAPICall(
      userId,
      departmentId,
      organizationId,
      model,
      inputTokens,
      outputTokens,
      'chat',
      {
        tool_calls: response.choices[0]?.message?.tool_calls?.length || 0,
        has_content: response.choices[0]?.message?.content !== null,
      }
    );

    return response;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Track failed call (for monitoring) but don't charge
    await auditLog({
      userId,
      actionType: 'openai_api_error',
      details: { error: error.message, model },
    });
    
    throw error;
  }
}

export async function generateEmbedding(
  text: string,
  context?: { userId?: string; departmentId?: string; organizationId?: string }
) {
  const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

  try {
    const response = await openai.embeddings.create({
      model,
      input: text,
    });

    const embedding = response.data[0].embedding;

    // Track usage if context provided
    if (context?.userId && context.departmentId && context.organizationId) {
      const tokens = Math.ceil(text.length / 4); // Rough token estimate (4 chars ≈ 1 token)
      
      await trackAPICall(
        context.userId,
        context.departmentId,
        context.organizationId,
        model,
        tokens,
        0, // No output tokens for embeddings
        'embedding',
        {}
      );
    }

    return embedding;
  } catch (error: any) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

/**
 * Build system prompt with user context and available tools information
 */
function buildSystemPrompt(
  userId: string,
  departmentIds: string[],
  context?: { recentMessages?: any[]; semanticResults?: any[] }
): string {
  const parts = [
    "You are a helpful AI assistant with access to organizational information.",
    "You can search emails, files, calendars, and send emails or create calendar events on behalf of users.",
    `The user belongs to ${departmentIds.length} department(s). Only access information from these departments.`,
  ];

  if (context?.semanticResults && context.semanticResults.length > 0) {
    parts.push("\nRelevant context from user's data:");
    context.semanticResults.forEach((result, idx) => {
      parts.push(`\n[${idx + 1}] ${result.title}: ${result.preview}`);
    });
  }

  parts.push(
    "\nWhen you need information, use the available tools to search and retrieve it.",
    "Be proactive - if you notice unread emails or missed items, mention them.",
    "Always respect department boundaries - never access data outside the user's departments."
  );

  return parts.join(' ');
}

### Tool Definition Helper

**Best Practice:** Create a helper to build tool definitions consistently

```typescript
// src/lib/ai/tool-builder.ts
import { OpenAI } from 'openai';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Build OpenAI tool definition from our tool schema
 * Ensures consistent format and validation
 */
export function buildToolDefinition(tool: ToolDefinition): OpenAI.Chat.Completions.ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}

/**
 * Build array of tool definitions for OpenAI API
 * Filters tools based on user permissions
 */
export async function buildAvailableTools(
  userId: string,
  departmentIds: string[]
): Promise<OpenAI.Chat.Completions.ChatCompletionTool[]> {
  const allTools = [
    // Search tools
    {
      name: 'search_emails',
      description: 'Search user\'s emails by query, sender, subject, date range, etc.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 20 },
        },
        required: ['query'],
      },
    },
    {
      name: 'search_files',
      description: 'Search uploaded files by filename, content, or metadata',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 20 },
        },
        required: ['query'],
      },
    },
    {
      name: 'semantic_search',
      description: 'Semantic search across all indexed content (emails, files, conversations)',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language search query' },
          limit: { type: 'number', description: 'Max results', default: 20 },
        },
        required: ['query'],
      },
    },
    // Communication tools
    {
      name: 'send_email',
      description: 'Send email on behalf of user',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'array', items: { type: 'string' }, description: 'Recipient email addresses' },
          subject: { type: 'string', description: 'Email subject' },
          body: { type: 'string', description: 'Email body' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
    // Calendar tools
    {
      name: 'read_calendar',
      description: 'Read user\'s calendar events',
      parameters: {
        type: 'object',
        properties: {
          startDate: { type: 'string', description: 'Start date (ISO 8601)' },
          endDate: { type: 'string', description: 'End date (ISO 8601)' },
        },
      },
    },
    {
      name: 'create_calendar_event',
      description: 'Create calendar appointment',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Event title' },
          start: { type: 'string', description: 'Start time (ISO 8601)' },
          end: { type: 'string', description: 'End time (ISO 8601)' },
        },
        required: ['title', 'start', 'end'],
      },
    },
    // File tools
    {
      name: 'upload_file',
      description: 'Upload and index a file for the AI to reference',
      parameters: {
        type: 'object',
        properties: {
          filename: { type: 'string', description: 'File name' },
          content: { type: 'string', description: 'File content (base64)' },
          contentType: { type: 'string', description: 'MIME type' },
        },
        required: ['filename', 'content', 'contentType'],
      },
    },
    // Web search
    {
      name: 'search_web',
      description: 'Search the web for current information, news, or recent developments',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          maxResults: { type: 'number', description: 'Max results', default: 5 },
        },
        required: ['query'],
      },
    },
  ];

  // Filter tools based on permissions
  const availableTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [];

  for (const tool of allTools) {
    // Check if user has permission for this tool
    const hasPermission = await checkToolPermission(
      tool.name,
      userId,
      departmentIds,
      {}
    );

    if (hasPermission) {
      availableTools.push(buildToolDefinition(tool));
    }
  }

  return availableTools;
}
```
```

### Tool Execution Flow

**Complete Implementation:**

```typescript
// src/lib/ai/tool-executor.ts
import { OpenAI } from 'openai';
import { checkToolPermission } from '@/lib/utils/permissions';
import { auditLog } from '@/lib/audit/logger';
import { executeTool } from '@/lib/ai/tools';

export interface ToolCallResult {
  tool_call_id: string;
  role: 'tool';
  name: string;
  content: string; // JSON string (not object)
}

/**
 * Execute OpenAI tool calls (supports parallel execution)
 * 
 * OpenAI tool calling works as follows:
 * 1. Model returns tool_calls array (can have multiple calls for parallel execution)
 * 2. Each tool call has: id, type: "function", function: { name, arguments }
 * 3. Execute all tools (in parallel if multiple)
 * 4. Return results as messages with role: "tool"
 * 5. Results must be JSON strings, not objects
 */
export async function executeToolCalls(
  toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
  userId: string,
  departmentIds: string[]
): Promise<ToolCallResult[]> {
  // Execute all tool calls in parallel (OpenAI supports parallel tool calls)
  const executions = toolCalls.map(async (toolCall) => {
    try {
      // Parse arguments (OpenAI returns as JSON string)
      const argumentsObj = JSON.parse(toolCall.function.arguments);

      // Check permissions before execution
      const hasPermission = await checkToolPermission(
        toolCall.function.name,
        userId,
        departmentIds,
        argumentsObj
      );

      if (!hasPermission) {
        return {
          tool_call_id: toolCall.id,
          role: 'tool' as const,
          name: toolCall.function.name,
          content: JSON.stringify({
            success: false,
            error: 'Permission denied',
            message: 'You do not have permission to execute this tool',
          }),
        };
      }

      // Execute tool
      const startTime = Date.now();
      const result = await executeTool(
        toolCall.function.name,
        argumentsObj,
        { userId, departmentIds }
      );
      const executionTime = Date.now() - startTime;

      // Format result as JSON string (required by OpenAI)
      const content = JSON.stringify({
        success: true,
        data: result,
      });

      // Log to audit
      await auditLog({
        userId,
        actionType: 'tool_execution',
        toolName: toolCall.function.name,
        details: {
          arguments: argumentsObj,
          result,
          executionTimeMs: executionTime,
        },
      });

      return {
        tool_call_id: toolCall.id,
        role: 'tool' as const,
        name: toolCall.function.name,
        content, // JSON string
      };
    } catch (error) {
      // Handle execution errors
      console.error(`Tool execution error for ${toolCall.function.name}:`, error);

      await auditLog({
        userId,
        actionType: 'tool_execution_error',
        toolName: toolCall.function.name,
        details: {
          arguments: toolCall.function.arguments,
          error: (error as Error).message,
        },
      });

      // Return error result as JSON string
      return {
        tool_call_id: toolCall.id,
        role: 'tool' as const,
        name: toolCall.function.name,
        content: JSON.stringify({
          success: false,
          error: (error as Error).message,
        }),
      };
    }
  });

  // Wait for all tool executions (parallel)
  return await Promise.all(executions);
}

/**
 * Process chat completion with tool calling support
 * Handles the complete flow: initial request → tool calls → tool results → final response
 */
export async function processChatWithTools(
  userMessage: string,
  conversationId: string,
  userId: string,
  departmentIds: string[],
  organizationId: string,
  availableTools: OpenAI.Chat.Completions.ChatCompletionTool[],
  context?: { recentMessages?: any[]; semanticResults?: any[] }
): Promise<{ response: string; toolCallsMade: number }> {
  // Build conversation history
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // Add system prompt with context
  const systemPrompt = buildSystemPrompt(userId, departmentIds, context);
  messages.push({ role: 'system', content: systemPrompt });

  // Add conversation history (if available)
  if (context?.recentMessages) {
    messages.push(...context.recentMessages);
  }

  // Add user message
  messages.push({ role: 'user', content: userMessage });

  let toolCallsMade = 0;
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  // Continue conversation until final response or max iterations
  while (iterations < maxIterations) {
    iterations++;

    // Call OpenAI
    const response = await chatCompletion({
      messages,
      tools: availableTools,
      toolChoice: 'auto',
      userId,
      departmentId: departmentIds[0], // Primary department
      organizationId,
    });

    const assistantMessage = response.choices[0]?.message;
    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    // Add assistant message to conversation
    messages.push(assistantMessage);

    // Check if model wants to call tools
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      toolCallsMade += assistantMessage.tool_calls.length;

      // Execute all tool calls (in parallel)
      const toolResults = await executeToolCalls(
        assistantMessage.tool_calls,
        userId,
        departmentIds
      );

      // Add tool results to conversation
      messages.push(...toolResults);

      // Continue loop - model will process tool results
      continue;
    }

    // Model provided final text response
    if (assistantMessage.content) {
      return {
        response: assistantMessage.content,
        toolCallsMade,
      };
    }

    // Edge case: no content and no tool calls
    throw new Error('Model response has no content and no tool calls');
  }

  throw new Error('Max iterations reached - possible infinite tool calling loop');
}

### Tool Call Validation

**Critical:** Always validate tool call arguments before execution

```typescript
// src/lib/ai/tool-validator.ts
import { JSONSchema7 } from 'json-schema';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

export function validateToolCall(
  toolName: string,
  arguments: any,
  toolDefinition: OpenAI.Chat.Completions.ChatCompletionTool
): { valid: boolean; errors?: string[] } {
  try {
    // Validate arguments match tool schema
    const validate = ajv.compile(toolDefinition.function.parameters as JSONSchema7);
    const valid = validate(arguments);

    if (!valid && validate.errors) {
      const errors = validate.errors.map(
        (err) => `${err.instancePath || 'root'} ${err.message}`
      );
      return { valid: false, errors };
    }

    // Additional custom validations
    if (toolName === 'send_email') {
      // Validate email addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of arguments.to || []) {
        if (!emailRegex.test(email)) {
          return { valid: false, errors: [`Invalid email address: ${email}`] };
        }
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${(error as Error).message}`],
    };
  }
}
```

### Streaming Responses

**For Better UX:** Support streaming responses for real-time feedback

```typescript
// src/lib/ai/streaming.ts
import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming';

export async function* streamChatCompletion(
  options: ChatCompletionOptions
): AsyncGenerator<string, void, unknown> {
  const { messages, tools = [], toolChoice = 'auto', userId, departmentId, organizationId, systemPrompt } = options;

  const model = process.env.OPENAI_MODEL || 'gpt-5.1-mini';
  const fullMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const stream = await openai.chat.completions.create({
    model,
    messages: fullMessages,
    tools: tools.length > 0 ? tools : undefined,
    tool_choice: toolChoice,
    stream: true, // Enable streaming
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
    
    // Handle tool calls in stream (they come in delta format)
    const toolCalls = chunk.choices[0]?.delta?.tool_calls;
    if (toolCalls) {
      // Tool calls in streaming require special handling
      // You may need to accumulate tool calls across chunks
    }
  }
}

// Usage in API route
export async function GET(request: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        for await (const chunk of streamChatCompletion(options)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Context Window Management - Detailed Strategy

```typescript
// src/lib/ai/context-manager.ts
import { OpenAI } from 'openai';

const MAX_CONTEXT_TOKENS = 128000; // Model-dependent (e.g., GPT-4-turbo)
const TARGET_CONTEXT_TOKENS = 100000; // Leave room for new messages
const MESSAGES_TO_KEEP = 50; // Always keep last N messages

interface MessageTokenCount {
  message: OpenAI.Chat.Completions.ChatCompletionMessageParam;
  tokens: number;
}

/**
 * Manage conversation context using sliding window with summarization
 */
export async function manageConversationContext(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  conversationId: string
): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
  // Count tokens in current messages
  const totalTokens = estimateTokens(messages);

  // If under limit, return as-is
  if (totalTokens < TARGET_CONTEXT_TOKENS) {
    return messages;
  }

  // Separate system, recent messages, and old messages
  const systemMessage = messages.find(m => m.role === 'system');
  const recentMessages = messages.slice(-MESSAGES_TO_KEEP);
  const oldMessages = messages.slice(1, -MESSAGES_TO_KEEP); // Skip system, keep recent

  // Check if we have a saved summary
  const summary = await getConversationSummary(conversationId);

  // Build optimized message list
  const optimized: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // Always include system message
  if (systemMessage) {
    optimized.push(systemMessage);
  }

  // Add summary if exists
  if (summary) {
    optimized.push({
      role: 'assistant',
      content: `[Previous conversation summary: ${summary}]`,
    });
  } else if (oldMessages.length > 0) {
    // Generate summary from old messages if we don't have one
    const newSummary = await generateSummary(oldMessages);
    await saveConversationSummary(conversationId, newSummary);
    optimized.push({
      role: 'assistant',
      content: `[Previous conversation summary: ${newSummary}]`,
    });
  }

  // Add recent messages
  optimized.push(...recentMessages);

  // Verify we're under limit
  const newTokenCount = estimateTokens(optimized);
  if (newTokenCount > TARGET_CONTEXT_TOKENS) {
    // Trim recent messages if still too large
    const trimmed = optimizeRecentMessages(recentMessages, TARGET_CONTEXT_TOKENS - estimateTokens(optimized.slice(0, -recentMessages.length)));
    optimized.splice(-recentMessages.length);
    optimized.push(...trimmed);
  }

  return optimized;
}

function estimateTokens(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): number {
  // Rough estimation: ~4 characters per token for English text
  // More accurate: use tiktoken library
  return messages.reduce((total, msg) => {
    if (typeof msg.content === 'string') {
      return total + Math.ceil(msg.content.length / 4);
    }
    return total;
  }, 0);
}

async function generateSummary(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string> {
  const summaryPrompt = `Summarize the following conversation, focusing on:
- Key topics discussed
- Important decisions made
- Action items mentioned
- Relevant context for future messages

Conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-5.1-mini',
    messages: [{ role: 'user', content: summaryPrompt }],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || '';
}
```

### Tool Response Size Limits

```typescript
// src/lib/ai/tool-executor.ts (enhanced)

const MAX_TOOL_RESPONSE_SIZE = 10000; // characters
const MAX_TOOL_RESPONSE_TOKENS = 2500; // estimated tokens

export async function executeTool(
  toolName: string,
  arguments: any,
  context: { userId: string; departmentIds: string[] }
): Promise<{ success: boolean; data?: any; error?: string; truncated?: boolean }> {
  // ... existing execution code ...

  const result = await tool.execute(arguments, context);
  const resultString = JSON.stringify(result);

  // Check size limits
  if (resultString.length > MAX_TOOL_RESPONSE_SIZE) {
    // Truncate large results
    const truncated = {
      ...result,
      _truncated: true,
      _original_size: resultString.length,
      // Keep most important fields, remove less critical ones
    };

    // For search results, keep top N items
    if (Array.isArray(result.items || result.results)) {
      truncated.items = (result.items || result.results).slice(0, 20);
    }

    return {
      success: true,
      data: truncated,
      truncated: true,
    };
  }

  return { success: true, data: result };
}
```

### Security: Tool Call Injection Prevention

```typescript
// src/lib/ai/security.ts

/**
 * Sanitize tool call arguments to prevent injection attacks
 */
export function sanitizeToolArguments(
  toolName: string,
  arguments: any
): any {
  const sanitized = { ...arguments };

  // Remove any fields not in tool definition
  const toolDefinition = TOOL_DEFINITIONS[toolName];
  if (toolDefinition) {
    const allowedFields = Object.keys(toolDefinition.parameters.properties || {});
    const sanitizedArgs: any = {};
    
    for (const field of allowedFields) {
      if (sanitized[field] !== undefined) {
        sanitizedArgs[field] = sanitized[field];
      }
    }
    
    // Validate and sanitize string fields
    for (const [key, value] of Object.entries(sanitizedArgs)) {
      if (typeof value === 'string') {
        // Remove potential script injections
        sanitizedArgs[key] = value
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();
      }
    }
    
    return sanitizedArgs;
  }

  return sanitized;
}

/**
 * Rate limit tool calls per user
 */
const toolCallRateLimiter = new Map<string, { count: number; resetAt: number }>();

export function checkToolCallRateLimit(
  userId: string,
  toolName: string,
  limit: number = 100, // per minute
  windowMs: number = 60000
): boolean {
  const key = `${userId}:${toolName}`;
  const now = Date.now();
  const record = toolCallRateLimiter.get(key);

  if (!record || now > record.resetAt) {
    toolCallRateLimiter.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
```
```

## Email Integration Implementation

### Microsoft Graph API

```typescript
// src/lib/email/microsoft.ts
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export async function getMicrosoftClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

export async function fetchEmails(client: any, folder: string = 'inbox') {
  const response = await client
    .api(`/me/mailFolders/${folder}/messages`)
    .top(50)
    .get();

  return response.value;
}
```

## File Processing Implementation

### File Extractors

```typescript
// src/lib/file-processing/extractors.ts
import { extractFromPDF } from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export async function extractText(filePath: string, contentType: string) {
  switch (contentType) {
    case 'application/pdf':
      return await extractFromPDF(filePath);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await mammoth.extractRawText({ path: filePath });
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      const workbook = XLSX.readFile(filePath);
      return extractExcelText(workbook);
    // ... more types
    default:
      throw new Error(`Unsupported file type: ${contentType}`);
  }
}
```

## Semantic Search Implementation

### Vector Search

```typescript
// src/lib/search/semantic.ts
import { generateEmbedding } from '@/lib/ai/openai';
import { prisma } from '@/lib/db/prisma';
import { setRLSContext } from '@/lib/db/rls';

export async function semanticSearch(
  query: string,
  userId: string,
  departmentIds: string[],
  limit: number = 20
) {
  // Set RLS context
  await setRLSContext(userId);

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Vector search with department filter
  const results = await prisma.$queryRaw`
    SELECT 
      e.id,
      e.source_type,
      e.source_id,
      e.content,
      e.metadata,
      1 - (e.embedding <=> ${queryEmbedding}::vector) AS similarity
    FROM embeddings e
    WHERE e.department_id = ANY(${departmentIds}::uuid[])
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;

  return results;
}
```

## Cost Tracking Implementation

### API Usage Tracking

```typescript
// src/lib/ai/cost-tracking.ts
import { prisma } from '@/lib/db/prisma';

// OpenAI pricing (update as needed)
const PRICING = {
  'gpt-5.1-mini': {
    input: 0.15 / 1_000_000,  // per token
    output: 0.60 / 1_000_000,
  },
  'gpt-5.1-nano': {
    input: 0.10 / 1_000_000,
    output: 0.40 / 1_000_000,
  },
  'text-embedding-3-small': {
    input: 0.02 / 1_000_000,
    output: 0,
  },
};

export async function trackAPICall(
  userId: string,
  departmentId: string,
  organizationId: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  operationType: string = 'chat',
  metadata: Record<string, any> = {}
) {
  const pricing = PRICING[model as keyof typeof PRICING];
  if (!pricing) {
    console.warn(`Unknown model pricing: ${model}`);
    return;
  }

  const totalTokens = inputTokens + outputTokens;
  const cost = (inputTokens * pricing.input) + (outputTokens * pricing.output);

  await prisma.apiUsage.create({
    data: {
      userId,
      departmentId,
      organizationId,
      model,
      operationType,
      inputTokens,
      outputTokens,
      totalTokens,
      costUsd: cost,
      metadata,
    },
  });

  // Check and update usage limits
  await checkAndUpdateUsageLimits(userId, departmentId, organizationId, totalTokens, cost);
}

export async function checkAndUpdateUsageLimits(
  userId: string,
  departmentId: string,
  organizationId: string,
  tokens: number,
  cost: number
) {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Check user limits
  await updateUsageLimit('user', userId, 'daily_tokens', dayStart, tokens);
  await updateUsageLimit('user', userId, 'monthly_tokens', monthStart, tokens);
  await updateUsageLimit('user', userId, 'daily_cost', dayStart, cost);
  await updateUsageLimit('user', userId, 'monthly_cost', monthStart, cost);

  // Check department limits
  await updateUsageLimit('department', departmentId, 'daily_tokens', dayStart, tokens);
  await updateUsageLimit('department', departmentId, 'monthly_tokens', monthStart, tokens);
  await updateUsageLimit('department', departmentId, 'daily_cost', dayStart, cost);
  await updateUsageLimit('department', departmentId, 'monthly_cost', monthStart, cost);

  // Check organization limits
  await updateUsageLimit('organization', organizationId, 'daily_tokens', dayStart, tokens);
  await updateUsageLimit('organization', organizationId, 'monthly_tokens', monthStart, tokens);
  await updateUsageLimit('organization', organizationId, 'daily_cost', dayStart, cost);
  await updateUsageLimit('organization', organizationId, 'monthly_cost', monthStart, cost);
}

async function updateUsageLimit(
  scopeType: 'user' | 'department' | 'organization',
  scopeId: string,
  limitType: string,
  periodStart: Date,
  amount: number
) {
  const existing = await prisma.usageLimit.findUnique({
    where: {
      scope_type_scope_id_limit_type_period_start: {
        scopeType,
        scopeId,
        limitType,
        periodStart,
      },
    },
  });

  if (existing) {
    await prisma.usageLimit.update({
      where: { id: existing.id },
      data: {
        currentUsage: { increment: amount },
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.usageLimit.create({
      data: {
        scopeType,
        scopeId,
        limitType,
        periodStart,
        currentUsage: amount,
        limitValue: 0, // Will be set by admin
      },
    });
  }
}

export async function checkUsageLimit(
  userId: string,
  departmentId: string,
  organizationId: string,
  limitType: 'daily_tokens' | 'monthly_tokens' | 'daily_cost' | 'monthly_cost'
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const now = new Date();
  const periodStart = limitType.includes('daily')
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : new Date(now.getFullYear(), now.getMonth(), 1);

  // Check user limit first (most specific)
  const userLimit = await prisma.usageLimit.findUnique({
    where: {
      scope_type_scope_id_limit_type_period_start: {
        scopeType: 'user',
        scopeId: userId,
        limitType,
        periodStart,
      },
    },
  });

  if (userLimit && userLimit.limitValue > 0) {
    const remaining = Math.max(0, userLimit.limitValue - Number(userLimit.currentUsage));
    return {
      allowed: remaining > 0,
      remaining,
      limit: userLimit.limitValue,
    };
  }

  // Check department limit
  const deptLimit = await prisma.usageLimit.findUnique({
    where: {
      scope_type_scope_id_limit_type_period_start: {
        scopeType: 'department',
        scopeId: departmentId,
        limitType,
        periodStart,
      },
    },
  });

  if (deptLimit && deptLimit.limitValue > 0) {
    const remaining = Math.max(0, deptLimit.limitValue - Number(deptLimit.currentUsage));
    return {
      allowed: remaining > 0,
      remaining,
      limit: deptLimit.limitValue,
    };
  }

  // Check organization limit
  const orgLimit = await prisma.usageLimit.findUnique({
    where: {
      scope_type_scope_id_limit_type_period_start: {
        scopeType: 'organization',
        scopeId: organizationId,
        limitType,
        periodStart,
      },
    },
  });

  if (orgLimit && orgLimit.limitValue > 0) {
    const remaining = Math.max(0, orgLimit.limitValue - Number(orgLimit.currentUsage));
    return {
      allowed: remaining > 0,
      remaining,
      limit: orgLimit.limitValue,
    };
  }

  // No limit set
  return { allowed: true, remaining: Infinity, limit: Infinity };
}
```

### Enhanced OpenAI Client with Cost Tracking

```typescript
// src/lib/ai/openai.ts (enhanced)
import OpenAI from 'openai';
import { trackAPICall, checkUsageLimit } from './cost-tracking';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatCompletion(
  messages: any[],
  tools: any[],
  context: {
    userId: string;
    departmentId: string;
    organizationId: string;
  }
) {
  // Check usage limits before making call
  const tokenLimit = await checkUsageLimit(
    context.userId,
    context.departmentId,
    context.organizationId,
    'daily_tokens'
  );

  if (!tokenLimit.allowed) {
    throw new Error(`Daily token limit exceeded. Limit: ${tokenLimit.limit}, Used: ${tokenLimit.limit - tokenLimit.remaining}`);
  }

  const model = process.env.OPENAI_MODEL || 'gpt-5.1-mini';
  
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: 'auto',
    });

    // Track usage
    const inputTokens = response.usage?.prompt_tokens || 0;
    const outputTokens = response.usage?.completion_tokens || 0;

    await trackAPICall(
      context.userId,
      context.departmentId,
      context.organizationId,
      model,
      inputTokens,
      outputTokens,
      'chat',
      { tool_calls: response.choices[0]?.message?.tool_calls?.length || 0 }
    );

    return response;
  } catch (error: any) {
    // Log error but don't track cost
    console.error('OpenAI API error:', error);
    throw error;
  }
}
```

## Error Handling & Retry Logic

### Retry Utility

```typescript
// src/lib/utils/retry.ts
export interface RetryOptions {
  maxAttempts?: number;
  backoffMs?: number;
  backoffMultiplier?: number;
  onError?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    backoffMs = 1000,
    backoffMultiplier = 2,
    onError,
    shouldRetry = (error: Error) => {
      // Retry on network errors, rate limits, and server errors
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('rate limit') ||
        message.includes('429') ||
        message.includes('500') ||
        message.includes('502') ||
        message.includes('503')
      );
    },
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const err = error as Error;
      
      if (attempt === maxAttempts || !shouldRetry(err)) {
        throw err;
      }

      onError?.(err, attempt);
      
      // Extract retry delay from error if available (e.g., Retry-After header)
      let delay = backoffMs * Math.pow(backoffMultiplier, attempt - 1);
      
      if (err.message.includes('retry after')) {
        const retryAfterMatch = err.message.match(/retry after (\d+)/i);
        if (retryAfterMatch) {
          delay = parseInt(retryAfterMatch[1]) * 1000;
        }
      }

      await sleep(delay);
    }
  }

  throw new Error('Max retry attempts exceeded');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Email Sync with Retry Logic

```typescript
// src/lib/email/sync.ts
import { withRetry } from '@/lib/utils/retry';

export async function syncEmails(
  emailAccountId: string,
  options: { maxEmails?: number; folder?: string } = {}
) {
  const account = await prisma.emailAccount.findUnique({
    where: { id: emailAccountId },
  });

  if (!account) {
    throw new Error('Email account not found');
  }

  try {
    await withRetry(
      async () => {
        if (account.provider === 'microsoft') {
          return await syncMicrosoftEmails(account, options);
        } else if (account.provider === 'google') {
          return await syncGoogleEmails(account, options);
        } else {
          return await syncIMAPEmails(account, options);
        }
      },
      {
        maxAttempts: 5,
        backoffMs: 2000,
        onError: (error, attempt) => {
          console.warn(`Email sync attempt ${attempt} failed:`, error.message);
        },
      }
    );
  } catch (error) {
    // Update account with error
    await prisma.emailAccount.update({
      where: { id: emailAccountId },
      data: {
        errorMessage: (error as Error).message,
        lastSyncAt: new Date(), // Still update to prevent repeated failures
      },
    });
    throw error;
  }
}
```

## Web Search Implementation

### Web Search Tool

```typescript
// src/lib/ai/tools/web-search.ts
import { TavilySearchAPIClient } from '@tavily/core'; // or similar library

const tavily = process.env.TAVILY_API_KEY
  ? new TavilySearchAPIClient({ apiKey: process.env.TAVILY_API_KEY })
  : null;

export async function searchWeb(
  query: string,
  maxResults: number = 5,
  options: { userId?: string; departmentId?: string } = {}
) {
  // Check if web search is enabled
  const settings = await getSystemSettings();
  if (!settings.webSearchEnabled) {
    throw new Error('Web search is disabled');
  }

  if (!tavily) {
    throw new Error('Web search API key not configured');
  }

  try {
    const results = await tavily.search(query, {
      maxResults,
      includeAnswer: true,
      includeRawContent: false,
    });

    // Log to audit
    await auditLog({
      userId: options.userId,
      departmentId: options.departmentId,
      actionType: 'web_search',
      details: { query, resultCount: results.results?.length || 0 },
    });

    return {
      query,
      results: results.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })) || [],
      answer: results.answer,
    };
  } catch (error) {
    console.error('Web search error:', error);
    throw new Error(`Web search failed: ${(error as Error).message}`);
  }
}

// Tool definition for AI
export const webSearchTool = {
  type: 'function',
  function: {
    name: 'search_web',
    description: 'Search the web for current information, news, or recent developments. Use when user asks about current events, recent news, or information that might have changed recently.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results (default: 5)',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
};
```

## Security Considerations

### Tool Call Security

**Critical Security Measures:**

1. **Input Validation:**
   - Validate all tool call arguments against JSON Schema
   - Sanitize string inputs to prevent injection attacks
   - Remove unexpected fields from tool arguments
   - Enforce type constraints strictly

2. **Permission Checks:**
   - Always check permissions before tool execution
   - Verify department access for data retrieval tools
   - Check user roles for action tools (send_email, create_calendar)
   - Double-check permissions even if model shouldn't call unauthorized tools

3. **Rate Limiting:**
   - Limit tool calls per user per minute
   - Limit tool calls per tool type
   - Prevent abuse of expensive tools (web search, embeddings)

4. **Output Sanitization:**
   - Limit tool response sizes (prevent token waste)
   - Sanitize tool outputs before sending to model
   - Truncate large results intelligently

5. **Audit Logging:**
   - Log all tool calls with full context
   - Log permission checks and results
   - Track failed tool calls
   - Monitor for suspicious patterns

### Data Privacy

- Never expose sensitive data in tool responses
- Filter PII from tool outputs when appropriate
- Respect data retention policies
- Encrypt sensitive data at rest
- Use RLS policies for all database queries

## Testing Strategy

### Testing Requirements

**CRITICAL:** All features must meet these requirements:
- **Code Coverage:** Minimum 90% test coverage
- **Test Pass Rate:** 100% of tests must pass
- **Definition of Done:** Feature is only complete when:
  1. Code coverage is ≥ 90%
  2. All tests pass (100%)
  3. Tests are properly documented
  4. Edge cases are covered

### Test Coverage Requirements

**Coverage Targets by Component Type:**
- **Business Logic:** 95%+ coverage
- **API Endpoints:** 90%+ coverage (all success/error paths)
- **Database Operations:** 90%+ coverage (queries, RLS policies)
- **AI Integration:** 85%+ coverage (mocking external APIs)
- **UI Components:** 80%+ coverage (critical user flows)
- **Utilities:** 95%+ coverage

### Testing Tools

- **Framework:** Jest + React Testing Library
- **E2E:** Playwright
- **Coverage:** Istanbul/nyc
- **Mocking:** Jest mocks, MSW (Mock Service Worker) for API mocking
- **Database:** Use test database with migrations

### Test Types

1. **Unit Tests:**
   - Test individual functions/utilities
   - Mock external dependencies
   - Test edge cases

2. **Integration Tests:**
   - Test API endpoints
   - Test database operations
   - Test external API integrations (mocked)

3. **E2E Tests:**
   - Test critical user flows
   - Test chat interactions
   - Test email sending
   - Test file uploads

### Testing Tools

- **Framework:** Jest + React Testing Library
- **E2E:** Playwright
- **Coverage:** Istanbul/nyc
- **Mocking:** Jest mocks, MSW for API mocking

### Tool Call Testing Patterns

**Critical Test Cases:**

1. **Tool Call Validation:**
   - Valid arguments pass validation
   - Invalid arguments are rejected
   - Missing required parameters are caught
   - Type mismatches are detected

2. **Permission Enforcement:**
   - Users can only call tools they have permission for
   - Department isolation is enforced
   - Cross-department access is blocked
   - Admin tools are restricted

3. **Error Handling:**
   - Tool failures return proper error format
   - Errors don't crash the conversation
   - Model receives error context appropriately

4. **Parallel Execution:**
   - Multiple tool calls execute in parallel
   - Results are correctly mapped to tool_call_ids
   - Partial failures don't block other tools

5. **Context Management:**
   - Large conversations are summarized correctly
   - Recent messages are preserved
   - System prompts are maintained
   - Summaries are accurate

### Example Tests

#### Unit Test Example

```typescript
// tests/unit/lib/ai/openai.test.ts
import { generateEmbedding } from '@/lib/ai/openai';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('generateEmbedding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate embedding for text', async () => {
    const mockEmbedding = new Array(1536).fill(0.1);
    const mockCreate = jest.fn().mockResolvedValue({
      data: [{ embedding: mockEmbedding }],
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
      embeddings: { create: mockCreate },
    } as any));

    const text = 'test text';
    const embedding = await generateEmbedding(text);
    
    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBe(1536);
    expect(mockCreate).toHaveBeenCalledWith({
      model: expect.any(String),
      input: text,
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'));

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
      embeddings: { create: mockCreate },
    } as any));

    await expect(generateEmbedding('test')).rejects.toThrow('API Error');
  });
});
```

#### Integration Test Example

```typescript
// tests/integration/api/chat/route.test.ts
import { POST } from '@/app/api/chat/conversations/[id]/messages/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    conversation: { findUnique: jest.fn() },
    message: { create: jest.fn() },
  },
}));

describe('POST /api/chat/conversations/:id/messages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create message and return AI response', async () => {
    const conversationId = 'test-conversation-id';
    const userId = 'test-user-id';

    (prisma.conversation.findUnique as jest.Mock).mockResolvedValue({
      id: conversationId,
      userId,
      departmentId: 'dept-id',
    });

    const request = new NextRequest('http://localhost/api/chat/conversations/test/messages', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello' }),
      headers: {
        'Authorization': 'Bearer valid-token',
      },
    });

    // Mock authentication
    jest.spyOn(require('@/lib/auth/jwt'), 'verifyToken').mockReturnValue({ userId });

    const response = await POST(request, { params: { id: conversationId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.messageId).toBeDefined();
    expect(prisma.message.create).toHaveBeenCalled();
  });

  it('should return 401 for unauthenticated requests', async () => {
    const request = new NextRequest('http://localhost/api/chat/conversations/test/messages', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello' }),
    });

    const response = await POST(request, { params: { id: 'test-id' } });
    expect(response.status).toBe(401);
  });
});
```

#### Tool Call Test Example

```typescript
// tests/integration/ai/tool-execution.test.ts
import { executeToolCalls, validateToolCall } from '@/lib/ai/tool-executor';
import { OpenAI } from 'openai';

describe('Tool Execution', () => {
  it('should execute tool calls in parallel', async () => {
    const toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] = [
      {
        id: 'call_1',
        type: 'function',
        function: {
          name: 'search_emails',
          arguments: JSON.stringify({ query: 'test', limit: 10 }),
        },
      },
      {
        id: 'call_2',
        type: 'function',
        function: {
          name: 'search_files',
          arguments: JSON.stringify({ query: 'document', limit: 10 }),
        },
      },
    ];

    const startTime = Date.now();
    const results = await executeToolCalls(toolCalls, 'user-id', ['dept-id']);
    const duration = Date.now() - startTime;

    expect(results).toHaveLength(2);
    expect(results[0].tool_call_id).toBe('call_1');
    expect(results[1].tool_call_id).toBe('call_2');
    
    // Should execute in parallel (faster than sequential)
    expect(duration).toBeLessThan(1000); // Both should complete in <1s
  });

  it('should validate tool call arguments', () => {
    const toolDef = {
      type: 'function' as const,
      function: {
        name: 'send_email',
        description: 'Send email',
        parameters: {
          type: 'object',
          properties: {
            to: { type: 'array', items: { type: 'string' } },
            subject: { type: 'string' },
          },
          required: ['to', 'subject'],
        },
      },
    };

    const validArgs = { to: ['test@example.com'], subject: 'Test' };
    const invalidArgs = { to: 'not-an-array', subject: 'Test' };

    expect(validateToolCall('send_email', validArgs, toolDef).valid).toBe(true);
    expect(validateToolCall('send_email', invalidArgs, toolDef).valid).toBe(false);
  });

  it('should enforce permissions', async () => {
    const toolCall = {
      id: 'call_1',
      type: 'function' as const,
      function: {
        name: 'search_emails',
        arguments: JSON.stringify({ query: 'test' }),
      },
    };

    // User without permission
    await expect(
      executeToolCalls([toolCall], 'unauthorized-user', [])
    ).rejects.toThrow('Permission denied');
  });
});
```

#### E2E Test Example

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should send message and receive AI response', async ({ page }) => {
    await page.goto('/chat');
    
    // Wait for chat interface
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();

    // Type message
    await page.fill('[data-testid="message-input"]', 'What did Greg email me about?');
    await page.click('[data-testid="send-button"]');

    // Wait for response
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({ timeout: 30000 });
    
    // Check response contains relevant content
    const response = await page.textContent('[data-testid="ai-message"]');
    expect(response).toBeTruthy();
  });

  test('should show proactive reminders', async ({ page }) => {
    await page.goto('/chat');
    
    // Wait for proactive reminders
    await expect(page.locator('[data-testid="proactive-reminder"]')).toBeVisible({ timeout: 5000 });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## Rate Limiting Implementation

### API Rate Limiting

**Purpose:** Protect against abuse and ensure fair resource usage

**Implementation:**
```typescript
// src/lib/middleware/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000, // 1 minute
});

export function rateLimitMiddleware(
  identifier: string,
  limit: number = 60 // requests per minute
): boolean {
  const count = rateLimit.get(identifier) || 0;
  
  if (count >= limit) {
    return false; // Rate limited
  }
  
  rateLimit.set(identifier, count + 1);
  return true; // Allowed
}

// Usage in API routes
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  
  if (!rateLimitMiddleware(`api:${userId}`, 60)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

**Rate Limits by Endpoint:**
- Chat API: 60 requests per minute per user
- Search API: 30 requests per minute per user
- Email Send: 20 requests per minute per user
- File Upload: 10 requests per minute per user
- Admin Endpoints: 100 requests per minute per admin

### Email Sync Rate Limiting

**Purpose:** Prevent overwhelming email providers' rate limits

**Implementation:**
- Batch email sync operations
- Respect provider rate limits (Microsoft Graph: 10K/10min, Gmail: 250/sec per user)
- Exponential backoff on 429 responses
- Queue sync jobs to prevent concurrent requests

## Environment Setup & Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/orgai"
DATABASE_POOL_SIZE=20
DATABASE_SSL=false

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.1-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="3d"
SESSION_SECRET="your-session-secret"

# OAuth (SSO)
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
MICROSOFT_TENANT_ID="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email/Calendar
MICROSOFT_GRAPH_API_ENDPOINT="https://graph.microsoft.com/v1.0"
GOOGLE_API_ENDPOINT="https://www.googleapis.com"

# Web Search
TAVILY_API_KEY="tvly-..."

# Application
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# File Storage
FILE_STORAGE_PATH="/var/app/files"
MAX_FILE_SIZE=10485760 # 10MB
ALLOWED_FILE_TYPES="pdf,docx,pptx,xlsx,txt,csv"

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000

# Logging
LOG_LEVEL="info"
LOG_FORMAT="json"

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Development Setup Checklist

- [ ] PostgreSQL 15+ installed with pgvector extension
- [ ] Node.js 20+ installed
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] OpenAI API key configured
- [ ] Email/Calendar OAuth apps created (if using)
- [ ] File storage directory created with proper permissions
- [ ] SSL certificates configured (production)

### Production Deployment Checklist

- [ ] All environment variables set
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] File storage mounted with sufficient space
- [ ] Monitoring and logging configured
- [ ] Rate limiting configured appropriately
- [ ] Cost tracking limits set
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] Health check endpoints accessible
- [ ] Backup strategy in place

## Deployment Strategy

### Self-Hosted Deployment

1. **Server Requirements:**
   - Ubuntu 22.04+ or similar
   - Node.js 20+
   - PostgreSQL 15+ with pgvector
   - Sufficient disk space for file storage

2. **Setup Steps:**
```bash
# Clone repository
git clone <repo-url>
cd organizational-ai-assistant

# Install dependencies
npm install

# Build application
npm run build

# Set up environment variables
cp .env.example .env.production
# Edit .env.production

# Run database migrations
npm run db:migrate

# Start application (use PM2 or similar)
pm2 start npm --name "org-ai" -- start
```

3. **Nginx Configuration:**
```nginx
server {
  listen 80;
  server_name your-domain.com;

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

### Cloud Deployment

- **Platform:** Vercel, Railway, or similar
- **Database:** Managed PostgreSQL (with pgvector support)
- **File Storage:** Local filesystem or migrate to S3
- **Environment Variables:** Set in platform settings

## Performance Optimization

### Database Optimization

- **Connection Pooling:** Prisma connection pooling
- **Indexes:** Strategic indexes on frequently queried columns
- **Query Optimization:** Avoid N+1 queries, use includes/selects wisely

### Caching

- **Session Cache:** Cache user permissions, department memberships
- **API Response Cache:** Cache frequent queries
- **Embedding Cache:** Cache frequently used embeddings

### Background Processing

- **Email Polling:** Background workers for email sync
- **Embedding Generation:** Queue for batch processing
- **File Processing:** Async processing for large files

### Monitoring

- **Logging:** Structured logging (Winston, Pino)
- **Metrics:** Application metrics (response times, error rates)
- **Alerts:** Set up alerts for errors, performance issues

