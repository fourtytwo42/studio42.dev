# Organizational AI Assistant - AI Tools Specification

**Complete specification of all tools available to the AI assistant, their parameters, permissions, and implementation details.**

## Table of Contents

1. [Tools Overview](#tools-overview)
2. [Search Tools](#search-tools)
3. [Communication Tools](#communication-tools)
4. [File Management Tools](#file-management-tools)
5. [Calendar Tools](#calendar-tools)
6. [Collaboration Tools](#collaboration-tools)
7. [Tool Execution Flow](#tool-execution-flow)
8. [Permission Model](#permission-model)
9. [Error Handling](#error-handling)

## Tools Overview

The AI assistant has access to a set of tools that allow it to interact with the system and perform actions on behalf of users. All tools:

- Check permissions before execution
- Log actions to audit_logs
- Return structured JSON responses
- Can be called sequentially or in parallel by the AI (parallel tool calls supported)
- Support async execution for long-running operations

### Tool Definition Format (OpenAI JSON Schema)

All tools must be defined in OpenAI's tool format using JSON Schema:

```typescript
{
  type: "function",
  function: {
    name: "tool_name", // Must match function name exactly
    description: "Clear description of what the tool does. The model uses this to decide when to call the tool.",
    parameters: {
      type: "object",
      properties: {
        paramName: {
          type: "string" | "number" | "boolean" | "object" | "array",
          description: "Parameter description - be specific, model uses this",
          // Optional constraints
          enum: [...], // For specific values
          default: value, // Default value
          // For nested objects
          properties: { ... },
          required: ["nestedParam"]
        }
      },
      required: ["paramName"] // Array of required parameter names
    }
  }
}
```

**Best Practices:**
- **Clear Descriptions:** Tool and parameter descriptions are critical - the model uses these to decide when and how to call tools
- **Specific Parameter Types:** Use appropriate types (string, number, boolean, object, array)
- **Required Fields:** Mark required parameters in the `required` array
- **Default Values:** Provide defaults for optional parameters when possible
- **Nested Objects:** Use nested `properties` for complex parameter structures

## Search Tools

### search_emails

**Description:** Search user's emails by query, sender, subject, date range, etc.

**Parameters:**
```json
{
  "query": "string (optional) - Full-text search query",
  "sender": "string (optional) - Filter by sender email",
  "subject": "string (optional) - Filter by subject",
  "folder": "string (optional) - 'inbox' | 'sent' | 'drafts'",
  "startDate": "string (optional) - ISO 8601 date",
  "endDate": "string (optional) - ISO 8601 date",
  "unreadOnly": "boolean (optional) - Filter unread emails only",
  "limit": "number (optional) - Max results (default: 20)"
}
```

**Permissions:**
- User can search their own emails
- User can search emails from their departments (including shared mailboxes)
- Filtered by department membership automatically

**Returns:**
```json
{
  "emails": [
    {
      "id": "uuid",
      "subject": "Email subject",
      "from": { "email": "sender@example.com", "name": "Sender Name" },
      "preview": "Email preview...",
      "receivedAt": "2025-12-10T12:00:00Z",
      "unread": true
    }
  ],
  "total": 42
}
```

### search_files

**Description:** Search uploaded files by filename, content, or metadata.

**Parameters:**
```json
{
  "query": "string (optional) - Search query",
  "contentType": "string (optional) - Filter by file type",
  "conversationId": "string (optional) - Filter by conversation",
  "limit": "number (optional) - Max results (default: 20)"
}
```

**Permissions:**
- User can search files from their departments
- Filtered by department membership automatically

**Returns:**
```json
{
  "files": [
    {
      "id": "uuid",
      "filename": "document.pdf",
      "contentType": "application/pdf",
      "uploadedAt": "2025-12-10T12:00:00Z",
      "indexed": true
    }
  ],
  "total": 15
}
```

### semantic_search

**Description:** Semantic search across all indexed content (emails, files, conversations).

**Parameters:**
```json
{
  "query": "string (required) - Natural language search query",
  "types": "array (optional) - ['email', 'file', 'conversation']",
  "limit": "number (optional) - Max results (default: 20)",
  "threshold": "number (optional) - Similarity threshold (default: 0.7)"
}
```

**Permissions:**
- User can search content from their departments
- Vector search automatically filtered by department_id

**Returns:**
```json
{
  "results": [
    {
      "id": "uuid",
      "type": "email",
      "title": "Result title",
      "preview": "Preview text...",
      "relevanceScore": 0.95,
      "source": {
        "id": "uuid",
        "type": "email",
        "subject": "Email subject"
      }
    }
  ],
  "total": 25
}
```

### search_web

**Description:** Search the web for current information, news, or recent developments.

**Parameters:**
```json
{
  "query": "string (required) - Search query",
  "maxResults": "number (optional) - Max results (default: 5)"
}
```

**Permissions:**
- Available to all users (if web search enabled)
- Admin-configurable (can be disabled)

**Returns:**
```json
{
  "query": "search query",
  "results": [
    {
      "title": "Result title",
      "url": "https://example.com/article",
      "content": "Result content...",
      "score": 0.95
    }
  ],
  "answer": "AI-generated summary answer"
}
```

## Communication Tools

### send_email

**Description:** Send email on behalf of user.

**Parameters:**
```json
{
  "to": "array<string> (required) - Recipient email addresses",
  "cc": "array<string> (optional) - CC recipients",
  "bcc": "array<string> (optional) - BCC recipients",
  "subject": "string (required) - Email subject",
  "body": "string (required) - Email body (HTML or plain text)",
  "accountId": "string (optional) - Email account to send from",
  "attachments": "array<{fileId: string}> (optional) - Attach files"
}
```

**Permissions:**
- User can send from their own email accounts
- User can send from shared mailboxes in their departments
- Requires confirmation (initially, learns user preference over time)

**Returns:**
```json
{
  "id": "uuid",
  "status": "sent" | "pending_confirmation",
  "sentAt": "2025-12-10T12:00:00Z",
  "requiresConfirmation": false
}
```

**Special Behavior:**
- If user preference allows auto-send: sends immediately
- Otherwise: requires user confirmation
- AI learns from user's confirmation behavior

### relay_message

**Description:** Relay message to another team member in the same department.

**Parameters:**
```json
{
  "userId": "string (required) - Target user ID",
  "message": "string (required) - Message content",
  "context": "string (optional) - Context about the message"
}
```

**Permissions:**
- User can relay to other users in their departments
- Cannot relay to users outside departments

**Returns:**
```json
{
  "success": true,
  "delivered": true,
  "deliveredAt": "2025-12-10T12:00:00Z"
}
```

**Special Behavior:**
- Creates notification for target user
- If target user is active, delivers via WebSocket
- Otherwise, creates in-app notification

## File Management Tools

### upload_file

**Description:** Upload and index a file for the AI to reference.

**Parameters:**
```json
{
  "filename": "string (required) - File name",
  "content": "string (required) - File content (base64 encoded)",
  "contentType": "string (required) - MIME type",
  "conversationId": "string (optional) - Attach to conversation",
  "autoSave": "boolean (optional) - Auto-save to repository (default: true)"
}
```

**Permissions:**
- User can upload files to their departments
- File automatically assigned to user's department

**Returns:**
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "status": "processing" | "indexed" | "error",
  "indexedAt": "2025-12-10T12:00:00Z"
}
```

**Special Behavior:**
- File processed asynchronously
- Content extracted and indexed
- Embeddings generated automatically
- Status updates via WebSocket

### create_file

**Description:** Create a new document/file.

**Parameters:**
```json
{
  "filename": "string (required) - File name",
  "content": "string (required) - File content",
  "contentType": "string (optional) - MIME type (default: 'text/plain')",
  "format": "string (optional) - 'markdown' | 'plain' | 'html'"
}
```

**Permissions:**
- User can create files in their departments

**Returns:**
```json
{
  "id": "uuid",
  "filename": "document.md",
  "url": "/api/files/uuid/download",
  "createdAt": "2025-12-10T12:00:00Z"
}
```

### get_file_content

**Description:** Retrieve file content for AI to read.

**Parameters:**
```json
{
  "fileId": "string (required) - File ID"
}
```

**Permissions:**
- User can access files from their departments

**Returns:**
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "content": "Extracted text content...",
  "contentType": "application/pdf",
  "size": 12345
}
```

## Calendar Tools

### read_calendar

**Description:** Read user's calendar events.

**Parameters:**
```json
{
  "startDate": "string (optional) - ISO 8601 date (default: today)",
  "endDate": "string (optional) - ISO 8601 date (default: 30 days)",
  "accountId": "string (optional) - Filter by calendar account"
}
```

**Permissions:**
- User can read their own calendars
- Cannot read other users' calendars

**Returns:**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Meeting Title",
      "start": "2025-12-10T14:00:00Z",
      "end": "2025-12-10T15:00:00Z",
      "location": "Conference Room A",
      "attendees": [
        { "email": "attendee@example.com", "status": "accepted" }
      ]
    }
  ],
  "total": 10
}
```

### create_calendar_event

**Description:** Create calendar appointment.

**Parameters:**
```json
{
  "title": "string (required) - Event title",
  "start": "string (required) - ISO 8601 datetime",
  "end": "string (required) - ISO 8601 datetime",
  "location": "string (optional) - Event location",
  "description": "string (optional) - Event description",
  "attendees": "array<string> (optional) - Attendee email addresses",
  "accountId": "string (optional) - Calendar account to use",
  "sendInvites": "boolean (optional) - Send invites to attendees (default: true)"
}
```

**Permissions:**
- User can create events in their own calendars
- Requires confirmation (initially, learns user preference)

**Returns:**
```json
{
  "id": "uuid",
  "status": "created" | "pending_confirmation",
  "createdAt": "2025-12-10T12:00:00Z",
  "requiresConfirmation": false
}
```

**Special Behavior:**
- Checks for conflicts
- Sends meeting invites if requested
- AI learns from user's confirmation behavior

## Collaboration Tools

### get_user_info

**Description:** Get information about a user (for team collaboration).

**Parameters:**
```json
{
  "userId": "string (optional) - User ID (default: current user)",
  "email": "string (optional) - User email (alternative to userId)"
}
```

**Permissions:**
- User can get info about users in their departments
- Returns limited info (name, email, departments, availability)

**Returns:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "departments": [
    { "id": "uuid", "name": "IT" }
  ],
  "isOnline": true
}
```

### get_team_members

**Description:** Get list of team members in user's departments.

**Parameters:**
```json
{
  "departmentId": "string (optional) - Filter by department"
}
```

**Permissions:**
- User can see members of their departments

**Returns:**
```json
{
  "members": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["user"],
      "isOnline": true
    }
  ],
  "total": 15
}
```

## Tool Execution Flow

### OpenAI Tool Calling Flow

**How OpenAI Tool Calling Works:**

1. **Define Tools:** Tools are defined as JSON Schema objects with name, description, and parameters
2. **Model Decision:** OpenAI model decides when to call tools based on user input and tool descriptions
3. **Tool Call Response:** Model returns `tool_calls` array with function name and arguments (JSON string)
4. **Execute Tools:** Application executes tools (in parallel if multiple calls)
5. **Return Results:** Tool results returned as messages with `role: "tool"` (content must be JSON string)
6. **Model Processing:** Model processes tool results and generates final text response
7. **Repeat if Needed:** Model may make additional tool calls until final answer is ready

### Flow Diagram

```
User Message → AI Processes → Tool Call Decision
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            Text Response              Tool Call(s) in tool_calls[]
                    │                               │
                    │                       ┌───────┴───────┐
                    │                       │               │
                    │              Parallel Execution       │
                    │                       │               │
                    │              Check Permissions        │
                    │                       │               │
                    │              Execute Tools            │
                    │                       │               │
                    │              Log to Audit             │
                    │                       │               │
                    │              Return Results (JSON)    │
                    │                       │               │
                    │              Add to Messages          │
                    │                       │               │
                    └───────────────────────┼───────────────┘
                                            │
                                    Continue Conversation
                                            │
                                    Final Text Response
```

### Message Format in Conversation

**Conversation Flow Example:**

```typescript
// Initial request
messages = [
  { role: "system", content: "You are a helpful assistant..." },
  { role: "user", content: "What did Greg email me about?" }
]

// Model responds with tool calls
messages.push({
  role: "assistant",
  content: null, // No text response yet
  tool_calls: [
    {
      id: "call_abc123",
      type: "function",
      function: {
        name: "search_emails",
        arguments: "{\"query\": \"Greg\", \"limit\": 10}"
      }
    }
  ]
})

// Tool execution results
messages.push({
  role: "tool",
  tool_call_id: "call_abc123",
  content: "{\"success\": true, \"data\": {\"emails\": [...]}}"
})

// Final response from model
messages.push({
  role: "assistant",
  content: "I found 3 emails from Greg last week...",
  tool_calls: null // No more tool calls
})
```

### Implementation Pattern

**Complete Tool Execution with OpenAI Format:**

```typescript
// src/lib/ai/tool-executor.ts
import { OpenAI } from 'openai';

export async function executeTool(
  toolName: string,
  arguments: any,
  context: { userId: string; departmentIds: string[] }
) {
  // 1. Validate tool exists
  const tool = TOOLS[toolName];
  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  // 2. Check permissions
  const hasPermission = await checkToolPermission(
    toolName,
    context.userId,
    context.departmentIds,
    arguments
  );
  if (!hasPermission) {
    throw new Error(`Permission denied for tool: ${toolName}`);
  }

  // 3. Execute tool
  try {
    const result = await tool.execute(arguments, context);
    
    // 4. Log to audit
    await auditLog({
      userId: context.userId,
      actionType: 'tool_execution',
      toolName,
      details: { arguments, result },
    });

    // 5. Return result (will be serialized to JSON string for OpenAI)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // Log error
    await auditLog({
      userId: context.userId,
      actionType: 'tool_execution_error',
      toolName,
      details: { arguments, error: (error as Error).message },
    });
    
    // Return error result (not throw - OpenAI expects JSON response)
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Convert tool result to OpenAI message format
 * Result must be JSON string, not object
 */
export function formatToolResponse(
  toolCallId: string,
  toolName: string,
  result: any
): OpenAI.Chat.Completions.ChatCompletionToolMessageParam {
  return {
    role: 'tool',
    tool_call_id: toolCallId,
    content: JSON.stringify(result), // Must be JSON string!
  };
}
```

**Key Points:**
- Tool results **must** be JSON strings (use `JSON.stringify()`)
- Use `role: "tool"` for tool response messages
- Include `tool_call_id` matching the original tool call ID
- Handle errors gracefully - return error in result, don't throw
- Execute multiple tools in parallel when model calls them simultaneously

## Permission Model

### Permission Checks

All tools check permissions before execution:

1. **Department Access:** Tool can only access data from user's departments
2. **Resource Permissions:** User must have permission to perform action
3. **Tool Availability:** Some tools may be disabled globally (e.g., web search)

### Permission Hierarchy

1. **System-wide settings** (admin-only, affects all users)
2. **Organization-level limits** (affects all users in org)
3. **Department-level permissions** (affects users in department)
4. **User-level preferences** (affects individual user)

### Example Permission Check

```typescript
async function checkToolPermission(
  toolName: string,
  userId: string,
  departmentIds: string[],
  arguments: any
): Promise<boolean> {
  // Check if tool is enabled globally
  const settings = await getSystemSettings();
  if (toolName === 'search_web' && !settings.webSearchEnabled) {
    return false;
  }

  // Check department access for data access tools
  if (['search_emails', 'search_files'].includes(toolName)) {
    // RLS policies handle this, but double-check in application
    return departmentIds.length > 0;
  }

  // Check user permissions for action tools
  if (['send_email', 'create_calendar_event'].includes(toolName)) {
    const user = await getUser(userId);
    return user.roles.some(role => ['user', 'super_user', 'admin'].includes(role));
  }

  return true;
}
```

## Error Handling

### Error Types

1. **Permission Errors:** User doesn't have permission
2. **Validation Errors:** Invalid parameters
3. **Resource Errors:** Resource not found or inaccessible
4. **External API Errors:** Third-party service failures
5. **System Errors:** Internal system failures

### Error Response Format

```json
{
  "error": true,
  "errorType": "permission_denied" | "validation_error" | "resource_not_found" | "external_api_error" | "system_error",
  "message": "Human-readable error message",
  "details": {
    "tool": "tool_name",
    "arguments": { ... },
    "code": "ERROR_CODE"
  }
}
```

### Error Handling in Tools

```typescript
export async function toolExecute(
  toolName: string,
  arguments: any,
  context: ToolContext
) {
  try {
    // Validate arguments
    const validatedArgs = validateToolArguments(toolName, arguments);
    
    // Execute tool
    const result = await executeToolLogic(toolName, validatedArgs, context);
    
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof PermissionError) {
      return {
        success: false,
        error: {
          errorType: 'permission_denied',
          message: 'You do not have permission to perform this action',
        },
      };
    }
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          errorType: 'validation_error',
          message: error.message,
        },
      };
    }
    
    // Log unexpected errors
    logger.error('Tool execution error', {
      toolName,
      arguments,
      error: error.message,
    });
    
    return {
      success: false,
      error: {
        errorType: 'system_error',
        message: 'An error occurred while executing the tool',
      },
    };
  }
}
```

