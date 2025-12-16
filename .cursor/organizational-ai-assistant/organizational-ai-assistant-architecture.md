# Organizational AI Assistant - Detailed Architecture

**Complete system architecture, database schema, component design, and technology specifications.**

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Data Architecture](#data-architecture)
4. [Permission Model & Data Isolation](#permission-model--data-isolation)
5. [AI Integration Architecture](#ai-integration-architecture)
6. [Email & Calendar Integration](#email--calendar-integration)
7. [File Processing Pipeline](#file-processing-pipeline)
8. [Semantic Search Architecture](#semantic-search-architecture)
9. [Authentication & Authorization](#authentication--authorization)
10. [Real-Time Communication](#real-time-communication)
11. [Audit Logging System](#audit-logging-system)
12. [Security Architecture](#security-architecture)
13. [Performance Considerations](#performance-considerations)
14. [Web Search Integration](#web-search-integration)
15. [Cost Tracking & Management](#cost-tracking--management)
16. [Scalability Strategy](#scalability-strategy)

## System Architecture Overview

### Component Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  - Next.js App Router (React Server Components)              │
│  - Client Components (Chat UI, Dashboard, Forms)             │
│  - Tailwind CSS 4 + Heroicons                                │
│  - WebSocket Client (Real-time updates)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Application Layer                         │
│  - Next.js API Routes (REST endpoints)                       │
│  - WebSocket Server (Real-time communication)                │
│  - Authentication Middleware (JWT, SSO, LDAP)                │
│  - Permission Middleware (RBAC, Department checks)           │
│  - Rate Limiting & Security                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Business Logic Layer                      │
│  - AI Service (OpenAI integration, tool orchestration)       │
│  - Email Service (Send/receive, sync)                        │
│  - Calendar Service (Read/create events)                     │
│  - File Service (Upload, process, index)                     │
│  - Search Service (Semantic + keyword search)                │
│  - Notification Service (In-app + email)                     │
│  - Audit Service (Logging)                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Data Access Layer                         │
│  - Prisma ORM (Database queries)                             │
│  - Vector Search (pgvector queries)                          │
│  - File System Access (File storage/retrieval)               │
│  - External API Clients (Email, Calendar, OpenAI)            │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Data Storage Layer                        │
│  - PostgreSQL (Relational data, metadata)                    │
│  - pgvector (Vector embeddings)                              │
│  - Filesystem (File storage)                                 │
│  - External APIs (Email providers, Calendar providers)       │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Heroicons (`@heroicons/react`)
- **State Management:** React Context + Zustand (for complex state)
- **Real-Time:** WebSocket client (native or Socket.io client)
- **Forms:** React Hook Form + Zod validation

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL 15+ with pgvector extension
- **Authentication:** NextAuth.js (for SSO), custom JWT for regular auth, LDAP client
- **Real-Time:** WebSocket (ws library or Socket.io)

### AI & External Services

- **AI Provider:** OpenAI
  - Chat: GPT-5.1 mini/nano
  - Embeddings: OpenAI text-embedding-3-small (or latest)
  - Tools: Function calling API (Chat Completions)
  - **API Choice:** Using Chat Completions API with function calling (not Assistants API)
    - More control over tool execution and permissions
    - Better for custom organizational tools (email, calendar, files)
    - Supports parallel tool calls
    - Lower latency for real-time chat
- **Email:** Microsoft Graph API, Gmail API, IMAP/SMTP for others
- **Calendar:** Microsoft Graph API (Outlook), Google Calendar API
- **Web Search:** Third-party API (Tavily API, SerpAPI, or similar)
  - **Note:** OpenAI doesn't provide native web search/browsing capability as of 2025
  - Implement as custom tool that calls third-party search API
  - Auto-enabled by default, admin-configurable

**Why Not Codex CLI or Assistants API:**
- **Codex CLI:** Terminal-based tool for local development, not suitable for web application integration
- **Assistants API:** Better for persistent assistants with file uploads, but less control over tool execution and permissions
- **Chat Completions + Function Calling:** Best fit for our use case - real-time chat, custom tools, fine-grained permissions

### Infrastructure

- **Database:** PostgreSQL on same VM as Node.js
- **File Storage:** Local filesystem
- **Session Storage:** PostgreSQL or Redis (for JWT blacklisting if needed)
- **Background Jobs:** BullMQ or similar (for email polling, batch processing)

## Data Architecture

### Database Design Principles

1. **Multi-Tenant Architecture:** Single database with department-based isolation
2. **Row Level Security (RLS):** PostgreSQL RLS policies enforce data boundaries
3. **Vector Storage:** pgvector extension for semantic search embeddings
4. **Audit Trail:** All tables include audit fields (created_at, updated_at, created_by, etc.)

### Core Tables (High-Level)

- `organizations` - Multi-tenant support (if SaaS)
- `departments` - Department/unit definitions
- `users` - User accounts
- `user_departments` - Many-to-many: users can belong to multiple departments
- `roles` - Role definitions (Admin, Super User, User)
- `user_roles` - User role assignments (per department)
- `conversations` - Chat conversations
- `messages` - Individual messages in conversations
- `emails` - Email metadata and content (indexed)
- `email_attachments` - Email attachment metadata
- `files` - Uploaded files metadata
- `file_content` - Extracted text content from files
- `embeddings` - Vector embeddings for semantic search
- `calendar_events` - Calendar event metadata
- `notifications` - User notifications
- `audit_logs` - Complete audit trail
- `email_accounts` - Connected email accounts (user + shared)
- `calendar_accounts` - Connected calendar accounts

See [Database Schema](organizational-ai-assistant-database.md) for complete schema.

## Permission Model & Data Isolation

### User Roles

1. **Admin:** System-level access
   - Manage all users, departments, settings
   - Access all data (across departments)
   - System configuration

2. **Super User:** Department-level admin
   - Manage users in their department(s)
   - Configure department settings
   - Access only their department data

3. **User:** Regular user
   - Access their own data + department data
   - Can belong to multiple departments
   - Access = union of all their departments

### Data Isolation Strategy

**PostgreSQL Row Level Security (RLS):**

```sql
-- Enable RLS on all data tables
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- etc.

-- Example policy: Users can only see emails from their departments
CREATE POLICY department_email_access ON emails
  FOR SELECT
  USING (
    department_id IN (
      SELECT department_id FROM user_departments 
      WHERE user_id = current_setting('app.current_user_id')::uuid
    )
  );
```

**Application-Level Checks:**
- Always filter by department_id in queries
- Tools receive department context
- Double-check permissions in business logic

**Vector Search Isolation:**
- Embeddings table includes `department_id`
- Filter by department before vector similarity search
- Query pattern: `WHERE department_id IN (...) AND vector <=> $1 < threshold`

### Multi-Department Users

- Users can belong to multiple departments
- Access = union of all departments they belong to
- AI can access information from all user's departments when chatting
- Strict isolation between departments (no cross-department access unless user belongs to both)

## AI Integration Architecture

### API Choice: Chat Completions vs Assistants API

**Decision: Use Chat Completions API with Function Calling**

**Why Chat Completions:**
- ✅ **Real-time control:** Full control over each API call and tool execution
- ✅ **Custom tools:** Easy to implement custom organizational tools (email, calendar, files)
- ✅ **Fine-grained permissions:** Check permissions before each tool execution
- ✅ **Lower latency:** Direct API calls without assistant state management
- ✅ **Parallel tool calls:** Support for executing multiple tools simultaneously
- ✅ **Cost-effective:** Pay per request, no assistant storage costs
- ✅ **Flexible:** Easy to modify system prompts, tools, and behavior per request

**Why Not Assistants API:**
- ❌ **Less control:** Assistants manage their own state and tool execution
- ❌ **Built-in tools only:** `file_search` and `code_interpreter` are limited for our needs
- ❌ **Permission complexity:** Harder to implement department-level permissions
- ❌ **State management:** Assistants maintain state, less flexible for our use case
- ❌ **Higher latency:** Additional overhead for assistant management

**Why Not Codex CLI:**
- ❌ **Not a library:** Codex CLI is a terminal-based tool, not an API/library
- ❌ **Local only:** Designed for local development, not web application integration
- ❌ **Account requirement:** Requires ChatGPT Plus/Pro/Business accounts
- ❌ **Different use case:** Designed for code editing in terminal, not organizational AI assistant

**Alternative Consideration:**
- **Assistants API** could be useful for specific features (e.g., persistent file analysis)
- But for our primary chat interface, Chat Completions + Function Calling is the better choice

### OpenAI Tool Calling (Function Calling) - How It Works

**Overview:**
OpenAI's tool calling (formerly called function calling) allows the model to generate structured outputs that specify which tools to call and with what arguments. The model decides when to use tools based on the user's input and available tool descriptions.

**Key Concepts:**
- **Tools:** Functions the AI can call, defined with JSON Schema (name, description, parameters)
- **Tool Calls:** Model generates structured requests to call tools with specific arguments
- **Tool Responses:** Results from executing tools are sent back to the model
- **Parallel Tool Calls:** Model can call multiple tools in a single response (when using newer models like GPT-4-turbo+)

**Technical Implementation:**

1. **Define Tools (JSON Schema):**
```json
{
  "type": "function",
  "function": {
    "name": "search_emails",
    "description": "Search user's emails by query, sender, date range, etc.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string", "description": "Search query" },
        "limit": { "type": "number", "description": "Max results", "default": 20 }
      },
      "required": ["query"]
    }
  }
}
```

2. **API Request Format:**
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-5.1-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant..." },
    { role: "user", content: "What did Greg email me about?" }
  ],
  tools: [tool1, tool2, tool3, ...], // Array of tool definitions
  tool_choice: "auto" // "auto" | "required" | "none" | { type: "function", function: { name: "tool_name" } }
});
```

3. **Model Response with Tool Call:**
```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "search_emails",
            "arguments": "{\"query\": \"Greg\", \"limit\": 10}"
          }
        }
      ]
    }
  }]
}
```

4. **Execute Tool and Continue:**
   - Parse `tool_calls` array
   - Execute each tool with provided arguments
   - Return results to model in follow-up request

5. **Follow-up Request with Tool Results:**
```typescript
messages.push(
  { role: "assistant", content: null, tool_calls: [...] },
  { 
    role: "tool", 
    tool_call_id: "call_abc123", 
    content: JSON.stringify(toolResult) 
  }
);

const finalResponse = await openai.chat.completions.create({
  model: "gpt-5.1-mini",
  messages: messages, // Includes tool results
  tools: tools,
  tool_choice: "auto"
});
```

6. **Model Final Response:**
   - Model uses tool results to generate final text response
   - May make additional tool calls if needed
   - Continues until final answer is generated

### Parallel Tool Calls

**Capability:**
- Newer models (GPT-4-turbo+, GPT-5.1) support parallel tool calls
- Model can call multiple tools simultaneously in a single response
- `tool_calls` array contains multiple tool call objects
- Tools can be executed in parallel for better performance

**Example:**
```json
{
  "tool_calls": [
    {
      "id": "call_1",
      "type": "function",
      "function": {
        "name": "search_emails",
        "arguments": "{\"query\": \"Greg\"}"
      }
    },
    {
      "id": "call_2",
      "type": "function",
      "function": {
        "name": "search_calendar",
        "arguments": "{\"query\": \"meeting\"}"
      }
    }
  ]
}
```

**Implementation:**
- Execute all tool calls in parallel (Promise.all)
- Wait for all results
- Return all results to model in single follow-up request
- Model processes all results together

### Tool Choice Parameter

**Options:**
- `"auto"` (default): Model decides whether to call tools
- `"required"`: Model must call at least one tool
- `"none"`: Model cannot call tools (text response only)
- `{ type: "function", function: { name: "tool_name" } }`: Force specific tool

**Usage:**
- Use `"auto"` for normal operation (model decides)
- Use `"required"` when tool usage is mandatory
- Use `"none"` to disable tools for specific requests

### OpenAI Integration Pattern - Complete Flow

**Chat Flow with Tool Calling:**
1. User sends message
2. System retrieves relevant context (recent messages, semantic search results)
3. Builds tool definitions (available tools based on user permissions)
4. Calls OpenAI Chat Completions API with:
   - Conversation history (including previous tool calls/results)
   - System prompt (role, permissions, context)
   - Tool definitions (array of JSON Schema tool definitions)
   - `tool_choice: "auto"` (or appropriate setting)
   - Relevant context from semantic search
5. OpenAI responds with:
   - **Text response only:** Direct answer to user (no tools needed)
   - **Tool call(s):** `tool_calls` array with function name and arguments
6. If tool calls present:
   - Parse each tool call from `tool_calls` array
   - Execute tools in parallel (if multiple calls)
   - Check permissions before execution
   - Log tool execution to audit_logs
   - Format tool results as JSON strings
7. Continue conversation:
   - Add assistant message with `tool_calls` to conversation
   - Add tool response messages (role: "tool") with results
   - Call OpenAI again with updated messages
   - Model processes tool results and generates final response
8. Repeat if needed:
   - Model may make additional tool calls
   - Continue until final text response generated
9. Store conversation:
   - Save user message, tool calls, tool results, final response
   - Update conversation summary if needed

**Tool Definitions:**

See [AI Tools Specification](organizational-ai-assistant-tools.md) for complete tool definitions, parameters, and permissions.

Tools are functions the AI can call. Examples:
- `search_emails` - Search user's emails
- `search_files` - Search files
- `semantic_search` - Semantic search across repository
- `send_email` - Send email on behalf of user
- `create_calendar_event` - Create calendar appointment
- `read_calendar` - Read calendar events
- `upload_file` - Upload and index file
- `create_file` - Create new document
- `search_web` - Search the web
- `relay_message` - Relay message to team member

**Tool Execution Details:**
- All tools check permissions (department access, user permissions) before execution
- All tool calls are logged to audit_logs with full context
- Tools can be async (for email sending, file processing, long-running operations)
- Tools return structured JSON strings (not objects) for AI to process
- Multiple tools can be executed in parallel when model calls them simultaneously
- Tool results are added to conversation history as messages with `role: "tool"`

**Tool Response Format:**
- Tool responses must be JSON strings (not objects)
- Include success/error status in response
- Provide meaningful error messages if tool fails
- Keep responses concise but informative

### Context Management

**Conversation Context:**
- Sliding window with summarization
- Keep recent messages (e.g., last 50 messages)
- Summarize older messages when context exceeds limits
- Store summaries in database

**Semantic Search Context:**
- When user asks question, perform semantic search
- Retrieve top N relevant documents/emails/conversations
- Include in AI context
- Filter by user's departments

**Proactive Reminders:**
- AI analyzes recent activity (emails, conversations, calendar)
- Surfaces relevant reminders during chat
- Can send notifications for urgent items

### Embedding Generation

**Strategy:**
- **Real-time:** New content (emails, files, conversations) → generate embeddings immediately
- **Batch:** Bulk imports (historical emails) → process in batches

**Process:**
1. Extract text content (from email, file, conversation)
2. Chunk if necessary (large documents)
3. Generate embeddings via OpenAI API
4. Store in `embeddings` table with metadata (department_id, source_type, source_id)
5. Index in pgvector for similarity search

## Email & Calendar Integration

### Email Integration

**Microsoft Outlook (Graph API):**
- OAuth2 authentication
- Read emails (user mailbox, shared mailboxes)
- Send emails
- Monitor new emails (webhooks + polling fallback)
- Attachments (download and process)

**Rate Limits:**
- **Read Operations:** 10,000 requests per 10 minutes per app
- **Write Operations:** 4,000 requests per 10 minutes per app
- **Batch Requests:** Up to 20 requests per batch, 4,000 batches per 10 minutes
- **Throttling:** 429 responses when exceeded, retry after delay in `Retry-After` header
- **Best Practices:**
  - Use batch requests for multiple operations
  - Implement exponential backoff on 429 responses
  - Cache frequently accessed data
  - Use webhooks/change notifications to reduce polling

**Gmail (Google APIs):**
- OAuth2 authentication
- Read emails
- Send emails
- Monitor new emails (push notifications + polling fallback)
- Attachments (download and process)

**Rate Limits:**
- **Per User Per Second:** 250 quota units per user per second (each operation consumes different units)
- **Per Day:** 1,000,000,000 quota units per day (project-wide)
- **Read Operations:** 5 quota units per request
- **Write Operations:** 100 quota units per request
- **Batch Requests:** Reduce quota consumption
- **Throttling:** 429 responses with quota exceeded errors
- **Best Practices:**
  - Use push notifications instead of polling
  - Implement exponential backoff
  - Batch operations when possible
  - Monitor quota usage via Google Cloud Console

**Other Providers (IMAP/SMTP):**
- IMAP for receiving
- SMTP for sending
- Polling-based (no push notifications)

**Email Processing:**
1. New email arrives → webhook/polling detects
2. Fetch email content
3. Extract text, attachments
4. Index text content
5. Generate embeddings
6. Store metadata in database
7. Check for proactive reminders (unread urgent emails)

### Calendar Integration

**Microsoft Outlook (Graph API):**
- OAuth2 authentication
- Read calendar events
- Create calendar events
- Update/delete events
- Send meeting invites
- Monitor calendar changes (webhooks + polling)

**Google Calendar:**
- OAuth2 authentication
- Read calendar events
- Create calendar events
- Update/delete events
- Send meeting invites
- Monitor calendar changes (push notifications + polling)

**Calendar Features:**
- AI can read user's calendar (for context)
- AI can create events (with user confirmation initially, learns preferences)
- Conflict detection
- Recurring events support

## File Processing Pipeline

### Supported Formats

- **Documents:** PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
- **Text:** TXT, CSV, Markdown
- **Code:** Common code files (.js, .ts, .py, etc.)
- **Images:** OCR for images (when needed)

### Processing Flow

1. **Upload:**
   - User uploads file in chat OR via dashboard
   - Store file on filesystem
   - Store metadata in database

2. **Extraction:**
   - Extract text content based on file type
   - Handle structured data (Excel tables, CSV)
   - OCR for images if needed
   - Store extracted text in `file_content` table

3. **Indexing:**
   - Generate embeddings for text content
   - Store in `embeddings` table
   - Link to file record

4. **Auto-Save Logic:**
   - Important files auto-saved (based on heuristics)
   - User can mark files as temporary/delete later
   - User can explicitly save files to repository

### File Storage

- **Filesystem:** Store actual files in organized directory structure
- **Database:** Store metadata, extracted content, embeddings
- **Path Pattern:** `{org_id}/{department_id}/{file_id}/{filename}`
- **Access Control:** Filesystem permissions + database checks

## Semantic Search Architecture

### Search Strategy

**Hybrid Search:**
- **Semantic Search:** Vector similarity using pgvector
- **Keyword Search:** Full-text search (PostgreSQL full-text indexes)
- **Combine Results:** Merge and rank results from both

### Vector Search Process

1. User query → generate embedding
2. Query pgvector for similar embeddings:
   ```sql
   SELECT *, embedding <=> $1 AS distance
   FROM embeddings
   WHERE department_id IN (...)
   ORDER BY distance
   LIMIT 20
   ```
3. Retrieve source documents (emails, files, conversations)
4. Filter by permissions
5. Rank and return results

### Search Sources

- Emails (body, subject, attachments)
- Files (uploaded documents)
- Conversations (chat history)
- Calendar events (titles, descriptions)
- System-generated content

## Authentication & Authorization

### Authentication Methods

1. **Built-in Auth:**
   - Username/password
   - JWT tokens (3-day expiration)
   - Password hashing (bcrypt)

2. **SSO (OAuth2/SAML):**
   - Microsoft (Azure AD)
   - Google
   - Generic OAuth2/SAML providers
   - Button on login page

3. **LDAP/Active Directory:**
   - Direct LDAP authentication
   - Active Directory integration
   - User sync from LDAP

### Authorization

- **JWT Claims:** Include user_id, role, department_ids
- **Middleware:** Check JWT, verify user exists, load permissions
- **RBAC:** Role-based access control (Admin, Super User, User)
- **Department Access:** Filter data by user's departments

## Real-Time Communication

### WebSocket Architecture

- **Connection:** WebSocket connection per user session
- **Channels:** User-specific channels, department channels
- **Events:**
  - New message in chat
  - Email received
  - Calendar event created
  - Notification
  - Proactive reminder

### Notification System

- **In-App:** Real-time notifications via WebSocket
- **Email:** Send email notifications for important events
- **User Preferences:** Configurable notification settings

## Audit Logging System

### Logging Requirements

**Everything is logged:**
- User actions (queries, file uploads, emails sent)
- AI tool calls
- Permission checks
- Data access (what data was accessed)
- System events

### Audit Log Schema

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action_type VARCHAR(50), -- 'email_sent', 'file_uploaded', 'ai_query', etc.
  resource_type VARCHAR(50), -- 'email', 'file', 'conversation', etc.
  resource_id UUID,
  department_id UUID,
  details JSONB, -- Full details of action
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Logging Implementation

- **Middleware:** Log all API requests
- **Service Layer:** Log business logic actions
- **Database Triggers:** Log data changes (optional, for critical tables)
- **Retention:** Configurable retention policies

## Security Architecture

### Data Security

- **Encryption at Rest:** Database encryption, filesystem encryption
- **Encryption in Transit:** HTTPS/TLS for all connections
- **Secret Management:** Environment variables, secure storage for API keys
- **Password Security:** Bcrypt hashing, strong password requirements

### API Security

- **Rate Limiting:** Per-user, per-endpoint rate limits
- **Input Validation:** Validate all inputs (Zod schemas)
- **SQL Injection Prevention:** Prisma ORM (parameterized queries)
- **XSS Prevention:** React's built-in XSS protection, sanitize user input

### Permission Security

- **RLS Enforcement:** Database-level isolation
- **Application Checks:** Double-check permissions in application code
- **Tool Permissions:** Tools check permissions before execution
- **Audit Trail:** Log all permission checks

## Performance Considerations

### Database Optimization

- **Indexes:** Strategic indexes on frequently queried columns
- **Connection Pooling:** Prisma connection pooling
- **Query Optimization:** Efficient queries, avoid N+1 problems
- **RLS Performance:** RLS policies optimized for performance

### Caching Strategy

- **Session Cache:** Cache user permissions, department memberships
- **API Response Cache:** Cache frequent queries (semantic search results)
- **Embedding Cache:** Cache frequently used embeddings

### Vector Search Performance

- **Indexes:** HNSW indexes on vector columns
- **Batch Queries:** Batch embedding generation when possible
- **Approximate Search:** Use approximate search for speed (pgvector supports)

## Web Search Integration

### Implementation Approach

**OpenAI Web Search Status:**
- As of 2025, OpenAI does not provide native web search/browsing capability
- Must implement as custom tool using third-party search APIs

### Third-Party Search API Options

**Recommended: Tavily API**
- **Pricing:** Free tier available, paid plans for production
- **Features:** Real-time web search, citation sources, relevance scoring
- **Rate Limits:** Varies by plan
- **Advantages:** Built for AI applications, returns structured results

**Alternative: SerpAPI**
- **Pricing:** Paid plans, free tier limited
- **Features:** Google search results, various search types
- **Rate Limits:** Based on plan
- **Advantages:** More comprehensive search coverage

**Alternative: Custom Implementation**
- Use search engines' public APIs or scraping (with rate limiting)
- Requires more maintenance and may violate terms of service

### Web Search Tool Implementation

**Tool Definition:**
```typescript
{
  type: 'function',
  function: {
    name: 'search_web',
    description: 'Search the web for current information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        max_results: { type: 'number', default: 5 },
      },
      required: ['query'],
    },
  },
}
```

**Execution Flow:**
1. AI decides to search web based on user query
2. Tool executor calls third-party search API
3. Results formatted and returned to AI
4. AI incorporates results into response
5. Search query and results logged to audit_logs

**Configuration:**
- Admin can enable/disable web search globally
- Default: enabled
- Can be disabled for compliance/security reasons
- Rate limiting to prevent abuse

**Cost Management:**
- Track web search API costs separately
- Include in overall cost tracking system
- Admin can set limits on web search usage

## Cost Tracking & Management

### Cost Tracking Architecture

**Purpose:**
- Track OpenAI API usage and costs
- Enforce usage limits
- Provide cost analytics
- Budget management

### Database Schema

See [Database Schema](organizational-ai-assistant-database.md#cost-tracking-tables) for complete schema:
- `api_usage` - Track all API calls (tokens, costs)
- `usage_limits` - Define and track usage limits
- `cost_settings` - Configure cost limits and alerts

### Cost Calculation

**OpenAI Pricing (as of 2025, approximate):**
- GPT-5.1 mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- GPT-5.1 nano: ~$0.10 per 1M input tokens, ~$0.40 per 1M output tokens
- Embeddings (text-embedding-3-small): ~$0.02 per 1M tokens

**Cost Tracking:**
1. Track every API call with token counts
2. Calculate cost based on model pricing
3. Store in `api_usage` table
4. Aggregate by user, department, organization

### Usage Limits

**Limit Types:**
- **Daily Tokens:** Maximum tokens per day
- **Monthly Tokens:** Maximum tokens per month
- **Daily Cost:** Maximum cost in USD per day
- **Monthly Cost:** Maximum cost in USD per month

**Limit Hierarchy:**
1. User-level limits (most specific)
2. Department-level limits
3. Organization-level limits (least specific)
4. System-wide defaults

**Enforcement:**
- Check limits before API calls
- Block requests if limit exceeded
- Allow overrides for admins
- Send alerts when approaching limits

### Cost Optimization Strategies

1. **Caching:**
   - Cache embeddings for identical content
   - Cache frequent AI responses
   - Reduce redundant API calls

2. **Batch Processing:**
   - Batch embedding generation
   - Process multiple items in single call when possible

3. **Model Selection:**
   - Use cheaper models for simple tasks
   - Use GPT-5.1 nano for routine queries
   - Reserve GPT-5.1 mini for complex tasks

4. **Context Optimization:**
   - Minimize context window size
   - Summarize old messages efficiently
   - Remove irrelevant context

5. **Smart Rate Limiting:**
   - Throttle expensive operations
   - Queue non-urgent requests
   - Prioritize high-value operations

### Cost Dashboard

**Admin Dashboard Features:**
- Total costs by user, department, organization
- Cost trends over time
- Usage breakdown by model type
- Projected monthly costs
- Alerts for budget thresholds

**User Features:**
- Personal usage statistics
- Remaining quota/limits
- Cost breakdown of recent activity

## Scalability Strategy

### Horizontal Scaling

- **Stateless Application:** Next.js API routes are stateless
- **Load Balancing:** Multiple Node.js instances behind load balancer
- **Database Scaling:** Read replicas for read-heavy workloads
- **File Storage:** Could migrate to object storage (S3) if needed

### Vertical Scaling

- **Database:** Upgrade PostgreSQL instance (more RAM, CPU)
- **Application:** Increase Node.js instance resources
- **Background Jobs:** Separate workers for heavy processing

### Optimization Opportunities

- **Background Processing:** Move heavy tasks (embedding generation, email polling) to background workers
- **Async Processing:** Async email sending, file processing
- **Batching:** Batch API calls when possible

