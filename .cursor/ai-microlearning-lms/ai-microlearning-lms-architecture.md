# AI Microlearning LMS - Detailed Architecture

**Complete system architecture, database schema, component design, and technology specifications.**

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Data Architecture](#data-architecture)
4. [Content Ingestion Service Architecture](#content-ingestion-service-architecture)
5. [AI Authoring Engine Architecture](#ai-authoring-engine-architecture)
6. [Narrative Planning Service Architecture](#narrative-planning-service-architecture)
7. [Learning Delivery Service Architecture](#learning-delivery-service-architecture)
8. [AI Integration Architecture](#ai-integration-architecture)
9. [Voice Integration Architecture](#voice-integration-architecture)
10. [Background Job Processing](#background-job-processing)
11. [Authentication & Authorization](#authentication--authorization)
12. [Real-Time Communication](#real-time-communication)
13. [File Storage Architecture](#file-storage-architecture)
14. [Semantic Search Architecture](#semantic-search-architecture)
15. [Security Architecture](#security-architecture)
16. [Performance Considerations](#performance-considerations)
17. [Cost Management Architecture](#cost-management-architecture)
18. [Monitoring & Observability](#monitoring--observability)
19. [Scalability Strategy](#scalability-strategy)
20. [Deployment Architecture](#deployment-architecture)

## System Architecture Overview

### Component Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  - Next.js App Router (React Server Components)              │
│  - Client Components (Learner Canvas, Admin Console)         │
│  - Tailwind CSS 4 + Heroicons                                │
│  - WebSocket Client (Real-time updates)                      │
│  - WebSpeech API (Browser voice input fallback)              │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Application Layer                         │
│  - Next.js API Routes (REST endpoints)                       │
│  - WebSocket Server (Real-time communication)                │
│  - Authentication Middleware (JWT)                            │
│  - Permission Middleware (RBAC)                               │
│  - Rate Limiting & Security                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Business Logic Layer                      │
│  - Content Ingestion Service (File watching, URL monitoring) │
│  - AI Authoring Engine (Content transformation)              │
│  - Narrative Planning Service (Adaptive path generation)    │
│  - Learning Delivery Service (Tutoring, session management) │
│  - Cost Tracking Service (Usage monitoring)                 │
│  - Analytics Service (Engagement tracking)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Data Access Layer                         │
│  - Prisma ORM (Database queries)                             │
│  - Vector Search (pgvector queries)                          │
│  - File System Access (File storage/retrieval)               │
│  - External API Clients (OpenAI, ElevenLabs)                 │
│  - Job Queue Client (BullMQ/Redis)                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Data Storage Layer                        │
│  - PostgreSQL (Relational data, metadata)                    │
│  - pgvector (Vector embeddings)                              │
│  - Redis (Job queue, caching)                                │
│  - Filesystem (File storage)                                 │
│  - External APIs (OpenAI, ElevenLabs)                        │
└─────────────────────────────────────────────────────────────┘
```

### Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                     │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │  Learner AI Canvas   │  │   Admin Console       │      │
│  └──────────────────────┘  └──────────────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              API Layer (Next.js API Routes)                  │
│  - /api/auth/* (Authentication)                              │
│  - /api/learning/* (Learning endpoints)                      │
│  - /api/admin/* (Admin endpoints)                            │
│  - /api/ingestion/* (Content ingestion)                      │
│  - /api/ws (WebSocket server)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│   Content    │ │   Learning   │ │    AI      │
│  Processing  │ │   Delivery   │ │  Services  │
│   Service    │ │   Service    │ │            │
└───────┬──────┘ └──────┬───────┘ └─────┬──────┘
        │               │               │
┌───────▼───────────────▼───────────────▼───────┐
│         Background Job Queue (BullMQ)          │
│  - content-processing queue                    │
│  - multimedia-generation queue                 │
│  - embedding-generation queue                  │
└─────────────────────────────────────────────────┘
        │
┌───────▼───────────────────────────────────────┐
│         PostgreSQL + pgvector                 │
│  - Nuggets, Learners, Sessions                │
│  - Narrative nodes, Analytics                 │
│  - System settings, Jobs                      │
└─────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4.0 (released Jan 2025 - performance improvements, streamlined config)
- **Icons:** Heroicons v2 (`@heroicons/react` - 24x24 outline and solid icons, designed for Tailwind)
- **State Management:** 
  - React Context (for simple, component-scoped state)
  - Zustand (for complex global state - lightweight, no providers needed)
- **Forms:** 
  - React Hook Form (performant form library)
  - Zod (schema validation, type-safe)
- **Real-Time:** 
  - WebSocket: `ws` library (server-side, lightweight, native WebSocket API)
  - WebSocket Client: Native browser WebSocket API (lightweight, no dependencies)
  - Alternative: Socket.io (if more features needed - auto-reconnect, rooms, fallback to polling)
  - **Decision:** Use native WebSocket for simplicity, add Socket.io only if needed
- **Voice Input:** WebSpeech API (browser fallback for voice input)
- **Animations:** 
  - Framer Motion (for complex animations, transitions)
  - Tailwind CSS transitions (for simple animations)
- **Date/Time:** date-fns (lightweight, tree-shakeable)
- **HTTP Client:** Native `fetch` API (built into Next.js)
- **Error Boundaries:** React Error Boundaries (for error handling)
- **Loading States:** React Suspense (for async components)

### Backend

- **Runtime:** Node.js 20+ LTS
- **Framework:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL 15+ with pgvector extension
- **Authentication:** JWT (custom implementation)
- **Job Queue:** BullMQ + Redis
- **File Watching:** chokidar
- **Web Scraping:** cheerio, puppeteer (for complex pages)
- **PDF Parsing:** pdf-parse
- **DOCX Parsing:** mammoth
- **Real-Time:** WebSocket (ws library)

### AI & External Services

- **OpenAI:**
  - **Chat:** GPT-5.1 Mini (content generation, tutoring, narrative planning)
  - **Chat:** GPT-5.1 Nano (metadata extraction, simple tasks)
  - **Embeddings:** text-embedding-3-small ($0.02 per 1M tokens)
  - **Image Generation:** DALL-E 3 ($0.040 per image)
  - **Speech-to-Text:** Whisper API ($0.006 per minute)
  - **Text-to-Speech:** TTS API
    - Standard: `tts-1` ($0.015 per 1K characters)
    - HD: `tts-1-hd` ($0.030 per 1K characters)
  - **Realtime API:** (Future: bidirectional voice)
- **ElevenLabs:**
  - **TTS:** High-quality voice synthesis
    - Free: 10,000 credits/month
    - Starter: $5/month for 30,000 credits
    - Creator: $22/month for 100,000 credits
    - Pro: $99/month for 500,000 credits
  - **STT:** Speech-to-text (uses credits)

### Infrastructure

- **VM:** Proxmox (Ubuntu Server 22.04 LTS)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **Cache/Queue:** Redis
- **File Storage:** Local filesystem
- **SSL/TLS:** Let's Encrypt (certbot)

## Data Architecture

### Database Design Principles

1. **Multi-Tenant Architecture:** Single database with organization-based isolation
2. **Vector Storage:** pgvector extension for semantic search embeddings
3. **Audit Trail:** All tables include audit fields (created_at, updated_at, etc.)
4. **JSONB for Flexibility:** Metadata, profiles, and configuration stored as JSONB
5. **Indexing Strategy:** Comprehensive indexes for performance

### Core Tables (High-Level)

- `organizations` - Multi-tenant support
- `users` - User accounts (admin, instructor, learner)
- `learners` - Learning profiles, mastery maps, knowledge gaps
- `nuggets` - Atomic learning units with embeddings
- `narrative_nodes` - Choose-your-own-adventure graph nodes
- `sessions` - Learning sessions
- `session_nodes` - Track narrative path through nodes
- `messages` - Conversation history
- `progress` - Concept mastery tracking
- `watched_folders` - Content ingestion configuration
- `monitored_urls` - URL monitoring configuration
- `ingestion_jobs` - Content processing jobs
- `nugget_sources` - Link nuggets to source files/URLs
- `system_settings` - Admin configuration
- `voice_configs` - Voice provider/model configuration
- `ai_model_configs` - AI model selection and parameters
- `analytics` - Engagement and usage tracking

See [Database Schema](ai-microlearning-lms-database.md) for complete schema.

## Content Ingestion Service Architecture

### Service Overview

**Purpose:** Automatically ingest raw content (PDFs, DOCX, TXT, URLs) and transform into learning nuggets with zero human intervention.

**Components:**
1. **File Watcher Service** - Monitors watched folders for new files
2. **URL Monitoring Service** - Periodically checks URLs for content changes
3. **Content Processor** - Extracts, chunks, and processes content
4. **Job Queue Integration** - Background processing via BullMQ

### File Watcher Service

**Implementation:**
```typescript
// src/services/content-ingestion/file-watcher.ts
import chokidar from 'chokidar';
import { PrismaClient } from '@prisma/client';
import { processingQueue } from './queue';

export class FileWatcherService {
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  async startWatching(folderId: string, folder: WatchedFolder) {
    const watcher = chokidar.watch(folder.path, {
      ignored: /(^|[\/\\])\../, // Ignore dotfiles
      persistent: true,
      ignoreInitial: true, // Don't process existing files on startup
      awaitWriteFinish: {
        stabilityThreshold: 2000, // Wait 2s after file stops changing
        pollInterval: 100 // Check every 100ms
      },
      depth: folder.recursive ? undefined : 0 // Recursive or not
    });
    
    watcher.on('add', async (filePath) => {
      if (this.isValidFileType(filePath, folder.fileTypes)) {
        await this.queueFileProcessing(filePath, folder);
      }
    });
    
    watcher.on('error', (error) => {
      logger.error('File watcher error', { folderId, error });
    });
    
    this.watchers.set(folderId, watcher);
    logger.info('Started watching folder', { folderId, path: folder.path });
  }
  
  async stopWatching(folderId: string) {
    const watcher = this.watchers.get(folderId);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(folderId);
      logger.info('Stopped watching folder', { folderId });
    }
  }
  
  private isValidFileType(filePath: string, allowedTypes: string[]): boolean {
    const ext = path.extname(filePath).toLowerCase().slice(1);
    return allowedTypes.includes(ext);
  }
  
  private async queueFileProcessing(
    filePath: string,
    folder: WatchedFolder
  ) {
    // Create ingestion job record
    const job = await this.prisma.ingestionJob.create({
      data: {
        type: 'file',
        source: filePath,
        organizationId: folder.organizationId,
        status: 'pending',
        metadata: {
          folderId: folder.id,
          fileName: path.basename(filePath),
          fileSize: (await fs.stat(filePath)).size
        }
      }
    });
    
    // Queue for processing
    await processingQueue.add('file', {
      jobId: job.id,
      type: 'file',
      source: filePath,
      organizationId: folder.organizationId,
      metadata: {
        folderId: folder.id,
        fileName: path.basename(filePath)
      }
    });
    
    logger.info('Queued file for processing', { jobId: job.id, filePath });
  }
}
```

**Features:**
- **Multiple watched folders:** Per organization, configurable paths
- **File type filtering:** Only process specified types (PDF, DOCX, TXT)
- **Recursive watching:** Option to watch subdirectories
- **Stability detection:** Wait for file to finish copying before processing
- **Error handling:** Log errors, continue watching other files
- **Admin configuration:** Add/remove watched folders via admin console

### URL Monitoring Service

**Implementation:**
```typescript
// src/services/content-ingestion/url-monitor.ts
export class URLMonitoringService {
  private prisma: PrismaClient;
  private checkInterval: NodeJS.Timeout | null = null;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  async checkURLs() {
    const urls = await this.prisma.monitoredURL.findMany({
      where: { enabled: true }
    });
    
    logger.info('Checking monitored URLs', { count: urls.length });
    
    for (const url of urls) {
      try {
        // Check if URL has changed
        const hasChanged = await this.checkURLChange(url);
        
        if (hasChanged) {
          await this.queueURLProcessing(url);
          await this.updateURLMetadata(url);
        }
      } catch (error) {
        logger.error('URL check failed', {
          urlId: url.id,
          url: url.url,
          error: (error as Error).message
        });
        // Continue with other URLs
      }
    }
  }
  
  private async checkURLChange(url: MonitoredURL): Promise<boolean> {
    const response = await fetch(url.url, {
      method: 'HEAD',
      headers: {
        'If-None-Match': url.etag || '',
        'If-Modified-Since': url.lastModified?.toUTCString() || '',
        'User-Agent': 'AI-Microlearning-LMS/1.0'
      }
    });
    
    if (response.status === 304) {
      // Not modified
      await this.prisma.monitoredURL.update({
        where: { id: url.id },
        data: { lastChecked: new Date() }
      });
      return false;
    }
    
    if (response.status === 200) {
      const newEtag = response.headers.get('ETag');
      const newModified = response.headers.get('Last-Modified');
      
      // Check if content changed
      if (newEtag !== url.etag || 
          (newModified && new Date(newModified) > (url.lastModified || new Date(0)))) {
        return true;
      }
    }
    
    return false;
  }
  
  private async queueURLProcessing(url: MonitoredURL) {
    // Create ingestion job record
    const job = await this.prisma.ingestionJob.create({
      data: {
        type: 'url',
        source: url.url,
        organizationId: url.organizationId,
        status: 'pending',
        metadata: {
          urlId: url.id
        }
      }
    });
    
    // Queue for processing
    await processingQueue.add('url', {
      jobId: job.id,
      type: 'url',
      source: url.url,
      organizationId: url.organizationId,
      metadata: {
        urlId: url.id
      }
    });
    
    logger.info('Queued URL for processing', { jobId: job.id, url: url.url });
  }
  
  private async updateURLMetadata(url: MonitoredURL) {
    const response = await fetch(url.url, { method: 'HEAD' });
    const etag = response.headers.get('ETag');
    const lastModified = response.headers.get('Last-Modified');
    
    await this.prisma.monitoredURL.update({
      where: { id: url.id },
      data: {
        lastChecked: new Date(),
        etag: etag || undefined,
        lastModified: lastModified ? new Date(lastModified) : undefined
      }
    });
  }
  
  start(intervalMinutes: number = 5) {
    // Run immediately
    this.checkURLs();
    
    // Then run at interval
    this.checkInterval = setInterval(
      () => this.checkURLs(),
      intervalMinutes * 60 * 1000
    );
    
    logger.info('URL monitoring started', { intervalMinutes });
  }
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('URL monitoring stopped');
    }
  }
}
```

**Features:**
- **Periodic polling:** Check URLs at configurable intervals (default: 5 minutes)
- **Change detection:** Use ETag/Last-Modified headers to detect changes
- **Web scraping:** Extract content from web pages using cheerio
- **Error handling:** Log errors, continue with other URLs
- **Admin configuration:** Add/remove URLs via admin console

### Content Processing Pipeline

**Processing Flow:**
```
1. Extract Text
   ├─ PDF → pdf-parse
   ├─ DOCX → mammoth
   ├─ TXT → readFile
   └─ URL → fetch + cheerio

2. Semantic Chunking
   ├─ Split by paragraphs
   ├─ Generate embeddings for paragraphs
   ├─ Cluster by similarity (threshold: 0.85)
   ├─ Combine clusters into chunks (max 2000 tokens)
   └─ Add overlap (15%)

3. Generate Embeddings
   ├─ Generate embedding for each chunk
   ├─ Store in pgvector
   └─ Link to nugget

4. Generate Multimedia
   ├─ Extract main concept from chunk
   ├─ Generate image (DALL-E 3)
   ├─ Download and store image
   └─ Link to nugget

5. Extract Metadata
   ├─ Use GPT-5.1 Nano (cost-effective)
   ├─ Extract: topics, difficulty, prerequisites, estimatedTime
   └─ Store in nugget metadata

6. Store Nuggets
   ├─ Create nugget records
   ├─ Link to source (file/URL)
   ├─ Update ingestion job status
   └─ Notify admin (WebSocket)
```

**Semantic Chunking Algorithm:**
```typescript
// src/services/content-ingestion/chunking.ts
export class SemanticChunker {
  async chunk(text: string): Promise<Chunk[]> {
    // 1. Split by paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0) {
      return [];
    }
    
    // 2. Generate embeddings for paragraphs
    const embeddings = await Promise.all(
      paragraphs.map(p => this.generateEmbedding(p))
    );
    
    // 3. Cluster by similarity
    const clusters: number[][] = [];
    let currentCluster: number[] = [0];
    
    for (let i = 1; i < paragraphs.length; i++) {
      const similarity = this.cosineSimilarity(
        embeddings[i - 1],
        embeddings[i]
      );
      
      if (similarity > 0.85) {
        // Similar topic, add to current cluster
        currentCluster.push(i);
      } else {
        // Topic shift, start new cluster
        clusters.push(currentCluster);
        currentCluster = [i];
      }
    }
    clusters.push(currentCluster);
    
    // 4. Combine clusters into chunks (max 2000 tokens)
    const chunks: Chunk[] = [];
    for (const cluster of clusters) {
      let chunkText = '';
      let chunkParagraphs: number[] = [];
      
      for (const paraIdx of cluster) {
        const paraText = paragraphs[paraIdx];
        const tokens = this.estimateTokens(chunkText + paraText);
        
        if (tokens > 2000) {
          // Current chunk is full, save it
          chunks.push({
            text: chunkText.trim(),
            paragraphIndices: chunkParagraphs,
            startIndex: chunkParagraphs[0],
            endIndex: chunkParagraphs[chunkParagraphs.length - 1]
          });
          
          // Start new chunk
          chunkText = paraText;
          chunkParagraphs = [paraIdx];
        } else {
          chunkText += '\n\n' + paraText;
          chunkParagraphs.push(paraIdx);
        }
      }
      
      // Save remaining chunk
      if (chunkText.trim()) {
        chunks.push({
          text: chunkText.trim(),
          paragraphIndices: chunkParagraphs,
          startIndex: chunkParagraphs[0],
          endIndex: chunkParagraphs[chunkParagraphs.length - 1]
        });
      }
    }
    
    // 5. Add overlap between chunks (15%)
    return this.addOverlap(chunks, 0.15);
  }
  
  private addOverlap(chunks: Chunk[], overlapPercent: number): Chunk[] {
    if (chunks.length <= 1) {
      return chunks;
    }
    
    const overlapped: Chunk[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let text = chunk.text;
      
      // Add overlap from previous chunk
      if (i > 0) {
        const prevChunk = chunks[i - 1];
        const prevText = prevChunk.text;
        const overlapSize = Math.floor(prevText.length * overlapPercent);
        const overlapText = prevText.slice(-overlapSize);
        text = overlapText + '\n\n' + text;
      }
      
      // Add overlap to next chunk
      if (i < chunks.length - 1) {
        const nextChunk = chunks[i + 1];
        const nextText = nextChunk.text;
        const overlapSize = Math.floor(nextText.length * overlapPercent);
        const overlapText = nextText.slice(0, overlapSize);
        text = text + '\n\n' + overlapText;
      }
      
      overlapped.push({
        ...chunk,
        text
      });
    }
    
    return overlapped;
  }
  
  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000) // Limit to 8k tokens
    });
    
    return response.data[0].embedding;
  }
}
```

**Text Extraction:**
```typescript
// src/services/content-ingestion/extraction.ts
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { readFile } from 'fs/promises';
import * as cheerio from 'cheerio';

export class TextExtractor {
  async extract(source: string, type: 'file' | 'url'): Promise<string> {
    switch (type) {
      case 'file':
        return await this.extractFromFile(source);
      case 'url':
        return await this.extractFromURL(source);
      default:
        throw new Error(`Unsupported source type: ${type}`);
    }
  }
  
  private async extractFromFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.pdf':
        const pdfBuffer = await readFile(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
        
      case '.docx':
        const docxBuffer = await readFile(filePath);
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        return result.value;
        
      case '.txt':
        return await readFile(filePath, 'utf-8');
        
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }
  
  private async extractFromURL(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AI-Microlearning-LMS/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style').remove();
    
    // Extract text from main content areas
    const text = $('article, main, .content, .post, body')
      .map((_, el) => $(el).text())
      .get()
      .join('\n\n');
    
    return text.trim();
  }
}
```

**Metadata Extraction:**
```typescript
// src/services/content-ingestion/metadata.ts
export class MetadataExtractor {
  async extractMetadata(chunks: Chunk[]): Promise<Metadata[]> {
    const modelConfig = await this.getModelConfig('metadata');
    
    return Promise.all(chunks.map(async (chunk) => {
      const response = await openai.chat.completions.create({
        model: modelConfig.metadataModel || 'gpt-5.1-nano',
        messages: [{
          role: 'system',
          content: `Extract metadata from this educational content chunk. Return JSON with:
- topics: array of main topics covered
- difficulty: number 1-10 (1=elementary, 10=expert)
- prerequisites: array of concepts needed to understand this
- estimatedTime: number (minutes to read/understand)
- relatedConcepts: array of related concepts`
        }, {
          role: 'user',
          content: chunk.text.substring(0, 8000) // Limit to 8k tokens
        }],
        response_format: { type: 'json_object' },
        temperature: 0.3 // Low temperature for consistent extraction
      });
      
      const metadata = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate and normalize
      return {
        topics: Array.isArray(metadata.topics) ? metadata.topics : [],
        difficulty: Math.max(1, Math.min(10, metadata.difficulty || 5)),
        prerequisites: Array.isArray(metadata.prerequisites) ? metadata.prerequisites : [],
        estimatedTime: Math.max(1, metadata.estimatedTime || 5),
        relatedConcepts: Array.isArray(metadata.relatedConcepts) ? metadata.relatedConcepts : []
      };
    }));
  }
}
```

**Image Generation:**
```typescript
// src/services/content-ingestion/images.ts
export class ImageGenerator {
  async generateImages(chunks: Chunk[]): Promise<string[]> {
    const images: string[] = [];
    
    for (const chunk of chunks) {
      try {
        // Extract main concept from chunk
        const concept = await this.extractMainConcept(chunk.text);
        
        // Generate image for concept
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: `Educational illustration: ${concept}. Clean, professional, suitable for learning materials. No text in image.`,
          size: '1024x1024',
          quality: 'standard',
          n: 1
        });
        
        // Download and store image
        const imageUrl = imageResponse.data[0].url;
        const imagePath = await this.downloadAndStoreImage(
          imageUrl,
          `nugget-${chunk.id}`
        );
        
        images.push(imagePath);
        
        logger.info('Generated image for chunk', {
          chunkId: chunk.id,
          concept,
          imagePath
        });
      } catch (error) {
        logger.error('Image generation failed', {
          chunkId: chunk.id,
          error: (error as Error).message
        });
        // Continue without image
        images.push('');
      }
    }
    
    return images;
  }
  
  private async extractMainConcept(text: string): Promise<string> {
    // Use GPT to extract main concept (quick, cost-effective)
    const response = await openai.chat.completions.create({
      model: 'gpt-5.1-nano',
      messages: [{
        role: 'system',
        content: 'Extract the main concept or topic from this educational content. Return a single, concise phrase (3-5 words) that describes what this content is about.'
      }, {
        role: 'user',
        content: text.substring(0, 2000) // First 2000 chars
      }],
      temperature: 0.3
    });
    
    return response.choices[0].message.content?.trim() || 'Educational content';
  }
  
  private async downloadAndStoreImage(
    url: string,
    filename: string
  ): Promise<string> {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const dir = path.join('storage', 'images', new Date().toISOString().split('T')[0]);
    await fs.mkdir(dir, { recursive: true });
    
    const filePath = path.join(dir, `${filename}.png`);
    await fs.writeFile(filePath, buffer);
    
    return filePath;
  }
}
```

## AI Authoring Engine Architecture

### Service Overview

**Purpose:** Transform raw content nuggets into comprehensive learning packages with slides, audio scripts, and multimedia.

**Components:**
1. **Slide Generator** - Creates structured slides from nugget content
2. **Audio Script Generator** - Generates natural, conversational audio scripts
3. **Audio Generator** - Creates audio files using configured TTS provider
4. **Learning Package Assembler** - Combines all components into learning package

### Slide Generation

```typescript
// src/services/ai-authoring/slides.ts
export class SlideGenerator {
  async generateSlides(
    nugget: Nugget,
    config: ModelConfig
  ): Promise<Slide[]> {
    const response = await openai.chat.completions.create({
      model: config.contentGenerationModel || 'gpt-5.1-mini',
      messages: [{
        role: 'system',
        content: `Transform this educational content into structured slides. Each slide should be:
- Markdown-formatted
- Have a clear heading
- Use bullet points for key information
- Be concise but informative
- Suitable for learning materials

Return JSON with array of slides: { slides: [{ title: string, content: string }] }`
      }, {
        role: 'user',
        content: nugget.content
      }],
      response_format: { type: 'json_object' },
      temperature: config.contentGenerationTemp || 0.7
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{}');
    const slides = result.slides || [];
    
    // Validate and normalize slides
    return slides.map((slide: any, index: number) => ({
      id: `slide-${nugget.id}-${index}`,
      title: slide.title || `Slide ${index + 1}`,
      content: slide.content || '',
      order: index
    }));
  }
}
```

### Audio Script Generation

```typescript
// src/services/ai-authoring/audio-scripts.ts
export class AudioScriptGenerator {
  async generateScripts(
    slides: Slide[],
    config: ModelConfig
  ): Promise<AudioScript[]> {
    return Promise.all(slides.map(async (slide) => {
      const response = await openai.chat.completions.create({
        model: config.contentGenerationModel || 'gpt-5.1-mini',
        messages: [{
          role: 'system',
          content: `Convert this slide content into a natural, conversational audio script suitable for text-to-speech. The script should:
- Be conversational and engaging
- Use natural language (not robotic)
- Include appropriate pauses (indicated by ...)
- Emphasize key points
- Be suitable for educational narration

Return the script as plain text.`
        }, {
          role: 'user',
          content: `${slide.title}\n\n${slide.content}`
        }],
        temperature: 0.8 // Higher temperature for more natural language
      });
      
      const script = response.choices[0].message.content || '';
      
      return {
        slideId: slide.id,
        script,
        ssml: this.convertToSSML(script)
      };
    }));
  }
  
  private convertToSSML(script: string): string {
    // Convert plain text to SSML for better TTS quality
    // Add pauses, emphasis, etc.
    let ssml = script
      .replace(/\.\.\./g, '<break time="1s"/>')
      .replace(/\./g, '<break time="0.5s"/>')
      .replace(/\*\*(.+?)\*\*/g, '<emphasis level="strong">$1</emphasis>')
      .replace(/\*(.+?)\*/g, '<emphasis level="moderate">$1</emphasis>');
    
    return `<speak>${ssml}</speak>`;
  }
}
```

### Audio Generation

```typescript
// src/services/ai-authoring/audio.ts
export class AudioGenerator {
  async generateAudio(
    scripts: AudioScript[],
    organizationId: string
  ): Promise<string[]> {
    const voiceConfig = await this.getVoiceConfig(organizationId);
    
    return Promise.all(scripts.map(async (script) => {
      try {
        if (voiceConfig.ttsProvider === 'openai-standard') {
          return await this.generateOpenAIAudio(script.ssml, 'tts-1', voiceConfig);
        } else if (voiceConfig.ttsProvider === 'openai-hd') {
          return await this.generateOpenAIAudio(script.ssml, 'tts-1-hd', voiceConfig);
        } else if (voiceConfig.ttsProvider === 'elevenlabs') {
          return await this.generateElevenLabsAudio(script.ssml, voiceConfig);
        } else {
          throw new Error(`Unknown TTS provider: ${voiceConfig.ttsProvider}`);
        }
      } catch (error) {
        logger.error('Audio generation failed', {
          scriptId: script.slideId,
          error: (error as Error).message
        });
        // Return empty string, continue without audio
        return '';
      }
    }));
  }
  
  private async generateOpenAIAudio(
    text: string,
    model: 'tts-1' | 'tts-1-hd',
    config: VoiceConfig
  ): Promise<string> {
    // Remove SSML tags (OpenAI TTS doesn't support SSML)
    const plainText = text.replace(/<[^>]+>/g, '');
    
    const response = await openai.audio.speech.create({
      model,
      voice: (config.ttsVoice as any) || 'alloy',
      input: plainText
    });
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(
      'storage',
      'audio',
      new Date().toISOString().split('T')[0],
      `${Date.now()}.mp3`
    );
    
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    
    return filePath;
  }
  
  private async generateElevenLabsAudio(
    text: string,
    config: VoiceConfig
  ): Promise<string> {
    // ElevenLabs API call
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + (config.ttsVoice || 'default'), {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text.replace(/<[^>]+>/g, ''), // Remove SSML
        model_id: config.ttsModel || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(
      'storage',
      'audio',
      new Date().toISOString().split('T')[0],
      `${Date.now()}.mp3`
    );
    
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    
    return filePath;
  }
}
```

## Narrative Planning Service Architecture

### Service Overview

**Purpose:** Create adaptive, choose-your-own-adventure style narrative paths that adapt to learner choices and knowledge gaps.

**Components:**
1. **Narrative Planner** - Generates narrative nodes with choices
2. **Choice Evaluator** - Evaluates learner choices to detect gaps/mastery
3. **Path Adapter** - Adapts narrative path based on learner state
4. **Node Generator** - Creates narrative nodes from nuggets

### Narrative Planning Algorithm

```typescript
// src/services/narrative-planning/planner.ts
export class NarrativePlanner {
  async planNextNode(
    learnerId: string,
    currentNodeId: string | null,
    choiceId: string | null
  ): Promise<NarrativeNode> {
    const learner = await this.getLearner(learnerId);
    const modelConfig = await this.getModelConfig('narrative');
    
    // Evaluate choice if provided
    if (choiceId) {
      await this.evaluateChoice(learnerId, choiceId);
      // Refresh learner data after evaluation
      learner = await this.getLearner(learnerId);
    }
    
    // Analyze learner state
    const gaps = learner.knowledgeGaps || [];
    const mastery = learner.masteryMap || {};
    
    // Find relevant nuggets addressing gaps
    const relevantNuggets = await this.findRelevantNuggets(
      gaps,
      mastery,
      learner.organizationId
    );
    
    if (relevantNuggets.length === 0) {
      // No relevant nuggets, generate generic node
      return await this.generateGenericNode(learner);
    }
    
    // Generate narrative node with choices
    const node = await this.generateNarrativeNode(
      relevantNuggets[0],
      gaps,
      mastery,
      modelConfig,
      learner
    );
    
    return node;
  }
  
  private async evaluateChoice(
    learnerId: string,
    choiceId: string
  ): Promise<void> {
    const choice = await this.getChoice(choiceId);
    const learner = await this.getLearner(learnerId);
    
    // Detect knowledge gaps from choice
    if (choice.revealsGap && choice.revealsGap.length > 0) {
      await this.updateKnowledgeGaps(learnerId, choice.revealsGap);
    }
    
    // Confirm mastery from choice
    if (choice.confirmsMastery && choice.confirmsMastery.length > 0) {
      await this.updateMastery(learnerId, choice.confirmsMastery, 10); // +10 points
    }
  }
  
  private async findRelevantNuggets(
    gaps: string[],
    mastery: Record<string, number>,
    organizationId: string
  ): Promise<Nugget[]> {
    if (gaps.length === 0) {
      // No gaps, find advanced nuggets
      return await this.findAdvancedNuggets(organizationId);
    }
    
    // Generate embeddings for knowledge gaps
    const gapEmbeddings = await Promise.all(
      gaps.map(gap => this.generateEmbedding(gap))
    );
    
    // Vector search for relevant nuggets
    const nuggets = await prisma.$queryRaw<Nugget[]>`
      SELECT n.*, 
             MIN(1 - (n.embedding <=> q.embedding::vector)) as similarity
      FROM nuggets n
      CROSS JOIN UNNEST(${gapEmbeddings}::vector[]) as q(embedding)
      WHERE n.organization_id = ${organizationId}
        AND n.status = 'ready'
        AND 1 - (n.embedding <=> q.embedding::vector) > 0.7
      GROUP BY n.id
      ORDER BY similarity DESC
      LIMIT 10
    `;
    
    return nuggets;
  }
  
  private async generateNarrativeNode(
    nugget: Nugget,
    gaps: string[],
    mastery: Record<string, number>,
    config: ModelConfig,
    learner: Learner
  ): Promise<NarrativeNode> {
    const response = await openai.chat.completions.create({
      model: config.narrativePlanningModel || 'gpt-5.1-mini',
      messages: [{
        role: 'system',
        content: `Generate a choose-your-own-adventure style narrative node with 3-4 choices. Each choice should:
- Lead to different learning paths
- Address specific knowledge gaps if present
- Confirm mastery if learner demonstrates understanding
- Be engaging and natural

Return JSON with: { choices: [{ id: string, text: string, nextNodeId: string, revealsGap: string[], confirmsMastery: string[] }] }`
      }, {
        role: 'user',
        content: `Nugget content: ${nugget.content.substring(0, 4000)}

Knowledge gaps: ${gaps.join(', ') || 'None identified'}

Generate narrative choices that adapt to these gaps and create an engaging learning path.`
      }],
      response_format: { type: 'json_object' },
      temperature: config.narrativePlanningTemp || 0.8
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{}');
    const choices = result.choices || [];
    
    // Create narrative node
    const node = await prisma.narrativeNode.create({
      data: {
        nuggetId: nugget.id,
        organizationId: nugget.organizationId,
        choices: choices.map((c: any) => ({
          id: c.id || `choice-${Date.now()}-${Math.random()}`,
          text: c.text,
          nextNodeId: c.nextNodeId || null, // Will be set when next node is created
          revealsGap: Array.isArray(c.revealsGap) ? c.revealsGap : [],
          confirmsMastery: Array.isArray(c.confirmsMastery) ? c.confirmsMastery : []
        })),
        adaptsTo: gaps,
        prerequisites: (nugget.metadata as any)?.prerequisites || []
      }
    });
    
    return node;
  }
}
```

## Learning Delivery Service Architecture

### Service Overview

**Purpose:** Deliver learning content through conversational AI tutor, manage sessions, track progress, and adapt narrative paths.

**Components:**
1. **Session Manager** - Creates and manages learning sessions
2. **AI Tutor** - Conversational AI with tool calling
3. **Progress Tracker** - Tracks mastery and knowledge gaps
4. **Narrative Navigator** - Manages navigation through narrative nodes

### AI Tutor Implementation

```typescript
// src/services/learning-delivery/tutor.ts
export class AITutor {
  async processMessage(
    sessionId: string,
    message: string,
    mode: 'text' | 'voice'
  ): Promise<TutorResponse> {
    const session = await this.getSession(sessionId);
    const learner = await this.getLearner(session.learnerId);
    const modelConfig = await this.getModelConfig('tutoring');
    
    // Get conversation history
    const history = await this.getConversationHistory(sessionId, 20); // Last 20 messages
    
    // Get current narrative context
    const currentNode = session.currentNodeId 
      ? await this.getNarrativeNode(session.currentNodeId)
      : null;
    
    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(learner, currentNode, modelConfig);
    
    // Call AI with tools
    const response = await openai.chat.completions.create({
      model: modelConfig.tutoringModel || 'gpt-5.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      tools: this.getTutorTools(),
      tool_choice: 'auto',
      temperature: modelConfig.tutoringTemp || 0.7,
      stream: false
    });
    
    const assistantMessage = response.choices[0].message;
    
    // Process tool calls
    const toolResults = assistantMessage.tool_calls
      ? await this.processToolCalls(
          assistantMessage.tool_calls,
          session,
          learner
        )
      : [];
    
    // Continue conversation with tool results if needed
    let finalContent = assistantMessage.content || '';
    
    if (toolResults.length > 0) {
      // Add tool results to conversation and get final response
      const finalResponse = await openai.chat.completions.create({
        model: modelConfig.tutoringModel || 'gpt-5.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: message },
          assistantMessage,
          ...toolResults.map(tr => ({
            role: 'tool' as const,
            tool_call_id: tr.toolCallId,
            content: JSON.stringify(tr.result)
          })),
        ],
        temperature: modelConfig.tutoringTemp || 0.7
      });
      
      finalContent = finalResponse.choices[0].message.content || '';
    }
    
    // Save messages
    await this.saveMessages(sessionId, message, finalContent, toolResults);
    
    // Update session activity
    await this.updateSessionActivity(sessionId);
    
    return {
      content: finalContent,
      toolCalls: toolResults,
      nextNode: await this.getNextNode(session, learner)
    };
  }
  
  private buildSystemPrompt(
    learner: Learner,
    currentNode: NarrativeNode | null,
    config: ModelConfig
  ): string {
    const profile = learner.profile as any;
    const mastery = learner.masteryMap as Record<string, number>;
    const gaps = learner.knowledgeGaps || [];
    
    return `You are an AI tutor helping a learner through an adaptive learning experience.

Learner Profile:
- Interests: ${profile?.interests?.join(', ') || 'Not specified'}
- Goals: ${profile?.goals || 'Not specified'}
- Learning Style: ${profile?.learningStyle || 'Not specified'}

Current Knowledge:
- Mastery: ${Object.entries(mastery).slice(0, 5).map(([k, v]) => `${k}: ${v}%`).join(', ')}
- Knowledge Gaps: ${gaps.slice(0, 5).join(', ') || 'None identified'}

Current Narrative Context:
${currentNode ? `- Current Topic: ${(currentNode.nugget.metadata as any)?.topics?.[0] || 'General'}\n- Available Choices: ${currentNode.choices.length}` : '- Starting new learning path'}

Your Role:
- Deliver learning content naturally through conversation
- Ask organic questions to assess understanding (no traditional quizzes)
- Adapt explanations based on learner's knowledge level
- Use tools to update mastery and adapt narrative path
- Be engaging, supportive, and encouraging
- If learner struggles, provide simpler explanations or additional examples
- If learner demonstrates mastery, move to more advanced topics

Remember: This is a conversation, not a test. Make learning enjoyable and natural.`;
  }
  
  private getTutorTools() {
    return [
      {
        type: 'function' as const,
        function: {
          name: 'deliver_nugget',
          description: 'Deliver a learning nugget to the learner. Use this when you want to present new content.',
          parameters: {
            type: 'object',
            properties: {
              nuggetId: {
                type: 'string',
                description: 'ID of the nugget to deliver'
              },
              format: {
                type: 'string',
                enum: ['text', 'audio', 'multimedia'],
                description: 'How to deliver the nugget'
              }
            },
            required: ['nuggetId']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'ask_question',
          description: 'Ask learner an organic question to assess understanding. Use this naturally in conversation, not as a formal quiz.',
          parameters: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The question to ask'
              },
              context: {
                type: 'string',
                description: 'What concept this question tests'
              },
              expectedAnswer: {
                type: 'string',
                description: 'Expected answer for evaluation (optional)'
              }
            },
            required: ['question', 'context']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'update_mastery',
          description: 'Update learner mastery level for a concept based on their responses or demonstrated understanding.',
          parameters: {
            type: 'object',
            properties: {
              conceptId: {
                type: 'string',
                description: 'Concept identifier'
              },
              masteryLevel: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'New mastery level (0-100)'
              },
              evidence: {
                type: 'string',
                description: 'Why this assessment (e.g., "Correctly explained X concept")'
              }
            },
            required: ['conceptId', 'masteryLevel', 'evidence']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'adapt_narrative',
          description: 'Change narrative path based on learner needs. Use when learner needs different content or difficulty level.',
          parameters: {
            type: 'object',
            properties: {
              reason: {
                type: 'string',
                description: 'Why the path needs to change'
              },
              newPath: {
                type: 'array',
                items: { type: 'string' },
                description: 'Nugget IDs for new path'
              }
            },
            required: ['reason', 'newPath']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'show_media',
          description: 'Display image or video widget in the learner interface.',
          parameters: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['image', 'video'],
                description: 'Type of media'
              },
              url: {
                type: 'string',
                description: 'URL or path to media'
              },
              caption: {
                type: 'string',
                description: 'Caption for the media'
              }
            },
            required: ['type', 'url']
          }
        }
      }
    ];
  }
  
  private async processToolCalls(
    toolCalls: ToolCall[],
    session: Session,
    learner: Learner
  ): Promise<ToolResult[]> {
    return Promise.all(toolCalls.map(async (call) => {
      const args = JSON.parse(call.function.arguments);
      
      try {
        switch (call.function.name) {
          case 'deliver_nugget':
            return await this.deliverNugget(args, session, call.id);
          case 'ask_question':
            return await this.askQuestion(args, session, call.id);
          case 'update_mastery':
            return await this.updateMastery(args, learner, call.id);
          case 'adapt_narrative':
            return await this.adaptNarrative(args, session, call.id);
          case 'show_media':
            return await this.showMedia(args, session, call.id);
          default:
            throw new Error(`Unknown tool: ${call.function.name}`);
        }
      } catch (error) {
        logger.error('Tool execution failed', {
          tool: call.function.name,
          error: (error as Error).message
        });
        
        return {
          toolCallId: call.id,
          toolName: call.function.name,
          result: {
            success: false,
            error: (error as Error).message
          }
        };
      }
    }));
  }
  
  private async deliverNugget(
    args: { nuggetId: string; format?: string },
    session: Session,
    toolCallId: string
  ): Promise<ToolResult> {
    const nugget = await prisma.nugget.findUnique({
      where: { id: args.nuggetId }
    });
    
    if (!nugget) {
      throw new Error(`Nugget not found: ${args.nuggetId}`);
    }
    
    // Track nugget delivery
    await prisma.analytics.create({
      data: {
        learnerId: session.learnerId,
        organizationId: session.organizationId,
        eventType: 'nugget_delivered',
        eventData: {
          nuggetId: args.nuggetId,
          format: args.format || 'text',
          sessionId: session.id
        }
      }
    });
    
    return {
      toolCallId,
      toolName: 'deliver_nugget',
      result: {
        success: true,
        nugget: {
          id: nugget.id,
          content: nugget.content,
          imageUrl: nugget.imageUrl,
          audioUrl: nugget.audioUrl,
          format: args.format || 'text'
        }
      }
    };
  }
  
  private async askQuestion(
    args: { question: string; context: string; expectedAnswer?: string },
    session: Session,
    toolCallId: string
  ): Promise<ToolResult> {
    // Track question asked
    await prisma.analytics.create({
      data: {
        learnerId: session.learnerId,
        organizationId: session.organizationId,
        eventType: 'question_asked',
        eventData: {
          question: args.question,
          context: args.context,
          sessionId: session.id
        }
      }
    });
    
    return {
      toolCallId,
      toolName: 'ask_question',
      result: {
        success: true,
        question: args.question,
        context: args.context,
        expectedAnswer: args.expectedAnswer
      }
    };
  }
  
  private async updateMastery(
    args: { conceptId: string; masteryLevel: number; evidence: string },
    learner: Learner,
    toolCallId: string
  ): Promise<ToolResult> {
    // Update or create progress record
    await prisma.progress.upsert({
      where: {
        learnerId_concept: {
          learnerId: learner.id,
          concept: args.conceptId
        }
      },
      create: {
        learnerId: learner.id,
        concept: args.conceptId,
        masteryLevel: args.masteryLevel,
        evidence: args.evidence
      },
      update: {
        masteryLevel: args.masteryLevel,
        evidence: args.evidence
      }
    });
    
    // Update learner mastery map
    const masteryMap = learner.masteryMap as Record<string, number>;
    masteryMap[args.conceptId] = args.masteryLevel;
    
    await prisma.learner.update({
      where: { id: learner.id },
      data: { masteryMap }
    });
    
    // Track mastery update
    await prisma.analytics.create({
      data: {
        learnerId: learner.id,
        organizationId: learner.organizationId,
        eventType: 'mastery_updated',
        eventData: {
          concept: args.conceptId,
          masteryLevel: args.masteryLevel,
          evidence: args.evidence
        }
      }
    });
    
    return {
      toolCallId,
      toolName: 'update_mastery',
      result: {
        success: true,
        concept: args.conceptId,
        masteryLevel: args.masteryLevel
      }
    };
  }
  
  private async adaptNarrative(
    args: { reason: string; newPath: string[] },
    session: Session,
    toolCallId: string
  ): Promise<ToolResult> {
    // Update session path
    const pathHistory = session.pathHistory as string[];
    pathHistory.push(...args.newPath);
    
    await prisma.session.update({
      where: { id: session.id },
      data: { pathHistory }
    });
    
    // Track narrative adaptation
    await prisma.analytics.create({
      data: {
        learnerId: session.learnerId,
        organizationId: session.organizationId,
        eventType: 'narrative_adapted',
        eventData: {
          reason: args.reason,
          newPath: args.newPath,
          sessionId: session.id
        }
      }
    });
    
    return {
      toolCallId,
      toolName: 'adapt_narrative',
      result: {
        success: true,
        reason: args.reason,
        newPath: args.newPath
      }
    };
  }
  
  private async showMedia(
    args: { type: string; url: string; caption?: string },
    session: Session,
    toolCallId: string
  ): Promise<ToolResult> {
    // Track media display
    await prisma.analytics.create({
      data: {
        learnerId: session.learnerId,
        organizationId: session.organizationId,
        eventType: 'media_shown',
        eventData: {
          type: args.type,
          url: args.url,
          caption: args.caption,
          sessionId: session.id
        }
      }
    });
    
    return {
      toolCallId,
      toolName: 'show_media',
      result: {
        success: true,
        type: args.type,
        url: args.url,
        caption: args.caption
      }
    };
  }
}
```

## AI Integration Architecture

### Model Configuration

**Model Selection Strategy:**
- **Content Generation:** GPT-5.1 Mini (quality needed for learning content)
- **Narrative Planning:** GPT-5.1 Mini (complex reasoning for adaptive paths)
- **Tutoring:** GPT-5.1 Mini (conversational quality)
- **Metadata Extraction:** GPT-5.1 Nano (cost-effective, simple task)
- **Embeddings:** text-embedding-3-small (cost-effective, good quality)

**Configuration Management:**
```typescript
// src/lib/ai/model-config.ts
export class ModelConfigService {
  async getModelConfig(
    scope: 'system' | 'organization' | 'learner',
    scopeId?: string,
    type: 'content' | 'narrative' | 'tutoring' | 'metadata' = 'tutoring'
  ): Promise<AIModelConfig> {
    // Try learner-specific config first
    if (scope === 'learner' && scopeId) {
      const config = await prisma.aIModelConfig.findFirst({
        where: { scope: 'learner', scopeId }
      });
      if (config) return config;
    }
    
    // Try organization-specific config
    if (scope === 'organization' && scopeId) {
      const config = await prisma.aIModelConfig.findFirst({
        where: { scope: 'organization', scopeId }
      });
      if (config) return config;
    }
    
    // Fall back to system default
    const config = await prisma.aIModelConfig.findFirst({
      where: { scope: 'system' }
    });
    
    if (!config) {
      // Return hardcoded defaults
      return this.getDefaultConfig(type);
    }
    
    return config;
  }
  
  private getDefaultConfig(type: string): AIModelConfig {
    const defaults = {
      content: {
        contentGenerationModel: 'gpt-5.1-mini',
        contentGenerationTemp: 0.7
      },
      narrative: {
        narrativePlanningModel: 'gpt-5.1-mini',
        narrativePlanningTemp: 0.8
      },
      tutoring: {
        tutoringModel: 'gpt-5.1-mini',
        tutoringTemp: 0.7
      },
      metadata: {
        metadataModel: 'gpt-5.1-nano'
      }
    };
    
    return {
      ...defaults[type as keyof typeof defaults],
      embeddingModel: 'text-embedding-3-small'
    } as AIModelConfig;
  }
}
```

### Cost Tracking

```typescript
// src/lib/ai/cost-tracking.ts
export class CostTracker {
  async trackAICall(
    provider: string,
    model: string,
    endpoint: string,
    inputTokens: number,
    outputTokens: number,
    organizationId: string
  ) {
    const costs = this.calculateCost(provider, model, inputTokens, outputTokens);
    
    await prisma.analytics.create({
      data: {
        organizationId,
        eventType: 'ai_api_call',
        eventData: {
          provider,
          model,
          endpoint,
          inputTokens,
          outputTokens,
          inputCost: costs.input,
          outputCost: costs.output,
          totalCost: costs.total
        }
      }
    });
    
    // Update organization cost tracking
    await this.updateOrganizationCosts(organizationId, costs.total);
  }
  
  private calculateCost(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): { input: number; output: number; total: number } {
    const pricing = this.getPricing(provider, model);
    
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  }
  
  private getPricing(provider: string, model: string) {
    const pricing: Record<string, { input: number; output: number }> = {
      'openai-gpt-5.1-mini': { input: 0.25, output: 2.00 },
      'openai-gpt-5.1-nano': { input: 0.05, output: 0.40 },
      'openai-text-embedding-3-small': { input: 0.02, output: 0 },
      'openai-dall-e-3': { input: 0, output: 0.040 }, // Per image
      'openai-whisper': { input: 0.006, output: 0 }, // Per minute
      'openai-tts-1': { input: 0.015, output: 0 }, // Per 1K characters
      'openai-tts-1-hd': { input: 0.030, output: 0 }, // Per 1K characters
    };
    
    const key = `${provider}-${model}`;
    return pricing[key] || { input: 0, output: 0 };
  }
}
```

## Voice Integration Architecture

### Voice Configuration

**Three-Tier System:**
1. **Low Quality, Low Cost:** OpenAI Standard TTS (`tts-1`)
2. **Mid Quality, Mid Cost:** OpenAI HD TTS (`tts-1-hd`)
3. **High Quality, High Cost:** ElevenLabs

**Configuration Management:**
```typescript
// src/lib/voice/config.ts
export class VoiceConfigService {
  async getVoiceConfig(
    scope: 'system' | 'organization' | 'learner',
    scopeId?: string
  ): Promise<VoiceConfig> {
    // Try learner-specific config first
    if (scope === 'learner' && scopeId) {
      const config = await prisma.voiceConfig.findFirst({
        where: { scope: 'learner', scopeId }
      });
      if (config) return config;
    }
    
    // Try organization-specific config
    if (scope === 'organization' && scopeId) {
      const config = await prisma.voiceConfig.findFirst({
        where: { scope: 'organization', scopeId }
      });
      if (config) return config;
    }
    
    // Fall back to system default
    const config = await prisma.voiceConfig.findFirst({
      where: { scope: 'system' }
    });
    
    if (!config) {
      return this.getDefaultConfig();
    }
    
    return config;
  }
  
  private getDefaultConfig(): VoiceConfig {
    return {
      ttsProvider: 'openai-standard',
      ttsModel: 'tts-1',
      ttsVoice: 'alloy',
      sttProvider: 'openai-whisper',
      sttModel: 'whisper-1',
      qualityTier: 'low'
    };
  }
}
```

### Voice Input Processing

```typescript
// src/lib/voice/input.ts
export class VoiceInputProcessor {
  async processAudio(
    audioBuffer: ArrayBuffer,
    config: VoiceConfig
  ): Promise<string> {
    if (config.sttProvider === 'openai-whisper') {
      return await this.processWithWhisper(audioBuffer);
    } else if (config.sttProvider === 'elevenlabs') {
      return await this.processWithElevenLabs(audioBuffer, config);
    } else {
      throw new Error(`Unknown STT provider: ${config.sttProvider}`);
    }
  }
  
  private async processWithWhisper(audioBuffer: ArrayBuffer): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.text;
  }
  
  private async processWithElevenLabs(
    audioBuffer: ArrayBuffer,
    config: VoiceConfig
  ): Promise<string> {
    // ElevenLabs STT implementation
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio: Buffer.from(audioBuffer).toString('base64')
      })
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs STT error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.text;
  }
}
```

## Background Job Processing

### Job Queue Architecture

**Queue Structure:**
- **content-processing:** File/URL ingestion jobs
- **multimedia-generation:** Image and audio generation jobs
- **embedding-generation:** Embedding generation jobs

**Implementation:**
```typescript
// src/services/jobs/queues.ts
import Bull from 'bull';

export const processingQueue = new Bull('content-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500 // Keep last 500 failed jobs
  }
});

export const multimediaQueue = new Bull('multimedia-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

export const embeddingQueue = new Bull('embedding-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});
```

**Job Processing:**
```typescript
// src/services/jobs/processors.ts
import { processingQueue } from './queues';
import { ContentProcessor } from '../content-ingestion/processor';

processingQueue.process('file', async (job) => {
  const processor = new ContentProcessor();
  
  // Update job status
  await prisma.ingestionJob.update({
    where: { id: job.data.jobId },
    data: { status: 'processing', startedAt: new Date() }
  });
  
  try {
    const result = await processor.processFile(job.data);
    
    await prisma.ingestionJob.update({
      where: { id: job.data.jobId },
      data: {
        status: 'completed',
        nuggetCount: result.nuggetCount,
        completedAt: new Date()
      }
    });
    
    // Notify admin via WebSocket
    await notifyAdmin('ingestion:job:completed', {
      jobId: job.data.jobId,
      nuggetCount: result.nuggetCount
    });
    
    return result;
  } catch (error) {
    await prisma.ingestionJob.update({
      where: { id: job.data.jobId },
      data: {
        status: 'failed',
        errorMessage: (error as Error).message,
        completedAt: new Date()
      }
    });
    
    throw error;
  }
});

// Retry configuration
processingQueue.on('failed', async (job, error) => {
  logger.error('Job failed', {
    jobId: job.id,
    attemptsMade: job.attemptsMade,
    error: error.message
  });
  
  if (job.attemptsMade >= 3) {
    // Final failure, notify admin
    await notifyAdmin('ingestion:job:failed', {
      jobId: job.id,
      error: error.message
    });
  }
});
```

## Authentication & Authorization

### Authentication Methods

**JWT Authentication:**
- Username/password login
- JWT tokens (3-day expiration)
- Token refresh endpoint
- Password hashing with bcrypt

**Implementation:**
```typescript
// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

export function generateToken(userId: string, organizationId: string, role: string): string {
  return jwt.sign(
    { userId, organizationId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '3d' }
  );
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
```

### Authorization

**Role-Based Access Control:**
- **Admin:** Full system access, all organizations
- **Instructor:** Manage learners, view analytics (organization-scoped)
- **Learner:** Access own learning sessions, view own progress

**Permission Checks:**
```typescript
// src/lib/auth/permissions.ts
export async function checkPermission(
  userId: string,
  action: string,
  resource?: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true }
  });
  
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check role-specific permissions
  const permissions = getRolePermissions(user.role);
  return permissions.includes(action);
}
```

## Real-Time Communication

### WebSocket Architecture

**Server Implementation:**
```typescript
// src/lib/websocket/server.ts
import { WebSocketServer, WebSocket } from 'ws';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  
  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });
    this.setupHandlers();
  }
  
  private setupHandlers() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      // Authenticate connection
      const token = this.extractToken(req);
      if (!token) {
        ws.close(1008, 'Unauthorized');
        return;
      }
      
      const payload = verifyToken(token);
      const clientId = payload.userId;
      
      this.clients.set(clientId, ws);
      
      ws.on('message', async (data) => {
        await this.handleMessage(clientId, data);
      });
      
      ws.on('close', () => {
        this.clients.delete(clientId);
      });
    });
  }
  
  async broadcast(event: string, data: any, userIds?: string[]) {
    const targets = userIds || Array.from(this.clients.keys());
    
    targets.forEach(userId => {
      const client = this.clients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}
```

**Client Events:**
- `session:join` - Join learning session
- `session:message` - Send message to tutor
- `session:choice` - Make narrative choice
- `session:voice:start` - Start voice input
- `session:voice:data` - Send voice audio data
- `session:voice:stop` - Stop voice input

**Server Events:**
- `session:joined` - Confirmation of session join
- `session:message` - AI tutor response
- `session:node:updated` - Narrative node changed
- `session:progress:updated` - Progress updated
- `session:media:show` - Show media widget
- `ingestion:job:updated` - Ingestion job status update
- `error` - Error notification

## File Storage Architecture

### Directory Structure

```
/storage
  /raw
    /organizations
      /{orgId}
        /files
          /{jobId}
            original-file.pdf
  /images
    /{date}
      nugget-{nuggetId}.png
  /audio
    /{date}
      nugget-{nuggetId}.mp3
  /processed
    /nuggets
      /{nuggetId}
        slides.json
        audio-scripts.json
```

### File Access

**Security:**
- All file access requires authentication
- Check user permissions before serving files
- Validate file paths to prevent directory traversal
- Rate limit file downloads

**Serving Files:**
```typescript
// src/app/api/files/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticate(request);
  const file = await prisma.nugget.findUnique({
    where: { id: params.id }
  });
  
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  
  // Check permissions
  if (file.organizationId !== user.organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Serve file
  const filePath = path.join('storage', file.imageUrl || file.audioUrl || '');
  const fileBuffer = await fs.readFile(filePath);
  
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': getContentType(filePath),
      'Content-Disposition': `inline; filename="${path.basename(filePath)}"`
    }
  });
}
```

## Semantic Search Architecture

### Search Strategy

**Hybrid Search:**
- **Semantic Search:** Vector similarity using pgvector
- **Keyword Search:** Full-text search (PostgreSQL full-text indexes)
- **Combine Results:** Merge and rank results from both

### Vector Search Process

```typescript
// src/lib/search/vector.ts
export class VectorSearch {
  async search(
    query: string,
    organizationId: string,
    limit: number = 20,
    threshold: number = 0.7
  ): Promise<Nugget[]> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Vector similarity search
    const nuggets = await prisma.$queryRaw<Nugget[]>`
      SELECT n.*, 
             1 - (n.embedding <=> ${queryEmbedding}::vector) as similarity
      FROM nuggets n
      WHERE n.organization_id = ${organizationId}
        AND n.status = 'ready'
        AND 1 - (n.embedding <=> ${queryEmbedding}::vector) > ${threshold}
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;
    
    return nuggets;
  }
  
  async hybridSearch(
    query: string,
    organizationId: string,
    limit: number = 20
  ): Promise<Nugget[]> {
    // Semantic search
    const semanticResults = await this.search(query, organizationId, limit);
    
    // Keyword search
    const keywordResults = await prisma.nugget.findMany({
      where: {
        organizationId,
        status: 'ready',
        content: {
          search: query
        }
      },
      take: limit
    });
    
    // Merge and deduplicate
    const merged = this.mergeResults(semanticResults, keywordResults);
    
    // Re-rank
    return this.rerank(merged, query);
  }
}
```

## Security Architecture

### Security Measures

1. **Authentication:**
   - JWT tokens with expiration (3-day default, configurable)
   - Password hashing (bcrypt with salt rounds: 12)
   - Token refresh mechanism
   - Token rotation on refresh
   - Secure token storage (httpOnly cookies option)
   - Session timeout (configurable, default: 24 hours inactivity)

2. **Authorization:**
   - Role-based access control (admin, instructor, learner)
   - Organization-level data isolation
   - Resource-level permission checks
   - Principle of least privilege
   - Permission inheritance (organization → user → resource)

3. **Input Validation:**
   - Zod schema validation for all API inputs
   - File type validation (whitelist approach)
   - Path traversal prevention
   - SQL injection prevention (Prisma parameterized queries)
   - XSS prevention (input sanitization, CSP headers)
   - File size limits (configurable per file type)
   - Content scanning for malicious files

4. **Rate Limiting:**
   - API rate limits per user (100 requests/minute default)
   - File upload limits (10 uploads/minute)
   - AI API call limits (50 calls/minute per organization)
   - Distributed rate limiting (Redis-based)
   - IP-based rate limiting for public endpoints
   - Adaptive rate limiting (reduce limits for suspicious activity)

5. **Data Protection:**
   - Encrypted API keys in database (AES-256)
   - Secure file storage (permissions: 600 for sensitive files)
   - Audit logging (immutable logs)
   - Data encryption at rest (optional, for sensitive content)
   - Secure file deletion (overwrite before deletion)
   - Backup encryption

6. **Network Security:**
   - HTTPS only (TLS 1.3)
   - HSTS headers
   - Content Security Policy (CSP)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin

7. **API Security:**
   - CORS configuration (restrictive origins)
   - API key rotation
   - Request signing (optional, for sensitive operations)
   - WebSocket authentication
   - Request size limits

### Security Threat Model

**Threat Categories:**

1. **Authentication Attacks:**
   - **Brute Force:** Mitigated by rate limiting, account lockout after 5 failed attempts
   - **Token Theft:** Mitigated by httpOnly cookies, short expiration, token rotation
   - **Session Hijacking:** Mitigated by secure cookies, HTTPS, IP validation (optional)

2. **Authorization Attacks:**
   - **Privilege Escalation:** Mitigated by strict RBAC, permission checks at every level
   - **Data Access Violation:** Mitigated by organization-level isolation, resource-level checks
   - **Horizontal Privilege Escalation:** Mitigated by user ID validation, ownership checks

3. **Input Validation Attacks:**
   - **SQL Injection:** Mitigated by Prisma (parameterized queries), input validation
   - **XSS (Cross-Site Scripting):** Mitigated by input sanitization, CSP headers, output encoding
   - **Path Traversal:** Mitigated by path validation, whitelist approach, sandboxed file access
   - **File Upload Attacks:** Mitigated by file type validation, size limits, content scanning

4. **API Attacks:**
   - **DDoS:** Mitigated by rate limiting, IP blocking, CDN protection
   - **API Abuse:** Mitigated by usage limits, cost tracking, alerting
   - **Replay Attacks:** Mitigated by token expiration, nonce validation (optional)

5. **Data Attacks:**
   - **Data Breach:** Mitigated by encryption at rest, access controls, audit logging
   - **Data Leakage:** Mitigated by organization isolation, permission checks, data masking
   - **Insecure Storage:** Mitigated by encrypted storage, secure file permissions

6. **Infrastructure Attacks:**
   - **VM Compromise:** Mitigated by security updates, firewall rules, intrusion detection
   - **Database Compromise:** Mitigated by encrypted backups, access controls, audit logging
   - **Redis Compromise:** Mitigated by authentication, network isolation

**Security Testing:**
- Regular security audits
- Penetration testing (quarterly)
- Dependency vulnerability scanning (automated, weekly)
- Code security reviews
- OWASP Top 10 compliance checks

## Performance Considerations

### Performance Benchmarks

**Target Metrics:**
- **API Response Time:** < 200ms (p95), < 100ms (p50)
- **Database Query Time:** < 50ms (p95), < 20ms (p50)
- **Vector Search Time:** < 100ms (p95), < 50ms (p50)
- **Content Processing:** < 5 minutes per 100-page document
- **Session Creation:** < 500ms
- **Message Processing:** < 2 seconds (including AI response)
- **Page Load Time:** < 2 seconds (First Contentful Paint)
- **Time to Interactive:** < 3 seconds

**Load Capacity:**
- **Concurrent Users:** 1,000+ (single VM)
- **API Requests:** 10,000+ requests/minute
- **Background Jobs:** 100+ jobs/minute
- **WebSocket Connections:** 500+ concurrent connections

### Optimization Strategies

1. **Database:**
   - Comprehensive indexes on frequently queried fields
   - Connection pooling (min: 5, max: 20 connections)
   - Query optimization (EXPLAIN ANALYZE for slow queries)
   - Read replicas for read-heavy operations (future)
   - Query result caching (Redis)
   - Batch queries where possible
   - Partial indexes for filtered queries

2. **Caching:**
   - Redis cache for frequently accessed data
   - Embedding cache (content hash → embedding)
   - Media file caching (CDN or local cache)
   - Nugget cache (frequently accessed nuggets)
   - Learner profile cache
   - Narrative node cache
   - Cache TTL: 1 hour (default), configurable

3. **Background Processing:**
   - All heavy operations in background jobs
   - Parallel processing where possible (worker pools)
   - Job prioritization (high/medium/low priority queues)
   - Job batching (process multiple items together)
   - Retry logic with exponential backoff
   - Dead letter queue for failed jobs

4. **API Optimization:**
   - Batch API calls where possible
   - Streaming responses for long operations
   - Pagination for large result sets (default: 20 items)
   - Response compression (gzip)
   - HTTP/2 support
   - Request deduplication (idempotency keys)

5. **Frontend Optimization:**
   - Code splitting (route-based, component-based)
   - Lazy loading (images, components)
   - Image optimization (WebP, responsive images)
   - Bundle size optimization (tree shaking, minification)
   - Service worker for caching
   - Prefetching for likely next actions

6. **Vector Search Optimization:**
   - Tuned ivfflat index (lists parameter based on data size)
   - HNSW index for better recall (PostgreSQL 16+, future)
   - Query result caching
   - Approximate search with configurable threshold
   - Batch embedding generation

### Performance Monitoring

**Key Metrics to Track:**
- API response times (p50, p95, p99)
- Database query times
- Vector search times
- Job processing times
- Cache hit rates
- Error rates
- Throughput (requests/second)
- Active connections
- Memory usage
- CPU usage

**Performance Budgets:**
- Bundle size: < 500KB (initial load)
- API response: < 200ms (p95)
- Database query: < 50ms (p95)
- Page load: < 2 seconds

## Cost Management Architecture

### Cost Tracking

**Tracking Components:**
- AI API calls (tokens, cost)
- Voice API usage (minutes, characters)
- Image generation (count, cost)
- Storage usage (GB)

**Usage Limits:**
- Per organization limits
- Per learner limits (optional)
- Alert thresholds

**Cost Optimization:**
- Model selection (Nano for simple tasks)
- Caching frequently used content
- Batch processing
- Usage monitoring and alerts

## Monitoring & Observability

### Logging

**Structured Logging:**
- Winston for application logs
- JSON format for parsing
- Log levels: error, warn, info, debug
- Separate error log file

### Metrics

**Prometheus Metrics:**
- API request counts
- API latency
- Job queue size
- Active sessions
- Error rates
- Cost metrics

### Health Checks

**Health Endpoint:**
- Database connectivity
- Redis connectivity
- OpenAI API status
- Filesystem access
- Overall system health

## Scalability Strategy

### Horizontal Scaling

**Future Considerations:**
- Multiple Node.js instances (PM2 cluster mode)
- Database read replicas
- Redis cluster
- Load balancer (Nginx)

### Vertical Scaling

**Initial Approach:**
- Monitor VM resource usage
- Upgrade VM specs as needed
- Optimize before scaling

## Deployment Architecture

### Proxmox VM Setup

**VM Configuration:**
- **OS:** Ubuntu Server 22.04 LTS
- **CPU:** 4-8 cores
- **RAM:** 16-32 GB
- **Storage:** 100+ GB (SSD recommended)
- **Network:** Bridge to Proxmox network
- **Backup:** Automated VM snapshots (daily)

**Software Stack:**
- Node.js 20 LTS
- PostgreSQL 15 with pgvector
- Redis
- PM2
- Nginx

**Process Management:**
- PM2 for Node.js processes
- Auto-restart on failure
- Log rotation
- Resource monitoring
- Cluster mode (multiple instances)

**Reverse Proxy:**
- Nginx for SSL termination
- WebSocket proxy support
- Static file serving
- Rate limiting
- Gzip compression
- HTTP/2 support

**SSL/TLS:**
- Let's Encrypt certificates
- Auto-renewal (certbot cron)
- HTTPS only
- TLS 1.3 preferred
- HSTS headers

### Backup & Disaster Recovery

**Backup Strategy:**

1. **Database Backups:**
   - **Frequency:** Daily full backups, hourly incremental backups
   - **Retention:** 30 days daily, 7 days hourly
   - **Location:** Local + off-site (separate storage)
   - **Method:** `pg_dump` with compression
   - **Verification:** Automated restore testing (weekly)

2. **File Backups:**
   - **Frequency:** Daily incremental backups
   - **Retention:** 30 days
   - **Location:** Local + off-site
   - **Method:** `rsync` or `tar` with compression
   - **Verification:** Checksum validation

3. **Configuration Backups:**
   - **Frequency:** On change + daily
   - **Retention:** 90 days
   - **Location:** Version control (Git) + backup storage
   - **Includes:** Environment variables, Nginx config, PM2 config

4. **VM Snapshots:**
   - **Frequency:** Daily (Proxmox automated)
   - **Retention:** 7 days
   - **Location:** Proxmox storage

**Disaster Recovery Plan:**

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 1 hour (maximum data loss)

**Recovery Procedures:**

1. **Database Recovery:**
   ```bash
   # Stop application
   pm2 stop all
   
   # Restore database
   pg_restore -U user -d database backup_file.dump
   
   # Verify restore
   psql -U user -d database -c "SELECT COUNT(*) FROM nuggets;"
   
   # Start application
   pm2 start all
   ```

2. **File Recovery:**
   ```bash
   # Restore files
   rsync -av backup_location/ /storage/
   
   # Verify permissions
   chmod -R 600 /storage/sensitive/
   ```

3. **Full System Recovery:**
   - Restore VM from snapshot
   - Restore database from backup
   - Restore files from backup
   - Verify all services
   - Test critical functionality

**Backup Testing:**
- Monthly restore tests
- Documented recovery procedures
- Recovery time measurement
- Data integrity verification

**High Availability (Future):**
- Multi-VM deployment
- Database replication (streaming replication)
- Load balancer (HAProxy or Nginx)
- Automatic failover
- Health check monitoring

---

This architecture document provides comprehensive details for implementing the AI Microlearning LMS. See other artifact files for API specifications, implementation details, database schema, and more.

