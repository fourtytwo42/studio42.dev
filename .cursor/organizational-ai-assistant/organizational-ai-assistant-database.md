# Organizational AI Assistant - Database Schema

**Complete database schema, Row Level Security policies, indexes, and migration strategy.**

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Core Tables](#core-tables)
3. [Email Tables](#email-tables)
4. [File Tables](#file-tables)
5. [AI & Search Tables](#ai--search-tables)
6. [Calendar Tables](#calendar-tables)
7. [Cost Tracking Tables](#cost-tracking-tables)
8. [Audit Tables](#audit-tables)
9. [Row Level Security Policies](#row-level-security-policies)
10. [Indexes](#indexes)
11. [Migrations](#migrations)

## Schema Overview

**Database:** PostgreSQL 15+ with pgvector extension

**Key Principles:**
- All tables include `created_at` and `updated_at` timestamps
- All tables include `id` as UUID primary key
- Department isolation via `department_id` foreign keys
- Row Level Security (RLS) enabled on all data tables
- Soft deletes via `deleted_at` timestamp (where applicable)

## Core Tables

### organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### departments
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, name)
);
```

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  password_hash VARCHAR(255), -- NULL if SSO/LDAP only
  name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{
    "proactiveReminders": true,
    "emailNotifications": true,
    "calendarAutoCreate": false,
    "dataRetentionDays": null
  }',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(organization_id, email)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
```

### user_departments
```sql
CREATE TABLE user_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, department_id)
);

CREATE INDEX idx_user_departments_user ON user_departments(user_id);
CREATE INDEX idx_user_departments_department ON user_departments(department_id);
```

### roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- "admin", "super_user", "user"
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'System administrator'),
  ('super_user', 'Department administrator'),
  ('user', 'Regular user');
```

### user_roles
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE, -- NULL for admin (org-wide)
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id, department_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_department ON user_roles(department_id);
```

### conversations
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  title VARCHAR(255),
  summary TEXT, -- AI-generated summary of older messages
  message_count INT DEFAULT 0,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_department ON conversations(department_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
```

### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- "user" | "assistant"
  content TEXT NOT NULL,
  tool_calls JSONB DEFAULT '[]', -- AI tool calls
  tool_results JSONB DEFAULT '[]', -- Tool execution results
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
```

## Email Tables

### email_accounts
```sql
CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for shared accounts
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- "microsoft" | "google" | "imap"
  email VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) NOT NULL, -- "personal" | "shared"
  auth_data JSONB NOT NULL, -- Encrypted OAuth tokens or credentials
  settings JSONB DEFAULT '{
    "indexHistory": true,
    "indexHistoryMonths": null,
    "autoIndexAttachments": true,
    "syncEnabled": true
  }',
  last_sync_at TIMESTAMP,
  indexing_status VARCHAR(20) DEFAULT 'pending', -- "pending" | "in_progress" | "complete" | "error"
  indexing_progress INT DEFAULT 0, -- 0-100
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX idx_email_accounts_department ON email_accounts(department_id);
```

### emails
```sql
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  message_id VARCHAR(255), -- Provider's message ID
  thread_id VARCHAR(255),
  folder VARCHAR(50) DEFAULT 'inbox', -- "inbox" | "sent" | "drafts" | etc.
  subject VARCHAR(500),
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  to_emails JSONB DEFAULT '[]', -- [{email, name}]
  cc_emails JSONB DEFAULT '[]',
  bcc_emails JSONB DEFAULT '[]',
  body_html TEXT,
  body_text TEXT,
  preview TEXT,
  unread BOOLEAN DEFAULT true,
  important BOOLEAN DEFAULT false,
  received_at TIMESTAMP,
  sent_at TIMESTAMP,
  indexed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_emails_account ON emails(email_account_id);
CREATE INDEX idx_emails_department ON emails(department_id);
CREATE INDEX idx_emails_received ON emails(received_at DESC);
CREATE INDEX idx_emails_unread ON emails(unread) WHERE unread = true;
CREATE INDEX idx_emails_thread ON emails(thread_id);
CREATE INDEX idx_emails_from ON emails(from_email);
```

### email_attachments
```sql
CREATE TABLE email_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  size BIGINT,
  file_id UUID REFERENCES files(id) ON DELETE SET NULL, -- If processed/indexed
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_attachments_email ON email_attachments(email_id);
CREATE INDEX idx_email_attachments_file ON email_attachments(file_id);
```

## File Tables

### files
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  size BIGINT,
  file_path TEXT NOT NULL, -- Filesystem path
  auto_saved BOOLEAN DEFAULT false,
  indexed BOOLEAN DEFAULT false,
  indexed_at TIMESTAMP,
  extracted_content TEXT, -- Extracted text content
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_files_department ON files(department_id);
CREATE INDEX idx_files_conversation ON files(conversation_id);
CREATE INDEX idx_files_indexed ON files(indexed) WHERE indexed = false;
```

### file_content_chunks
```sql
CREATE TABLE file_content_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(file_id, chunk_index)
);

CREATE INDEX idx_file_chunks_file ON file_content_chunks(file_id);
```

## AI & Search Tables

### embeddings
```sql
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL, -- "email" | "file" | "conversation" | "calendar"
  source_id UUID NOT NULL,
  chunk_index INT DEFAULT 0, -- For chunked documents
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL, -- OpenAI embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embeddings_department ON embeddings(department_id);
CREATE INDEX idx_embeddings_source ON embeddings(source_type, source_id);
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

### ai_tool_calls
```sql
CREATE TABLE ai_tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  tool_call_id VARCHAR(255) NOT NULL, -- OpenAI tool call ID
  tool_name VARCHAR(100) NOT NULL,
  arguments JSONB NOT NULL,
  result JSONB,
  status VARCHAR(20) DEFAULT 'pending', -- "pending" | "executing" | "complete" | "error"
  error_message TEXT,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_tool_calls_message ON ai_tool_calls(message_id);
CREATE INDEX idx_tool_calls_status ON ai_tool_calls(status) WHERE status = 'pending';
```

## Calendar Tables

### calendar_accounts
```sql
CREATE TABLE calendar_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- "microsoft" | "google"
  email VARCHAR(255) NOT NULL,
  auth_data JSONB NOT NULL, -- Encrypted OAuth tokens
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_calendar_accounts_user ON calendar_accounts(user_id);
CREATE INDEX idx_calendar_accounts_department ON calendar_accounts(department_id);
```

### calendar_events
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_account_id UUID REFERENCES calendar_accounts(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  event_id VARCHAR(255), -- Provider's event ID
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  all_day BOOLEAN DEFAULT false,
  organizer_email VARCHAR(255),
  organizer_name VARCHAR(255),
  attendees JSONB DEFAULT '[]', -- [{email, name, status}]
  recurrence JSONB, -- Recurrence rule if recurring
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- If created via AI
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_calendar_events_account ON calendar_events(calendar_account_id);
CREATE INDEX idx_calendar_events_department ON calendar_events(department_id);
CREATE INDEX idx_calendar_events_time ON calendar_events(start_time, end_time);
```

## Cost Tracking Tables

### api_usage
```sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model VARCHAR(100) NOT NULL, -- "gpt-5.1-mini", "text-embedding-3-small", etc.
  operation_type VARCHAR(50) NOT NULL, -- "chat", "embedding", "moderation", etc.
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  total_tokens INT NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL, -- Cost in USD
  metadata JSONB DEFAULT '{}', -- Additional context (tool calls, etc.)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user ON api_usage(user_id, created_at DESC);
CREATE INDEX idx_api_usage_department ON api_usage(department_id, created_at DESC);
CREATE INDEX idx_api_usage_organization ON api_usage(organization_id, created_at DESC);
CREATE INDEX idx_api_usage_date ON api_usage(created_at DESC);
```

### usage_limits
```sql
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type VARCHAR(50) NOT NULL, -- "user" | "department" | "organization"
  scope_id UUID NOT NULL, -- user_id, department_id, or organization_id
  limit_type VARCHAR(50) NOT NULL, -- "daily_tokens" | "monthly_tokens" | "daily_cost" | "monthly_cost"
  limit_value DECIMAL(12, 2) NOT NULL, -- Limit value
  period_start TIMESTAMP NOT NULL, -- Start of period (day or month)
  current_usage DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(scope_type, scope_id, limit_type, period_start)
);

CREATE INDEX idx_usage_limits_scope ON usage_limits(scope_type, scope_id);
CREATE INDEX idx_usage_limits_period ON usage_limits(period_start DESC);
```

### cost_settings
```sql
CREATE TABLE cost_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL, -- NULL for org-wide
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for dept/org-wide
  setting_type VARCHAR(50) NOT NULL, -- "daily_limit" | "monthly_limit" | "alert_threshold"
  setting_value JSONB NOT NULL, -- { "tokens": 100000, "cost_usd": 10.00 }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, department_id, user_id, setting_type)
);

CREATE INDEX idx_cost_settings_org ON cost_settings(organization_id);
CREATE INDEX idx_cost_settings_dept ON cost_settings(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX idx_cost_settings_user ON cost_settings(user_id) WHERE user_id IS NOT NULL;
```

## Audit Tables

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL, -- "email_sent", "file_uploaded", "ai_query", etc.
  resource_type VARCHAR(50), -- "email", "file", "conversation", etc.
  resource_id UUID,
  tool_name VARCHAR(100), -- If action was via AI tool
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_department ON audit_logs(department_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- "proactive_reminder", "email_received", etc.
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

## Row Level Security Policies

### Enable RLS on all data tables
```sql
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_accounts ENABLE ROW LEVEL SECURITY;
```

### Helper function to get user's department IDs
```sql
CREATE OR REPLACE FUNCTION get_user_department_ids(p_user_id UUID)
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(department_id)
  FROM user_departments
  WHERE user_id = p_user_id;
$$ LANGUAGE SQL STABLE;
```

### Helper function to check if user is admin
```sql
CREATE OR REPLACE FUNCTION is_user_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id
    AND r.name = 'admin'
    AND ur.department_id IS NULL
  );
$$ LANGUAGE SQL STABLE;
```

### RLS Policies for emails
```sql
-- Users can see emails from their departments OR if they're admin
CREATE POLICY email_access_policy ON emails
  FOR SELECT
  USING (
    is_user_admin(current_setting('app.current_user_id', true)::UUID)
    OR department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );

-- Users can insert emails (when sending)
CREATE POLICY email_insert_policy ON emails
  FOR INSERT
  WITH CHECK (
    department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );

-- Users can update their own emails
CREATE POLICY email_update_policy ON emails
  FOR UPDATE
  USING (
    department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );
```

### RLS Policies for files
```sql
CREATE POLICY file_access_policy ON files
  FOR SELECT
  USING (
    is_user_admin(current_setting('app.current_user_id', true)::UUID)
    OR department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );

CREATE POLICY file_insert_policy ON files
  FOR INSERT
  WITH CHECK (
    department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );
```

### RLS Policies for conversations
```sql
CREATE POLICY conversation_access_policy ON conversations
  FOR SELECT
  USING (
    user_id = current_setting('app.current_user_id', true)::UUID
    OR is_user_admin(current_setting('app.current_user_id', true)::UUID)
  );
```

### RLS Policies for embeddings
```sql
CREATE POLICY embedding_access_policy ON embeddings
  FOR SELECT
  USING (
    is_user_admin(current_setting('app.current_user_id', true)::UUID)
    OR department_id = ANY(get_user_department_ids(current_setting('app.current_user_id', true)::UUID))
  );
```

## Indexes

### Full-text search indexes
```sql
-- Email full-text search
CREATE INDEX idx_emails_fulltext ON emails USING GIN(
  to_tsvector('english', COALESCE(subject, '') || ' ' || COALESCE(body_text, '') || ' ' || COALESCE(preview, ''))
);

-- File full-text search
CREATE INDEX idx_files_fulltext ON files USING GIN(
  to_tsvector('english', COALESCE(filename, '') || ' ' || COALESCE(extracted_content, ''))
);
```

### Additional performance indexes
```sql
-- Conversation messages for fast retrieval
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

-- Email search by sender
CREATE INDEX idx_emails_from_lower ON emails(LOWER(from_email));

-- Files by upload time
CREATE INDEX idx_files_created ON files(created_at DESC);

-- Calendar events by time range
CREATE INDEX idx_calendar_events_time_range ON calendar_events USING GIST(tstzrange(start_time, end_time));
```

## Migrations

**Migration Strategy:**
- Use Prisma migrations for schema changes
- Version-controlled migration files
- Test migrations on staging before production

**Initial Migration Steps:**
1. Enable pgvector extension
2. Create all tables
3. Create indexes
4. Enable RLS
5. Create RLS policies
6. Insert default roles
7. Seed test data (development only)

