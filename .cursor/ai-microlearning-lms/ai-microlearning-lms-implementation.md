# AI Microlearning LMS - Build Plan & Implementation Guide

**Phased development approach, setup instructions, coding patterns, deployment strategy, and testing requirements.**

## Table of Contents

1. [Development Phases](#development-phases)
2. [Project Setup](#project-setup)
3. [Database Setup](#database-setup)
4. [Development Environment](#development-environment)
5. [Coding Patterns & Conventions](#coding-patterns--conventions)
6. [Service Implementation](#service-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Strategy](#deployment-strategy)
10. [Troubleshooting](#troubleshooting)

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

**Goals:**
- Project setup and infrastructure
- Database schema and migrations
- Authentication system
- Basic API structure

**Tasks:**
- [ ] Initialize Next.js project
- [ ] Setup Prisma with PostgreSQL
- [ ] Configure pgvector extension
- [ ] Implement JWT authentication
- [ ] Create basic API routes structure
- [ ] Setup Redis for job queue
- [ ] Configure environment variables

**Deliverables:**
- Working authentication (register/login)
- Database with all tables
- Basic API structure
- Development environment ready

### Phase 2: Content Ingestion (Weeks 3-4)

**Goals:**
- File watching system
- URL monitoring
- Content processing pipeline
- Background job queue

**Tasks:**
- [ ] Implement file watcher service
- [ ] Implement URL monitoring service
- [ ] Text extraction (PDF, DOCX, TXT, URLs)
- [ ] Semantic chunking algorithm
- [ ] Embedding generation
- [ ] Metadata extraction
- [ ] Image generation
- [ ] Background job processing
- [ ] Admin API for ingestion management

**Deliverables:**
- Watched folders working
- URL monitoring working
- Content processing pipeline functional
- Nuggets created from raw content

### Phase 3: AI Authoring (Weeks 5-6)

**Goals:**
- Slide generation
- Audio script generation
- Audio file generation
- Learning package assembly

**Tasks:**
- [ ] Slide generation from nuggets
- [ ] Audio script generation
- [ ] TTS integration (OpenAI + ElevenLabs)
- [ ] Audio file storage
- [ ] Learning package creation
- [ ] Admin API for nugget management

**Deliverables:**
- Nuggets with slides and audio
- Multiple TTS provider support
- Admin can view/edit nuggets

### Phase 4: Narrative Planning (Weeks 7-8)

**Goals:**
- Narrative node generation
- Choice creation
- Path adaptation logic
- Narrative graph management

**Tasks:**
- [ ] Narrative planner service
- [ ] Node generation from nuggets
- [ ] Choice generation with AI
- [ ] Path adaptation based on learner state
- [ ] Narrative graph visualization (admin)
- [ ] API for narrative navigation

**Deliverables:**
- Narrative nodes created
- Adaptive path selection working
- Choose-your-own-adventure mechanics functional

### Phase 5: Learning Delivery (Weeks 9-10)

**Goals:**
- AI tutor implementation
- Tool execution system
- Session management
- Progress tracking

**Tasks:**
- [ ] AI tutor service
- [ ] Tool definitions and execution
- [ ] Session creation and management
- [ ] Message handling
- [ ] Progress tracking
- [ ] Mastery updates
- [ ] Learning API endpoints

**Deliverables:**
- Working AI tutor
- Tool execution functional
- Sessions and progress tracking

### Phase 6: Frontend - Learner Canvas (Weeks 11-12)

**Goals:**
- Learner interface
- Chat UI
- Media widgets
- Progress display
- Voice input/output

**Tasks:**
- [ ] Learner canvas layout
- [ ] Chat interface
- [ ] Media widget components
- [ ] Progress panel
- [ ] Narrative tree visualization
- [ ] Voice input (WebSpeech API)
- [ ] Voice output (audio playback)
- [ ] WebSocket integration

**Deliverables:**
- Functional learner interface
- Text and voice modes working
- Real-time updates via WebSocket

### Phase 7: Frontend - Admin Console (Weeks 13-14)

**Goals:**
- Admin dashboard
- Ingestion management
- Nugget store
- Settings configuration
- Analytics dashboard

**Tasks:**
- [ ] Admin dashboard layout
- [ ] Watched folders management
- [ ] URL monitoring management
- [ ] Ingestion jobs monitoring
- [ ] Nugget store browser
- [ ] Nugget editor
- [ ] Settings configuration UI
- [ ] Analytics dashboard
- [ ] Cost tracking display

**Deliverables:**
- Complete admin console
- All management features working
- Analytics and cost tracking visible

### Phase 8: Polish & Optimization (Weeks 15-16)

**Goals:**
- Performance optimization
- Error handling improvements
- Cost optimization
- Documentation
- Testing

**Tasks:**
- [ ] Performance optimization
- [ ] Error handling refinement
- [ ] Cost optimization (caching, batching)
- [ ] Comprehensive testing
- [ ] Documentation updates
- [ ] Security audit
- [ ] Load testing

**Deliverables:**
- Production-ready system
- 90%+ test coverage
- Performance optimized
- Cost optimized

## Project Setup

### Initialize Next.js Project

```bash
# Create Next.js project
npx create-next-app@latest ai-microlearning-lms --typescript --tailwind --app

# Install dependencies
cd ai-microlearning-lms
npm install

# Install additional dependencies
npm install @prisma/client prisma
npm install bullmq ioredis
npm install chokidar
npm install pdf-parse mammoth
npm install cheerio puppeteer
npm install openai
npm install jsonwebtoken bcrypt
npm install zod react-hook-form
npm install ws
npm install framer-motion
npm install date-fns
npm install class-variance-authority  # For component variants
npm install winston
npm install prom-client

# Frontend dependencies
npm install @heroicons/react
npm install zustand
npm install framer-motion
npm install date-fns

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D @types/jsonwebtoken @types/bcrypt
npm install -D @types/ws
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier
npm install -D tsx  # For running TypeScript files directly
npm install -D husky lint-staged  # Git hooks for code quality
```

### Project Structure

```
ai-microlearning-lms/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── (learner)/         # Learner routes
│   │   ├── (admin)/           # Admin routes
│   │   └── api/               # API routes
│   ├── components/             # React components
│   │   ├── learner/           # Learner UI components
│   │   │   ├── Canvas.tsx     # Main canvas
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MediaWidget.tsx
│   │   │   ├── ProgressPanel.tsx
│   │   │   ├── NarrativeTree.tsx
│   │   │   └── VoiceControls.tsx
│   │   ├── admin/             # Admin UI components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── IngestionManager.tsx
│   │   │   ├── NuggetStore.tsx
│   │   │   ├── NuggetEditor.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   └── shared/            # Shared components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/                   # Utilities and helpers
│   │   ├── auth/              # Authentication
│   │   ├── ai/                # AI services
│   │   ├── db/                # Database utilities
│   │   ├── voice/             # Voice processing
│   │   ├── websocket/         # WebSocket client
│   │   └── utils/             # General utilities
│   ├── stores/                # Zustand stores
│   │   ├── session-store.ts   # Session state
│   │   ├── learner-store.ts   # Learner state
│   │   └── ui-store.ts        # UI state
│   ├── services/              # Business logic services
│   │   ├── content-ingestion/ # Content processing
│   │   ├── ai-authoring/      # Content generation
│   │   ├── narrative-planning/# Narrative planning
│   │   ├── learning-delivery/ # Learning delivery
│   │   └── jobs/              # Background jobs
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWebSocket.ts
│   │   ├── useVoiceInput.ts
│   │   ├── useSession.ts
│   │   └── useDebounce.ts
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── storage/                   # File storage
│   ├── raw/                   # Raw content
│   ├── images/                 # Generated images
│   └── audio/                  # Generated audio
├── scripts/                   # Utility scripts
│   ├── backup-database.sh     # Database backup
│   └── setup.sh               # Initial setup
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                    # Static assets
│   ├── images/
│   └── icons/
├── .env                       # Environment variables
├── .env.example               # Environment template
├── tailwind.config.ts         # Tailwind v4 config
├── postcss.config.js          # PostCSS config
├── tsconfig.json              # TypeScript config
└── package.json
```

## Database Setup

### PostgreSQL Installation

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql-15 postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE ai_microlearning_lms;

# Create user
CREATE USER lms_user WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_microlearning_lms TO lms_user;

# Exit
\q
```

### Install pgvector Extension

```bash
# Install pgvector
sudo apt-get install postgresql-15-pgvector

# Connect to database
sudo -u postgres psql -d ai_microlearning_lms

# Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Prisma Setup

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://lms_user:secure_password@localhost:5432/ai_microlearning_lms?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI
OPENAI_API_KEY=sk-...

# ElevenLabs (optional)
ELEVENLABS_API_KEY=...

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=3d

# File Storage
STORAGE_PATH=./storage

# Application
NODE_ENV=development
PORT=3000
```

## Development Environment

### Local Development Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Start Redis
sudo systemctl start redis-server

# Start development server
npm run dev

# In separate terminal: Start job workers
npm run worker
```

### Tailwind CSS v4 Setup

**Note:** Tailwind CSS v4 has a different setup than v3. It uses CSS-first configuration.

**Installation:**
```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

**Configuration (tailwind.config.ts):**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**CSS Import (src/app/globals.css):**
```css
@import "tailwindcss";

/* Custom styles */
@layer base {
  :root {
    --color-primary: 59 130 246;
  }
}
```

**Key Changes in v4:**
- CSS-first configuration (use `@theme` in CSS)
- Improved performance (faster builds)
- Better tree-shaking
- Simplified configuration

### Heroicons Setup

**Installation:**
```bash
npm install @heroicons/react
```

**Usage:**
```typescript
import { 
  AcademicCapIcon, 
  BookOpenIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

// Or solid icons
import { 
  AcademicCapIcon as AcademicCapIconSolid 
} from '@heroicons/react/24/solid';

// Usage in component
<AcademicCapIcon className="h-6 w-6 text-blue-500" />
```

**Icon Selection:**
- **Outline icons:** Default, 24x24, 1.5px stroke
- **Solid icons:** Filled, 24x24
- **Mini icons:** 20x20 (for smaller contexts)

**Best Practices:**
- Use outline icons for most UI
- Use solid icons for active/selected states
- Use mini icons in buttons, badges
- Consistent sizing (h-6 w-6 for most, h-5 w-5 for smaller)

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "worker": "tsx src/workers/index.ts",
    "worker:dev": "tsx watch src/workers/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint:fix": "eslint . --fix",
    "prepare": "husky install"
  }
}
```

### Code Quality Tools

**ESLint Configuration (.eslintrc.json):**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Prettier Configuration (.prettierrc):**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Husky Git Hooks (.husky/pre-commit):**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Lint-Staged Configuration (.lintstagedrc.json):**
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### Frontend Component Patterns

**Component Structure:**
```typescript
// src/components/shared/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

**Form Component Pattern:**
```typescript
// src/components/shared/FormInput.tsx
import { useFormContext } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function FormInput({ name, label, ...props }: FormInputProps) {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        {...register(name)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        {...props}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
```

**Zustand Store Pattern:**
```typescript
// src/stores/session-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SessionState {
  currentSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  setSession: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      currentSessionId: null,
      messages: [],
      isLoading: false,
      setSession: (sessionId) => set({ currentSessionId: sessionId, messages: [] }),
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'SessionStore' }
  )
);
```

## Coding Patterns & Conventions

### TypeScript Patterns

**Service Classes:**
```typescript
// src/services/example-service/index.ts
export class ExampleService {
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  async doSomething(input: InputType): Promise<OutputType> {
    // Implementation
  }
}
```

**API Route Pattern:**
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { ExampleService } from '@/services/example-service';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    
    const service = new ExampleService(prisma);
    const result = await service.doSomething();
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

### Error Handling Pattern

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super('VALIDATION_ERROR', 400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', 404, `${resource} not found${id ? `: ${id}` : ''}`);
  }
}

// Usage
if (!nugget) {
  throw new NotFoundError('Nugget', nuggetId);
}
```

### Database Query Pattern

```typescript
// Use Prisma for standard queries
const nugget = await prisma.nugget.findUnique({
  where: { id: nuggetId },
  include: { organization: true }
});

// Use raw SQL for pgvector queries
const similarNuggets = await prisma.$queryRaw<Nugget[]>`
  SELECT n.*, 
         1 - (n.embedding <=> ${queryEmbedding}::vector) as similarity
  FROM nuggets n
  WHERE n.organization_id = ${organizationId}
    AND 1 - (n.embedding <=> ${queryEmbedding}::vector) > 0.7
  ORDER BY similarity DESC
  LIMIT 20
`;
```

### Background Job Pattern

```typescript
// src/services/jobs/queues.ts
import Bull from 'bull';

export const processingQueue = new Bull('content-processing', {
  redis: { host: 'localhost', port: 6379 }
});

// src/services/jobs/processors.ts
processingQueue.process('file', async (job) => {
  const processor = new ContentProcessor();
  return await processor.processFile(job.data);
});

// Usage
await processingQueue.add('file', {
  type: 'file',
  source: filePath,
  organizationId: orgId
});
```

## Service Implementation

### Content Ingestion Service

**File Structure:**
```
src/services/content-ingestion/
├── index.ts                 # Main service export
├── file-watcher.ts         # File watching service
├── url-monitor.ts          # URL monitoring service
├── processor.ts            # Content processing
├── extraction.ts           # Text extraction
├── chunking.ts             # Semantic chunking
├── metadata.ts             # Metadata extraction
├── images.ts               # Image generation
└── queue.ts                # Job queue integration
```

**Implementation Steps:**
1. Create file watcher service
2. Create URL monitoring service
3. Implement text extraction
4. Implement semantic chunking
5. Implement embedding generation
6. Implement metadata extraction
7. Implement image generation
8. Integrate with job queue

### AI Authoring Engine

**File Structure:**
```
src/services/ai-authoring/
├── index.ts                # Main service export
├── slides.ts               # Slide generation
├── audio-scripts.ts        # Audio script generation
├── audio.ts                # Audio generation
└── package.ts              # Learning package assembly
```

### Narrative Planning Service

**File Structure:**
```
src/services/narrative-planning/
├── index.ts                # Main service export
├── planner.ts              # Narrative planner
├── node-generator.ts       # Node generation
├── path-adapter.ts         # Path adaptation
└── search.ts               # Nugget search
```

### Learning Delivery Service

**File Structure:**
```
src/services/learning-delivery/
├── index.ts                # Main service export
├── tutor.ts                # AI tutor
├── session-manager.ts       # Session management
├── tool-executor.ts        # Tool execution
├── tools/                  # Tool implementations
│   ├── deliver-nugget.ts
│   ├── ask-question.ts
│   ├── update-mastery.ts
│   ├── adapt-narrative.ts
│   └── show-media.ts
└── progress-tracker.ts     # Progress tracking
```

## Frontend Implementation

### Frontend Dependencies

**Core:**
- `next@15` - Framework
- `react@19` - UI library
- `typescript` - Type safety

**Styling & UI:**
- `tailwindcss@next` - Tailwind CSS v4
- `@heroicons/react` - Icon library
- `framer-motion` - Animations
- `class-variance-authority` - Component variants

**State & Forms:**
- `zustand` - State management
- `react-hook-form` - Form handling
- `zod` - Schema validation

**Utilities:**
- `date-fns` - Date formatting
- `ws` - WebSocket (server-side)

### Component Library Structure

**Shared Components:**
- Button (with variants: default, outline, ghost)
- Input (with validation)
- Modal/Dialog
- LoadingSpinner
- ErrorBoundary
- Toast/Notification
- Card
- Badge
- Select/Dropdown

**Pattern: Component Variants (CVA)**
```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: { default: '...', outline: '...' },
      size: { sm: '...', md: '...', lg: '...' }
    }
  }
);
```

### Learner Canvas

**File Structure:**
```
src/app/(learner)/
├── layout.tsx              # Learner layout
├── dashboard/page.tsx       # Dashboard
└── session/[id]/page.tsx   # Learning session

src/components/learner/
├── Canvas.tsx              # Main canvas component
├── ChatInterface.tsx       # Chat UI
├── MediaWidget.tsx         # Media display
├── ProgressPanel.tsx       # Progress display
├── NarrativeTree.tsx       # Narrative visualization
└── VoiceControls.tsx      # Voice input/output
```

**Canvas Component Pattern:**
```typescript
// src/components/learner/Canvas.tsx
'use client';

import { useSessionStore } from '@/stores/session-store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatInterface } from './ChatInterface';
import { ProgressPanel } from './ProgressPanel';

export function Canvas({ sessionId }: { sessionId: string }) {
  const { messages, isLoading } = useSessionStore();
  const { sendMessage, isConnected } = useWebSocket(sessionId);
  
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface 
          messages={messages}
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
      <ProgressPanel />
    </div>
  );
}
```

### Admin Console

**File Structure:**
```
src/app/(admin)/
├── layout.tsx              # Admin layout
├── dashboard/page.tsx       # Dashboard
├── ingestion/page.tsx      # Ingestion management
├── nuggets/page.tsx        # Nugget store
├── nuggets/[id]/page.tsx  # Nugget editor
├── settings/page.tsx       # Settings
└── analytics/page.tsx      # Analytics

src/components/admin/
├── Dashboard.tsx           # Dashboard
├── IngestionManager.tsx   # Ingestion UI
├── NuggetStore.tsx        # Nugget browser
├── NuggetEditor.tsx       # Nugget editor
├── SettingsPanel.tsx      # Settings UI
└── AnalyticsDashboard.tsx # Analytics
```

### Custom Hooks

**WebSocket Hook:**
```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(sessionId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/api/ws?token=${token}`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle message
    };
    
    wsRef.current = ws;
    
    return () => {
      ws.close();
    };
  }, [sessionId]);
  
  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'session:message', data: { content: message } }));
    }
  };
  
  return { isConnected, sendMessage };
}
```

**Voice Input Hook:**
```typescript
// src/hooks/useVoiceInput.ts
import { useState, useRef } from 'react';

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const Recognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new Recognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        // Handle transcript
      };
      
      recognition.start();
      setIsRecording(true);
      recognitionRef.current = recognition;
    }
  };
  
  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };
  
  return { isRecording, startRecording, stopRecording };
}
```

## Testing Strategy

### Testing Libraries

**Unit & Integration Testing:**
- `jest` - Test runner and assertion library
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom DOM matchers for Jest
- `@testing-library/user-event` - User interaction simulation
- `ts-jest` - TypeScript support for Jest

**E2E Testing:**
- `@playwright/test` - End-to-end testing framework
- Supports Chromium, Firefox, and WebKit browsers
- Built-in screenshot and video recording

**Test Configuration (jest.config.js):**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/app/**/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Playwright Configuration (playwright.config.ts):**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Unit Tests

**Test Structure:**
```
tests/
├── unit/
│   ├── services/
│   ├── lib/
│   ├── components/
│   └── utils/
├── integration/
│   ├── api/
│   └── services/
└── e2e/
    └── flows/
```

**Example Unit Test:**
```typescript
// tests/unit/services/content-ingestion/chunking.test.ts
import { SemanticChunker } from '@/services/content-ingestion/chunking';

describe('SemanticChunker', () => {
  it('should chunk text semantically', async () => {
    const chunker = new SemanticChunker();
    const text = 'Long text content...';
    
    const chunks = await chunker.chunk(text);
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].text.length).toBeLessThan(8000);
  });
});
```

### Integration Tests

**Example Integration Test:**
```typescript
// tests/integration/api/learning/sessions.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/learning/sessions/route';

describe('POST /api/learning/sessions', () => {
  it('should create a new session', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { mode: 'text' }
    });
    
    // Mock authentication
    // ...
    
    await POST(req);
    
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.id).toBeDefined();
  });
});
```

### E2E Tests

**Example E2E Test:**
```typescript
// tests/e2e/learning-flow.test.ts
import { test, expect } from '@playwright/test';

test('complete learning session', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'learner@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Create session
  await page.goto('/learner/sessions');
  await page.click('button:text("Start Learning")');
  
  // Send message
  await page.fill('[data-testid="message-input"]', 'Hello');
  await page.click('button:text("Send")');
  
  // Wait for response
  await page.waitForSelector('[data-testid="assistant-message"]');
  
  // Verify response
  const response = await page.textContent('[data-testid="assistant-message"]');
  expect(response).toBeTruthy();
});
```

### Test Coverage Requirements

- **Unit Tests:** 90% coverage minimum
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user flows
- **All tests must pass:** 100% pass rate

### Detailed Test Scenarios

**Content Ingestion Tests:**
- File watching: New file detected and processed
- File watching: File modified (reprocess)
- File watching: File deleted (handle gracefully)
- URL monitoring: Content changed detection
- URL monitoring: URL unreachable (error handling)
- Text extraction: PDF with images (extract text only)
- Text extraction: DOCX with formatting (preserve structure)
- Text extraction: Large file (> 100MB) handling
- Semantic chunking: Empty text (handle gracefully)
- Semantic chunking: Very short text (< 100 chars)
- Semantic chunking: Very long text (> 100K chars)
- Embedding generation: API failure (retry logic)
- Metadata extraction: Invalid content (error handling)
- Image generation: API rate limit (backoff)
- Image generation: Invalid concept (fallback)

**Learning Delivery Tests:**
- Session creation: Invalid learner (error)
- Session creation: Concurrent sessions (limit handling)
- Message processing: Empty message (validation)
- Message processing: Very long message (> 10K chars)
- Message processing: AI API timeout (retry)
- Message processing: Tool execution failure (error handling)
- Narrative choice: Invalid choice ID (error)
- Narrative choice: Choice leads to non-existent node (error handling)
- Progress update: Concurrent updates (race condition handling)
- Voice input: Audio too short (< 1 second)
- Voice input: Audio too long (> 5 minutes)
- Voice input: Invalid audio format (error)
- Voice output: TTS API failure (fallback to text)

**Admin Tests:**
- Watched folder: Invalid path (validation)
- Watched folder: Path doesn't exist (error)
- Watched folder: Insufficient permissions (error)
- URL monitoring: Invalid URL (validation)
- URL monitoring: URL requires authentication (error)
- Nugget editing: Concurrent edits (conflict handling)
- Nugget regeneration: Job queue full (error handling)
- Settings update: Invalid configuration (validation)
- Settings update: API key invalid (error)

**Error Handling Tests:**
- Database connection loss (retry, graceful degradation)
- Redis connection loss (fallback, error handling)
- OpenAI API failure (retry with backoff)
- File system full (error handling)
- Network timeout (retry logic)
- Invalid input data (validation, error messages)
- Permission denied (clear error message)
- Resource not found (404 handling)
- Rate limit exceeded (429 handling, retry after)

**Edge Cases:**
- Empty database (handle gracefully)
- Very large nuggets (> 50K chars)
- Very many choices (> 10 choices)
- Concurrent learners (100+ simultaneous)
- Long-running sessions (> 24 hours)
- Rapid message sending (rate limiting)
- Large file uploads (> 100MB)
- Special characters in content (encoding)
- Unicode content (proper handling)
- Malformed JSON (error handling)

### Error Handling Patterns

**Retry Logic:**
```typescript
// Exponential backoff retry
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

**Circuit Breaker Pattern:**
```typescript
// Circuit breaker for external APIs
class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= 5) {
      this.state = 'open';
    }
  }
}
```

**Graceful Degradation:**
```typescript
// Fallback when optional features fail
async function deliverNuggetWithFallback(nuggetId: string) {
  try {
    const nugget = await getNugget(nuggetId);
    return {
      content: nugget.content,
      image: nugget.imageUrl || null, // Optional
      audio: nugget.audioUrl || null, // Optional
    };
  } catch (error) {
    // Log error but continue with text-only
    logger.error('Nugget delivery error', { nuggetId, error });
    return {
      content: 'Content temporarily unavailable',
      image: null,
      audio: null,
    };
  }
}
```

## Deployment Strategy

### Proxmox VM Setup

**VM Configuration:**
- **OS:** Ubuntu Server 22.04 LTS
- **CPU:** 4-8 cores
- **RAM:** 16-32 GB
- **Storage:** 100+ GB
- **Network:** Bridge to Proxmox network

### Software Installation

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 15
sudo apt-get install postgresql-15 postgresql-contrib
sudo apt-get install postgresql-15-pgvector

# Install Redis
sudo apt-get install redis-server

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install nginx

# Install certbot (SSL)
sudo apt-get install certbot python3-certbot-nginx
```

### Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/ai-microlearning-lms.git
cd ai-microlearning-lms

# Install dependencies
npm install

# Build application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start with PM2
pm2 start npm --name "lms" -- start
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/lms
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support
    location /api/ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### SSL Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (already configured by certbot)
```

## Development Workflow

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

**Commit Convention:**
```
feat: Add semantic chunking algorithm
fix: Resolve WebSocket connection issue
docs: Update API documentation
test: Add unit tests for narrative planner
refactor: Simplify content ingestion service
```

**Pull Request Process:**
1. Create feature branch from `develop`
2. Implement feature with tests
3. Ensure all tests pass (100%)
4. Ensure code coverage ≥ 90%
5. Run linter and formatter
6. Create PR with description
7. Code review required
8. Merge to `develop` after approval
9. Deploy to staging for testing
10. Merge to `main` after staging approval

### CI/CD Pipeline (Future)

**GitHub Actions Workflow:**
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      - run: npm run test:e2e
```

**Pre-commit Hooks:**
- Lint staged files
- Format staged files
- Run type checking
- Run unit tests for changed files

## Troubleshooting

### Common Issues

**Database Connection:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U lms_user -d ai_microlearning_lms
```

**Redis Connection:**
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

**Job Queue Issues:**
```bash
# Check queue status
redis-cli
> LLEN bull:content-processing:waiting
> LLEN bull:content-processing:active
```

**PM2 Issues:**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs lms

# Restart application
pm2 restart lms
```

---

This implementation guide provides step-by-step instructions for building the AI Microlearning LMS. Follow phases sequentially, test thoroughly, and optimize as you go.

