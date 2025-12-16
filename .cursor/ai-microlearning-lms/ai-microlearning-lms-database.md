# AI Microlearning LMS - Database Schema

**Complete database schema, pgvector setup, indexes, migrations, and data relationships.**

## Table of Contents

1. [Prisma Schema](#prisma-schema)
2. [Database Setup](#database-setup)
3. [pgvector Configuration](#pgvector-configuration)
4. [Indexes](#indexes)
5. [Relationships](#relationships)
6. [Data Types](#data-types)
7. [Migrations](#migrations)
8. [Row Level Security](#row-level-security)

## Prisma Schema

### Complete Schema Definition

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Organizations (multi-tenant support)
model Organization {
  id          String   @id @default(uuid())
  name        String
  settings    Json?    // Organization-specific settings
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  users       User[]
  learners    Learner[]
  watchedFolders WatchedFolder[]
  monitoredUrls MonitoredURL[]
  nuggets     Nugget[]
  sessions    Session[]
  narrativeNodes NarrativeNode[]
  
  @@map("organizations")
}

// Users (authentication)
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String?  @map("password_hash")
  name          String
  role          String   // 'admin' | 'instructor' | 'learner'
  organizationId String  @map("organization_id")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  learner       Learner?
  
  @@index([email])
  @@index([organizationId])
  @@index([role])
  @@map("users")
}

// Learners (learning profiles)
model Learner {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  organizationId String   @map("organization_id")
  profile       Json     // { interests: string[], goals: string, learningStyle: string }
  masteryMap    Json     @default("{}") @map("mastery_map") // { concept: masteryLevel (0-100) }
  knowledgeGaps String[] @default([]) @map("knowledge_gaps")
  preferences   Json     @default("{}") // { voice: {...}, mode: 'text' | 'voice' }
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sessions      Session[]
  progress      Progress[]
  
  @@index([organizationId])
  @@index([userId])
  @@map("learners")
}

// Content Nuggets (atomic learning units)
model Nugget {
  id            String   @id @default(uuid())
  organizationId String   @map("organization_id")
  content       String   @db.Text
  embedding     Unsupported("vector(1536)")? // pgvector embedding - handled via raw SQL
  metadata      Json     @default("{}") // { topics: string[], difficulty: number, prerequisites: string[], estimatedTime: number, relatedConcepts: string[] }
  imageUrl      String?  @map("image_url")
  audioUrl      String?  @map("audio_url")
  status        String   @default("pending") // 'pending' | 'processing' | 'ready' | 'failed'
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  narrativeNodes NarrativeNode[]
  nuggetSources NuggetSource[]
  
  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
  @@map("nuggets")
}

// Narrative Nodes (choose-your-own-adventure graph)
model NarrativeNode {
  id            String   @id @default(uuid())
  nuggetId      String   @map("nugget_id")
  organizationId String   @map("organization_id")
  choices       Json     @default("[]") // [{ id: string, text: string, nextNodeId: string, revealsGap: string[], confirmsMastery: string[] }]
  prerequisites String[] @default([])
  adaptsTo      String[] @default([]) @map("adapts_to") // Knowledge gaps addressed
  position      Json?    // { x: number, y: number } for visualization
  createdAt     DateTime @default(now()) @map("created_at")
  
  nugget        Nugget  @relation(fields: [nuggetId], references: [id], onDelete: Cascade)
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sessionNodes  SessionNode[]
  sessions      Session[] @relation("CurrentNode")
  
  @@index([nuggetId])
  @@index([organizationId])
  @@map("narrative_nodes")
}

// Learning Sessions
model Session {
  id            String   @id @default(uuid())
  learnerId     String   @map("learner_id")
  organizationId String   @map("organization_id")
  currentNodeId String?  @map("current_node_id")
  pathHistory   Json     @default("[]") @map("path_history") // Array of node IDs visited
  mode          String   @default("text") // 'text' | 'voice'
  startedAt     DateTime @default(now()) @map("started_at")
  lastActivity  DateTime @default(now()) @map("last_activity")
  completedAt   DateTime? @map("completed_at")
  
  learner       Learner  @relation(fields: [learnerId], references: [id], onDelete: Cascade)
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  currentNode   NarrativeNode? @relation("CurrentNode", fields: [currentNodeId], references: [id])
  sessionNodes  SessionNode[]
  messages      Message[]
  
  @@index([learnerId])
  @@index([organizationId])
  @@index([currentNodeId])
  @@index([startedAt])
  @@index([lastActivity])
  @@map("sessions")
}

// Session Nodes (track narrative path)
model SessionNode {
  id            String   @id @default(uuid())
  sessionId     String   @map("session_id")
  nodeId        String   @map("node_id")
  choiceId      String?  @map("choice_id") // Which choice led here
  visitedAt     DateTime @default(now()) @map("visited_at")
  timeSpent     Integer? @map("time_spent") // seconds spent on this node
  
  session       Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  node          NarrativeNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  
  @@index([sessionId])
  @@index([nodeId])
  @@index([visitedAt])
  @@map("session_nodes")
}

// Messages (conversation history)
model Message {
  id            String   @id @default(uuid())
  sessionId     String   @map("session_id")
  role          String   // 'user' | 'assistant' | 'system'
  content       String   @db.Text
  toolCalls     Json?    @map("tool_calls") // AI tool calls [{ id, name, arguments }]
  toolResults   Json?    @map("tool_results") // Tool execution results
  createdAt     DateTime @default(now()) @map("created_at")
  
  session       Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@index([sessionId])
  @@index([createdAt])
  @@index([role])
  @@map("messages")
}

// Progress Tracking
model Progress {
  id            String   @id @default(uuid())
  learnerId     String   @map("learner_id")
  concept       String   // Concept identifier
  masteryLevel  Integer  @map("mastery_level") // 0-100
  evidence      String?  @db.Text // Why this assessment
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  learner       Learner  @relation(fields: [learnerId], references: [id], onDelete: Cascade)
  
  @@unique([learnerId, concept])
  @@index([learnerId])
  @@index([concept])
  @@index([masteryLevel])
  @@map("progress")
}

// Watched Folders (content ingestion)
model WatchedFolder {
  id            String   @id @default(uuid())
  organizationId String   @map("organization_id")
  path          String
  enabled       Boolean  @default(true)
  fileTypes     String[] @default(["pdf", "docx", "txt"]) @map("file_types")
  recursive     Boolean  @default(true)
  autoProcess   Boolean  @default(true) @map("auto_process")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  @@index([organizationId])
  @@index([enabled])
  @@map("watched_folders")
}

// Monitored URLs (content ingestion)
model MonitoredURL {
  id            String   @id @default(uuid())
  organizationId String   @map("organization_id")
  url           String
  enabled       Boolean  @default(true)
  checkInterval Integer  @default(5) @map("check_interval") // minutes
  lastChecked   DateTime? @map("last_checked")
  lastModified  DateTime? @map("last_modified")
  etag          String?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  @@index([organizationId])
  @@index([enabled])
  @@index([lastChecked])
  @@map("monitored_urls")
}

// Ingestion Jobs (content processing)
model IngestionJob {
  id            String   @id @default(uuid())
  type          String   // 'file' | 'url'
  source        String   // file path or URL
  organizationId String   @map("organization_id")
  status        String   @default("pending") // 'pending' | 'processing' | 'completed' | 'failed'
  metadata      Json?    @default("{}") // { folderId, urlId, fileName, fileSize, etc. }
  nuggetCount   Integer? @map("nugget_count")
  errorMessage  String?  @map("error_message") @db.Text
  startedAt     DateTime? @map("started_at")
  completedAt   DateTime? @map("completed_at")
  createdAt     DateTime @default(now()) @map("created_at")
  
  nuggetSources NuggetSource[]
  
  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
  @@index([type])
  @@map("ingestion_jobs")
}

// Nugget Sources (link nuggets to source)
model NuggetSource {
  id            String   @id @default(uuid())
  nuggetId      String   @map("nugget_id")
  sourceType    String   @map("source_type") // 'file' | 'url' | 'manual'
  sourcePath    String   @map("source_path")
  ingestionJobId String? @map("ingestion_job_id")
  createdAt     DateTime @default(now()) @map("created_at")
  
  nugget        Nugget   @relation(fields: [nuggetId], references: [id], onDelete: Cascade)
  ingestionJob  IngestionJob? @relation(fields: [ingestionJobId], references: [id], onDelete: SetNull)
  
  @@index([nuggetId])
  @@index([ingestionJobId])
  @@index([sourceType])
  @@map("nugget_sources")
}

// System Settings (admin configuration)
model SystemSetting {
  id            String   @id @default(uuid())
  key           String   @unique
  value         Json
  scope         String?  // 'system' | 'organization' | 'learner'
  scopeId       String?  @map("scope_id")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  @@index([scope, scopeId])
  @@index([key])
  @@map("system_settings")
}

// Voice Configuration
model VoiceConfig {
  id            String   @id @default(uuid())
  scope         String   // 'system' | 'organization' | 'learner'
  scopeId       String?  @map("scope_id")
  ttsProvider   String   @map("tts_provider") // 'openai-standard' | 'openai-hd' | 'elevenlabs'
  ttsModel      String?  @map("tts_model")
  ttsVoice      String?  @map("tts_voice")
  sttProvider   String   @map("stt_provider") // 'openai-whisper' | 'elevenlabs'
  sttModel      String?  @map("stt_model")
  qualityTier   String   @map("quality_tier") // 'low' | 'mid' | 'high'
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  @@index([scope, scopeId])
  @@unique([scope, scopeId])
  @@map("voice_configs")
}

// AI Model Configuration
model AIModelConfig {
  id                    String   @id @default(uuid())
  scope                 String   // 'system' | 'organization' | 'learner'
  scopeId               String?  @map("scope_id")
  contentGenerationModel String  @default("gpt-5.1-mini") @map("content_generation_model")
  narrativePlanningModel String  @default("gpt-5.1-mini") @map("narrative_planning_model")
  tutoringModel         String   @default("gpt-5.1-mini") @map("tutoring_model")
  metadataModel         String   @default("gpt-5.1-nano") @map("metadata_model")
  embeddingModel        String   @default("text-embedding-3-small") @map("embedding_model")
  contentGenerationTemp Float?   @default(0.7) @map("content_generation_temp")
  narrativePlanningTemp Float?   @default(0.8) @map("narrative_planning_temp")
  tutoringTemp          Float?   @default(0.7) @map("tutoring_temp")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  
  @@index([scope, scopeId])
  @@unique([scope, scopeId])
  @@map("ai_model_configs")
}

// Analytics (learner engagement)
model Analytics {
  id            String   @id @default(uuid())
  learnerId     String?  @map("learner_id")
  organizationId String  @map("organization_id")
  eventType     String   @map("event_type") // 'nugget_viewed' | 'choice_made' | 'question_answered' | 'mastery_updated' | 'ai_api_call' | etc.
  eventData     Json     @default("{}") @map("event_data")
  timestamp     DateTime @default(now())
  
  @@index([learnerId])
  @@index([organizationId])
  @@index([eventType])
  @@index([timestamp])
  @@map("analytics")
}
```

## Database Setup

### Initial Setup

```sql
-- Create database
CREATE DATABASE ai_microlearning_lms;

-- Create extension for pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Connection String

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_microlearning_lms?schema=public"
```

## pgvector Configuration

### Vector Column Setup

**Note:** Prisma doesn't natively support pgvector, so we use `Unsupported` type and handle via raw SQL.

**Migration SQL:**
```sql
-- Add embedding column to nuggets (if not exists)
ALTER TABLE nuggets 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS nuggets_embedding_idx 
ON nuggets 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Note: ivfflat index requires at least some data to be effective
-- Consider creating index after initial data load
```

### Vector Operations

**Insert Embedding:**
```typescript
// src/lib/db/embeddings.ts
export async function insertEmbedding(
  nuggetId: string,
  embedding: number[]
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE nuggets
    SET embedding = ${JSON.stringify(embedding)}::vector
    WHERE id = ${nuggetId}
  `;
}
```

**Vector Similarity Search:**
```typescript
export async function findSimilarNuggets(
  queryEmbedding: number[],
  organizationId: string,
  threshold: number = 0.7,
  limit: number = 20
): Promise<Nugget[]> {
  return await prisma.$queryRaw<Nugget[]>`
    SELECT n.*, 
           1 - (n.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM nuggets n
    WHERE n.organization_id = ${organizationId}
      AND n.status = 'ready'
      AND n.embedding IS NOT NULL
      AND 1 - (n.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;
}
```

**Vector Distance Operators:**
- `<=>` - Cosine distance (1 - cosine similarity)
- `<->` - L2 distance (Euclidean)
- `<#>` - Negative inner product

## Indexes

### Performance Indexes

```sql
-- Full-text search index
CREATE INDEX nuggets_content_fts_idx 
ON nuggets 
USING gin(to_tsvector('english', content));

-- Composite indexes for common queries
CREATE INDEX sessions_learner_activity_idx 
ON sessions(learner_id, last_activity DESC);

CREATE INDEX messages_session_created_idx 
ON messages(session_id, created_at);

CREATE INDEX progress_learner_concept_idx 
ON progress(learner_id, concept);

-- Partial indexes
CREATE INDEX nuggets_ready_idx 
ON nuggets(organization_id, created_at) 
WHERE status = 'ready';

CREATE INDEX ingestion_jobs_pending_idx 
ON ingestion_jobs(organization_id, created_at) 
WHERE status = 'pending';
```

### Index Maintenance

```sql
-- Analyze tables for query planner
ANALYZE nuggets;
ANALYZE sessions;
ANALYZE messages;

-- Reindex if needed
REINDEX INDEX nuggets_embedding_idx;
```

## Relationships

### Entity Relationship Diagram

```
Organization
  ├─ Users (1:N)
  ├─ Learners (1:N)
  ├─ WatchedFolders (1:N)
  ├─ MonitoredURLs (1:N)
  ├─ Nuggets (1:N)
  ├─ NarrativeNodes (1:N)
  └─ Sessions (1:N)

User
  └─ Learner (1:1)

Learner
  ├─ Sessions (1:N)
  └─ Progress (1:N)

Nugget
  ├─ NarrativeNodes (1:N)
  └─ NuggetSources (1:N)

NarrativeNode
  ├─ Sessions (1:N via currentNodeId)
  └─ SessionNodes (1:N)

Session
  ├─ Messages (1:N)
  ├─ SessionNodes (1:N)
  └─ CurrentNode (N:1)

IngestionJob
  └─ NuggetSources (1:N)
```

### Cascade Deletes

**Cascade Rules:**
- Deleting Organization → deletes all related data
- Deleting User → deletes Learner
- Deleting Learner → deletes Sessions, Progress
- Deleting Session → deletes Messages, SessionNodes
- Deleting Nugget → deletes NarrativeNodes, NuggetSources
- Deleting IngestionJob → sets NuggetSource.ingestionJobId to NULL

## Data Types

### JSON Fields

**Learner.profile:**
```typescript
{
  interests: string[];
  goals: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

**Learner.masteryMap:**
```typescript
{
  [conceptId: string]: number; // 0-100
}
```

**Nugget.metadata:**
```typescript
{
  topics: string[];
  difficulty: number; // 1-10
  prerequisites: string[];
  estimatedTime: number; // minutes
  relatedConcepts: string[];
}
```

**NarrativeNode.choices:**
```typescript
{
  id: string;
  text: string;
  nextNodeId: string | null;
  revealsGap: string[];
  confirmsMastery: string[];
}[]
```

**Session.pathHistory:**
```typescript
string[] // Array of node IDs visited
```

**Analytics.eventData:**
```typescript
{
  // Varies by eventType
  [key: string]: any;
}
```

## Migrations

### Initial Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migration
npx prisma migrate deploy
```

### Adding pgvector Support

```sql
-- migration: add_pgvector.sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column
ALTER TABLE nuggets ADD COLUMN embedding vector(1536);

-- Create index (after data exists)
CREATE INDEX nuggets_embedding_idx 
ON nuggets 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### Migration Best Practices

1. **Always test migrations** on development database first
2. **Backup database** before production migrations
3. **Use transactions** for multi-step migrations
4. **Add indexes after data** for better performance
5. **Document breaking changes** in migration comments

## Row Level Security

### RLS Policies (Optional)

**If implementing RLS for additional security:**

```sql
-- Enable RLS on nuggets
ALTER TABLE nuggets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see nuggets from their organization
CREATE POLICY nugget_organization_access ON nuggets
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = current_setting('app.current_user_id')::uuid
    )
  );

-- Similar policies for other tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY session_learner_access ON sessions
  FOR SELECT
  USING (
    learner_id IN (
      SELECT id FROM learners WHERE user_id = current_setting('app.current_user_id')::uuid
    )
  );
```

**Note:** Application-level permission checks are primary security mechanism. RLS provides additional defense-in-depth.

## Database Maintenance

### Regular Maintenance Tasks

```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex if needed
REINDEX DATABASE ai_microlearning_lms;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Strategy

**Automated Backup Script:**
```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Full backup
pg_dump -U lms_user -d ai_microlearning_lms \
  -F c \
  -f $BACKUP_DIR/full_backup_$DATE.dump \
  --verbose

# Compress backup
gzip $BACKUP_DIR/full_backup_$DATE.dump

# Remove old backups (older than retention period)
find $BACKUP_DIR -name "*.dump.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup
if [ -f $BACKUP_DIR/full_backup_$DATE.dump.gz ]; then
  echo "Backup successful: full_backup_$DATE.dump.gz"
  # Optional: Copy to off-site storage
  # rsync -av $BACKUP_DIR/ user@backup-server:/backups/
else
  echo "Backup failed!"
  exit 1
fi
```

**Backup Schedule (Cron):**
```bash
# Daily full backup at 2 AM
0 2 * * * /usr/local/bin/backup-database.sh

# Hourly incremental backup (WAL archiving)
# Configure in postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backups/wal/%f'
```

**Restore Procedures:**

**Full Restore:**
```bash
# Stop application
pm2 stop all

# Drop existing database (CAUTION: Data loss!)
dropdb -U lms_user ai_microlearning_lms

# Create new database
createdb -U lms_user ai_microlearning_lms

# Restore from backup
pg_restore -U lms_user -d ai_microlearning_lms \
  --verbose \
  backup_20251210.dump

# Verify restore
psql -U lms_user -d ai_microlearning_lms -c "SELECT COUNT(*) FROM nuggets;"

# Start application
pm2 start all
```

**Point-in-Time Recovery (PITR):**
```bash
# Requires WAL archiving enabled
# Restore base backup
pg_restore -U lms_user -d ai_microlearning_lms base_backup.dump

# Recover to specific point in time
# Edit recovery.conf:
# restore_command = 'cp /backups/wal/%f %p'
# recovery_target_time = '2025-12-10 14:30:00'

# Start PostgreSQL (will automatically recover)
```

**Backup Verification:**
```bash
# Test restore on separate database
createdb -U lms_user test_restore
pg_restore -U lms_user -d test_restore backup_20251210.dump

# Verify data integrity
psql -U lms_user -d test_restore -c "
  SELECT 
    (SELECT COUNT(*) FROM nuggets) as nuggets,
    (SELECT COUNT(*) FROM learners) as learners,
    (SELECT COUNT(*) FROM sessions) as sessions;
"

# Drop test database
dropdb -U lms_user test_restore
```

**Backup Best Practices:**
- **Frequency:** Daily full backups, hourly WAL archiving
- **Retention:** 30 days local, 90 days off-site
- **Verification:** Weekly restore tests
- **Encryption:** Encrypt backups before off-site transfer
- **Monitoring:** Alert on backup failures
- **Documentation:** Document restore procedures
- **Testing:** Quarterly disaster recovery drills

---

This database schema provides the foundation for the AI Microlearning LMS. All relationships, indexes, and data types are designed to support efficient content ingestion, semantic search, narrative planning, and learning delivery.

