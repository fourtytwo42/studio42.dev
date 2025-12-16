# AI Microlearning LMS - Quick Reference Guide

**Essential implementation details, common patterns, pitfalls to avoid, and cost optimization tips.**

## Table of Contents

1. [Quick Start](#quick-start)
2. [Common Patterns](#common-patterns)
3. [Pitfalls to Avoid](#pitfalls-to-avoid)
4. [Cost Optimization Tips](#cost-optimization-tips)
5. [Troubleshooting Quick Fixes](#troubleshooting-quick-fixes)
6. [Key Decisions Reference](#key-decisions-reference)

## Quick Start

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run worker           # Start background workers

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create migration
npx prisma studio        # Open Prisma Studio

# Testing
npm test                 # Run tests
npm run test:coverage    # Test coverage

# Production
npm run build            # Build for production
npm start                # Start production server
pm2 start npm --name "lms" -- start  # Start with PM2
```

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key

# Optional
ELEVENLABS_API_KEY=...
STORAGE_PATH=./storage
```

## Frontend Stack Details

### Confirmed Technologies

- **Tailwind CSS v4.0:** Released January 2025, CSS-first configuration, improved performance
- **Heroicons v2:** `@heroicons/react` - 24x24 outline/solid icons, designed for Tailwind
- **Zustand:** Lightweight state management (no providers needed)
- **React Hook Form + Zod:** Form handling and validation
- **Framer Motion:** Complex animations and transitions
- **date-fns:** Date/time utilities
- **WebSocket:** `ws` library (lightweight, native API)

### Icon Usage

```typescript
// Outline icons (default)
import { AcademicCapIcon } from '@heroicons/react/24/outline';

// Solid icons (for active states)
import { AcademicCapIcon } from '@heroicons/react/24/solid';

// Mini icons (for buttons, badges)
import { AcademicCapIcon } from '@heroicons/react/20/solid';

// Usage
<AcademicCapIcon className="h-6 w-6 text-blue-500" />
```

### Tailwind v4 Setup

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: 59 130 246;
}
```

**Key Changes in v4:**
- CSS-first configuration (use `@theme` in CSS instead of JS config)
- Improved performance (faster builds, better tree-shaking)
- Simplified configuration
- Better IntelliSense support

### WebSocket Library Choice

**Decision:** Use native WebSocket API (`ws` library server-side, native browser API client-side)

**Rationale:**
- Lightweight (no extra dependencies)
- Simple implementation
- Native browser support
- Sufficient for our use case

**Alternative:** Socket.io (only if we need auto-reconnect, rooms, or fallback to polling)

## Common Patterns

### Service Pattern

```typescript
// Standard service structure
export class ServiceName {
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  async method(input: InputType): Promise<OutputType> {
    // Implementation with error handling
    try {
      // Logic here
      return result;
    } catch (error) {
      logger.error('Service error', { error, input });
      throw error;
    }
  }
}
```

### API Route Pattern

```typescript
// Standard API route
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    // Implementation
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

### Background Job Pattern

```typescript
// Queue job
await processingQueue.add('job-type', {
  data: jobData
});

// Process job
processingQueue.process('job-type', async (job) => {
  // Job processing
  return result;
});
```

### Vector Search Pattern

```typescript
// Generate embedding
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text
});

// Search
const results = await prisma.$queryRaw`
  SELECT *, 1 - (embedding <=> ${embedding}::vector) as similarity
  FROM nuggets
  WHERE 1 - (embedding <=> ${embedding}::vector) > 0.7
  ORDER BY similarity DESC
  LIMIT 20
`;
```

## Pitfalls to Avoid

### 1. pgvector Column Handling

**Problem:** Prisma doesn't natively support pgvector

**Solution:** Use `Unsupported` type and raw SQL for vector operations

```typescript
// ❌ Bad: Trying to use Prisma for vector operations
await prisma.nugget.update({
  where: { id },
  data: { embedding: vector } // Won't work
});

// ✅ Good: Use raw SQL
await prisma.$executeRaw`
  UPDATE nuggets
  SET embedding = ${JSON.stringify(vector)}::vector
  WHERE id = ${id}
`;
```

### 2. Tool Result Formatting

**Problem:** OpenAI requires JSON strings, not objects

**Solution:** Always stringify tool results

```typescript
// ❌ Bad: Returning object
return { success: true, data: result };

// ✅ Good: Return JSON string
return JSON.stringify({ success: true, data: result });
```

### 3. File Watching Stability

**Problem:** Processing files while still being written

**Solution:** Use `awaitWriteFinish` option

```typescript
// ✅ Good: Wait for file to stabilize
const watcher = chokidar.watch(path, {
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});
```

### 4. Cost Tracking

**Problem:** Forgetting to track costs

**Solution:** Always track AI API calls

```typescript
// ✅ Good: Track every call
await costTracker.trackAICall(
  'openai',
  'gpt-5.1-mini',
  'chat/completions',
  inputTokens,
  outputTokens,
  organizationId
);
```

### 5. Error Handling in Tools

**Problem:** Throwing errors in tool execution

**Solution:** Return error in result, don't throw

```typescript
// ❌ Bad: Throwing error
if (!nugget) {
  throw new Error('Not found');
}

// ✅ Good: Return error in result
if (!nugget) {
  return {
    success: false,
    error: { message: 'Nugget not found' }
  };
}
```

## Cost Optimization Tips

### 1. Use GPT-5.1 Nano for Simple Tasks

```typescript
// ✅ Good: Nano for metadata
const response = await openai.chat.completions.create({
  model: 'gpt-5.1-nano', // Cost-effective
  // ...
});

// ❌ Bad: Mini for everything
const response = await openai.chat.completions.create({
  model: 'gpt-5.1-mini', // Overkill for simple tasks
  // ...
});
```

### 2. Cache Embeddings

```typescript
// ✅ Good: Check cache first
const cached = await getCachedEmbedding(text);
if (cached) return cached;

const embedding = await generateEmbedding(text);
await cacheEmbedding(text, embedding);
return embedding;
```

### 3. Batch Processing

```typescript
// ✅ Good: Process in batches
const batches = chunkArray(items, 10);
for (const batch of batches) {
  await processBatch(batch);
}
```

### 4. Voice Tier Limits

```typescript
// ✅ Good: Set usage limits
const limit = getVoiceLimit(qualityTier);
if (usage >= limit) {
  return { error: 'Voice limit reached' };
}
```

## Troubleshooting Quick Fixes

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U user -d database

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Redis Connection Issues

```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Restart Redis
sudo systemctl restart redis-server
```

### Job Queue Not Processing

```bash
# Check queue status
redis-cli
> LLEN bull:content-processing:waiting

# Restart workers
pm2 restart worker
```

### pgvector Extension Missing

```sql
-- Connect to database
psql -U user -d database

-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Key Decisions Reference

### Technology Choices

- **Node.js for everything:** Unified stack, simpler development
- **PostgreSQL + pgvector:** Single database, vector search built-in
- **GPT-5.1 Mini/Nano:** Cost-effective, good quality
- **Proxmox VM:** Direct deployment, no Kubernetes complexity
- **Semantic chunking:** Preserves context, better than fixed-size
- **OpenAI image generation:** DALL-E 3 for illustrations
- **Three-tier voice:** Low/mid/high quality options

### Architecture Decisions

- **Tool-based AI:** Similar to organizational-ai-assistant pattern
- **Background jobs:** BullMQ for async processing
- **WebSocket:** Real-time updates
- **Multi-tenant:** Organization-based isolation
- **Zero-human-authoring:** Fully automated content creation

### Cost Decisions

- **Text-first:** 90% text mode, 10% voice mode
- **Model selection:** Nano for metadata, Mini for content/tutoring
- **Caching:** Embeddings, audio, images
- **Usage limits:** Per organization and per learner

---

This quick reference provides essential information for daily development. For detailed information, see the full architecture, API, and implementation documents.

