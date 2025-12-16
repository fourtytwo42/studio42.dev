# Organizational AI Assistant - Quick Reference Guide

**Essential information for implementation at a glance.**

## Critical Implementation Points

### OpenAI Integration

**API Choice:** Chat Completions API with Function Calling (not Assistants API, not Codex CLI)

**Key Patterns:**
- Tool results must be JSON strings (use `JSON.stringify()`)
- Tool calls can be parallel - execute with `Promise.all()`
- Conversation loop: Request → Tool Calls → Results → Final Response
- Maximum 10 iterations to prevent infinite loops
- Always validate tool arguments before execution

**Tool Response Format:**
```typescript
{
  role: 'tool',
  tool_call_id: 'call_abc123',
  content: JSON.stringify({ success: true, data: result }) // Must be string!
}
```

### Security Requirements

**Critical Security Checks:**
1. ✅ Validate all tool arguments with JSON Schema
2. ✅ Sanitize string inputs (prevent injection)
3. ✅ Check permissions before EVERY tool execution
4. ✅ Rate limit tool calls per user
5. ✅ Limit tool response sizes
6. ✅ Log all tool calls to audit trail

### Permission Model

**Department Isolation:**
- RLS policies enforce data boundaries
- Filter by `department_id` in ALL queries
- Tools receive department context
- Users can access union of their departments

**Tool Permission Check Order:**
1. Check if tool exists
2. Check user permissions for tool
3. Check department access
4. Validate arguments
5. Execute tool

### Context Management

**Sliding Window Strategy:**
- Keep last 50 messages in full
- Summarize older messages when context > 100K tokens
- Always preserve system prompt
- Store summaries in database for future reference

**Token Estimation:**
- Rough: ~4 characters per token
- Better: Use `tiktoken` library for accuracy
- Target: Keep under 100K tokens (leave room for new messages)

### Testing Requirements

**CRITICAL:** 90% code coverage, 100% passing tests

**Must Test:**
- Tool call validation
- Permission enforcement
- Parallel tool execution
- Error handling
- Context window management
- Department isolation

### Database Schema

**Key Tables:**
- `users`, `departments`, `user_departments` - Access control
- `conversations`, `messages` - Chat history
- `emails`, `files`, `calendar_events` - Data sources
- `embeddings` - Vector storage (pgvector)
- `api_usage`, `usage_limits` - Cost tracking
- `audit_logs` - Full audit trail

**RLS:** Enabled on ALL data tables with department filtering

### Cost Management

**Track Everything:**
- All OpenAI API calls (chat, embeddings)
- Token usage per call
- Cost calculation per model
- Usage limits (user, department, organization)

**Optimization:**
- Cache embeddings for identical content
- Batch embedding generation
- Use cheaper models for simple tasks
- Limit tool response sizes

### Error Handling

**Pattern:**
```typescript
try {
  const result = await tool.execute(...);
  return { success: true, data: result };
} catch (error) {
  // Log to audit
  await auditLog({ ... });
  // Return error, don't throw (for tool responses)
  return { success: false, error: error.message };
}
```

**Retry Logic:**
- Exponential backoff for transient errors
- Respect `Retry-After` headers
- Maximum 3-5 retry attempts
- Circuit breakers for failing services

### Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `NODE_ENV` - Environment (development/production)

**Optional but Recommended:**
- `OPENAI_MODEL` - Model override (default: gpt-5.1-mini)
- `TAVILY_API_KEY` - Web search API key
- `MICROSOFT_CLIENT_ID`, `GOOGLE_CLIENT_ID` - OAuth credentials

### File Processing

**Supported Formats:**
- Documents: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
- Text: TXT, CSV, Markdown
- Code: Common code files

**Process:**
1. Upload → Store on filesystem
2. Extract text content
3. Generate embeddings
4. Index in PostgreSQL (pgvector)
5. Store metadata in database

### Rate Limits

**API Rate Limits:**
- Chat API: 60 requests/minute per user
- Search API: 30 requests/minute per user
- Email Send: 20 requests/minute per user
- Tool Calls: 100 calls/minute per user

**External API Limits:**
- Microsoft Graph: 10K read / 4K write per 10 minutes
- Gmail API: 250 quota units/second per user
- OpenAI: Varies by tier

### Common Pitfalls

**❌ DON'T:**
- Forget to validate tool arguments
- Return tool results as objects (must be JSON strings)
- Skip permission checks (even if model shouldn't call unauthorized tools)
- Forget to handle parallel tool calls
- Allow infinite tool calling loops (max 10 iterations)
- Expose sensitive data in tool responses

**✅ DO:**
- Always validate and sanitize inputs
- Check permissions before execution
- Log everything to audit trail
- Test permission boundaries thoroughly
- Limit tool response sizes
- Handle errors gracefully

### Quick Start Checklist

**Before Starting Development:**
- [ ] Read architecture document
- [ ] Review API specifications
- [ ] Understand permission model
- [ ] Set up database with RLS
- [ ] Configure environment variables
- [ ] Test OpenAI API connection
- [ ] Review tool specifications

**First Implementation:**
- [ ] Set up project structure
- [ ] Configure database connection
- [ ] Implement authentication
- [ ] Create basic chat endpoint
- [ ] Add one tool (e.g., search_emails)
- [ ] Test tool execution flow
- [ ] Add permission checks
- [ ] Add audit logging

## Useful Links

- [Architecture Document](organizational-ai-assistant-architecture.md)
- [Implementation Guide](organizational-ai-assistant-implementation.md)
- [API Specifications](organizational-ai-assistant-api.md)
- [Database Schema](organizational-ai-assistant-database.md)
- [Tool Specifications](organizational-ai-assistant-tools.md)
- [Improvements](IMPROVEMENTS.md)

