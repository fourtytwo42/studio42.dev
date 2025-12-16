# Organizational AI Assistant - API Specifications

**Complete API endpoint specifications, request/response formats, authentication, and WebSocket events.**

## Table of Contents

1. [Authentication](#authentication)
2. [Chat & AI Endpoints](#chat--ai-endpoints)
3. [Email Endpoints](#email-endpoints)
4. [Calendar Endpoints](#calendar-endpoints)
5. [File Management Endpoints](#file-management-endpoints)
6. [Search Endpoints](#search-endpoints)
7. [User Management Endpoints](#user-management-endpoints)
8. [Admin Endpoints](#admin-endpoints)
9. [Notification Endpoints](#notification-endpoints)
10. [WebSocket Events](#websocket-events)

## Authentication

### POST /api/auth/login
**Description:** Authenticate user with username/password

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"],
    "departments": [
      { "id": "uuid", "name": "IT" },
      { "id": "uuid", "name": "Infrastructure" }
    ]
  },
  "expiresAt": "2025-12-13T12:00:00Z"
}
```

### POST /api/auth/sso/initiate
**Description:** Initiate SSO authentication

**Request:**
```json
{
  "provider": "microsoft" // "microsoft" | "google" | "saml"
}
```

**Response:**
```json
{
  "redirectUrl": "https://login.microsoftonline.com/..."
}
```

### POST /api/auth/sso/callback
**Description:** Handle SSO callback

**Query Parameters:**
- `code`: OAuth code
- `state`: State parameter

**Response:** Same as `/api/auth/login`

### POST /api/auth/ldap
**Description:** Authenticate via LDAP

**Request:**
```json
{
  "username": "user@domain.com",
  "password": "password123"
}
```

**Response:** Same as `/api/auth/login`

### POST /api/auth/refresh
**Description:** Refresh JWT token

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "token": "new-jwt-token",
  "expiresAt": "2025-12-13T12:00:00Z"
}
```

### POST /api/auth/logout
**Description:** Logout user (invalidate token)

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

## Chat & AI Endpoints

### POST /api/chat/conversations
**Description:** Create new conversation

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Optional conversation title"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Optional conversation title",
  "userId": "uuid",
  "createdAt": "2025-12-10T12:00:00Z"
}
```

### POST /api/chat/conversations/:id/messages
**Description:** Send message to AI

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "content": "What did Greg email me about last week?",
  "includeContext": true // Include proactive reminders
}
```

**Response:**
```json
{
  "messageId": "uuid",
  "content": "I found 3 emails from Greg last week...",
  "toolCalls": [
    {
      "id": "call_123",
      "name": "search_emails",
      "arguments": { "query": "Greg", "limit": 10 }
    }
  ],
  "status": "complete" // "streaming" | "complete" | "tool_executing"
}
```

### GET /api/chat/conversations/:id/messages
**Description:** Get conversation messages

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `before`: Message ID to paginate before

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user" | "assistant",
      "content": "Message content",
      "toolCalls": [],
      "createdAt": "2025-12-10T12:00:00Z"
    }
  ],
  "hasMore": false
}
```

### POST /api/chat/conversations/:id/messages/:messageId/correct
**Description:** Correct AI response

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "correction": "The correct information is..."
}
```

**Response:**
```json
{
  "success": true,
  "updated": true
}
```

### GET /api/chat/conversations
**Description:** List user's conversations

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of conversations (default: 20)
- `offset`: Pagination offset

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Conversation title",
      "lastMessageAt": "2025-12-10T12:00:00Z",
      "messageCount": 15
    }
  ],
  "total": 42
}
```

## Email Endpoints

### GET /api/emails
**Description:** List emails

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of emails (default: 20)
- `offset`: Pagination offset
- `folder`: "inbox" | "sent" | "drafts" (default: "inbox")
- `query`: Search query

**Response:**
```json
{
  "emails": [
    {
      "id": "uuid",
      "subject": "Email subject",
      "from": { "email": "sender@example.com", "name": "Sender Name" },
      "to": [{ "email": "recipient@example.com", "name": "Recipient Name" }],
      "preview": "Email preview text...",
      "unread": true,
      "receivedAt": "2025-12-10T12:00:00Z",
      "accountId": "uuid"
    }
  ],
  "total": 100
}
```

### GET /api/emails/:id
**Description:** Get email details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "subject": "Email subject",
  "from": { "email": "sender@example.com", "name": "Sender Name" },
  "to": [{ "email": "recipient@example.com", "name": "Recipient Name" }],
  "cc": [],
  "bcc": [],
  "body": "Email HTML/plain text content",
  "attachments": [
    {
      "id": "uuid",
      "filename": "document.pdf",
      "size": 12345,
      "contentType": "application/pdf"
    }
  ],
  "receivedAt": "2025-12-10T12:00:00Z",
  "accountId": "uuid",
  "departmentId": "uuid"
}
```

### POST /api/emails/send
**Description:** Send email (via AI tool or direct)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "to": ["recipient@example.com"],
  "cc": [],
  "bcc": [],
  "subject": "Email subject",
  "body": "Email content",
  "accountId": "uuid", // Which email account to send from
  "requireConfirmation": false // AI learning preference
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "sent",
  "sentAt": "2025-12-10T12:00:00Z"
}
```

### POST /api/emails/accounts
**Description:** Connect email account

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "provider": "microsoft" | "google" | "imap",
  "accountType": "personal" | "shared",
  "departmentId": "uuid", // For shared accounts
  "indexHistory": true,
  "indexHistoryMonths": null // null = all, or number
}
```

**Response:**
```json
{
  "id": "uuid",
  "provider": "microsoft",
  "email": "account@example.com",
  "status": "connected",
  "indexingStatus": "in_progress"
}
```

### DELETE /api/emails/accounts/:id
**Description:** Disconnect email account

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

## Calendar Endpoints

### GET /api/calendar/events
**Description:** List calendar events

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `start`: Start date (ISO 8601)
- `end`: End date (ISO 8601)
- `accountId`: Filter by calendar account

**Response:**
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
      ],
      "organizer": { "email": "organizer@example.com", "name": "Organizer" },
      "accountId": "uuid"
    }
  ]
}
```

### POST /api/calendar/events
**Description:** Create calendar event (via AI tool or direct)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Meeting Title",
  "start": "2025-12-10T14:00:00Z",
  "end": "2025-12-10T15:00:00Z",
  "location": "Conference Room A",
  "description": "Meeting description",
  "attendees": ["attendee@example.com"],
  "accountId": "uuid",
  "sendInvites": true,
  "requireConfirmation": false // AI learning preference
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "created",
  "createdAt": "2025-12-10T12:00:00Z"
}
```

### POST /api/calendar/accounts
**Description:** Connect calendar account

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "provider": "microsoft" | "google",
  "accountType": "personal" | "shared"
}
```

**Response:**
```json
{
  "id": "uuid",
  "provider": "microsoft",
  "email": "account@example.com",
  "status": "connected"
}
```

## File Management Endpoints

### POST /api/files/upload
**Description:** Upload file

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: File to upload
- `conversationId`: Optional conversation ID to attach to
- `autoSave`: Auto-save to repository (default: true)

**Response:**
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "size": 12345,
  "contentType": "application/pdf",
  "status": "processing", // "processing" | "indexed" | "error"
  "indexedAt": null
}
```

### GET /api/files
**Description:** List files

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of files (default: 20)
- `offset`: Pagination offset
- `query`: Search query
- `conversationId`: Filter by conversation

**Response:**
```json
{
  "files": [
    {
      "id": "uuid",
      "filename": "document.pdf",
      "size": 12345,
      "contentType": "application/pdf",
      "uploadedAt": "2025-12-10T12:00:00Z",
      "indexed": true,
      "autoSaved": true
    }
  ],
  "total": 50
}
```

### GET /api/files/:id
**Description:** Get file details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "size": 12345,
  "contentType": "application/pdf",
  "url": "/api/files/:id/download",
  "uploadedAt": "2025-12-10T12:00:00Z",
  "indexed": true,
  "extractedContent": "Extracted text content...",
  "departmentId": "uuid"
}
```

### GET /api/files/:id/download
**Description:** Download file

**Headers:**
- `Authorization: Bearer <token>`

**Response:** File download (binary)

### DELETE /api/files/:id
**Description:** Delete file

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

### POST /api/files/:id/save
**Description:** Mark file as saved to repository

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "autoSaved": true
}
```

## Search Endpoints

### POST /api/search
**Description:** Semantic + keyword search

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "query": "Search query",
  "types": ["email", "file", "conversation"], // Optional filter
  "limit": 20
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "type": "email" | "file" | "conversation",
      "title": "Result title",
      "preview": "Preview text...",
      "relevanceScore": 0.95,
      "source": {
        "id": "uuid",
        "type": "email",
        "subject": "Email subject",
        "receivedAt": "2025-12-10T12:00:00Z"
      }
    }
  ],
  "total": 25
}
```

### POST /api/search/semantic
**Description:** Semantic search only

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "query": "Search query",
  "types": ["email", "file"],
  "limit": 20,
  "threshold": 0.7 // Similarity threshold
}
```

**Response:** Same as `/api/search`

## User Management Endpoints

### GET /api/users/me
**Description:** Get current user profile

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["user"],
  "departments": [
    { "id": "uuid", "name": "IT" }
  ],
  "preferences": {
    "proactiveReminders": true,
    "emailNotifications": true,
    "calendarAutoCreate": false
  }
}
```

### PUT /api/users/me/preferences
**Description:** Update user preferences

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "proactiveReminders": true,
  "emailNotifications": false,
  "calendarAutoCreate": false,
  "dataRetentionDays": 365
}
```

**Response:**
```json
{
  "success": true,
  "preferences": { ... }
}
```

## Admin Endpoints

### GET /api/admin/users
**Description:** List all users (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `departmentId`: Filter by department
- `role`: Filter by role

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": ["user"],
      "departments": [{ "id": "uuid", "name": "IT" }],
      "createdAt": "2025-12-10T12:00:00Z"
    }
  ],
  "total": 100
}
```

### POST /api/admin/users
**Description:** Create user (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "temp-password",
  "role": "user",
  "departmentIds": ["uuid"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### GET /api/admin/departments
**Description:** List departments (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "departments": [
    {
      "id": "uuid",
      "name": "IT",
      "userCount": 15,
      "createdAt": "2025-12-10T12:00:00Z"
    }
  ]
}
```

### POST /api/admin/settings
**Description:** Update system settings (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "defaultEmailIndexing": "all" | "last_n_months",
  "defaultEmailIndexingMonths": 12,
  "autoIndexAttachments": true,
  "webSearchEnabled": true,
  "defaultDataRetentionDays": 365
}
```

**Response:**
```json
{
  "success": true,
  "settings": { ... }
}
```

### GET /api/admin/costs
**Description:** Get cost analytics (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `departmentId`: Filter by department (optional)
- `userId`: Filter by user (optional)
- `groupBy`: "user" | "department" | "model" | "day" | "month"

**Response:**
```json
{
  "totalCost": 1234.56,
  "totalTokens": 5000000,
  "breakdown": [
    {
      "group": "gpt-5.1-mini",
      "cost": 800.00,
      "tokens": 2000000,
      "requests": 1500
    }
  ],
  "period": {
    "start": "2025-12-01T00:00:00Z",
    "end": "2025-12-10T23:59:59Z"
  }
}
```

### POST /api/admin/usage-limits
**Description:** Set usage limits (Admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "scopeType": "user" | "department" | "organization",
  "scopeId": "uuid",
  "limits": {
    "dailyTokens": 100000,
    "monthlyTokens": 3000000,
    "dailyCost": 10.00,
    "monthlyCost": 300.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "limits": { ... }
}
```

## Notification Endpoints

### GET /api/notifications
**Description:** Get user notifications

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `unreadOnly`: Filter unread only (default: false)
- `limit`: Number of notifications (default: 20)

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "proactive_reminder" | "email_received" | "calendar_event",
      "title": "Notification title",
      "message": "Notification message",
      "read": false,
      "createdAt": "2025-12-10T12:00:00Z",
      "actionUrl": "/api/emails/:id"
    }
  ],
  "unreadCount": 5
}
```

### PUT /api/notifications/:id/read
**Description:** Mark notification as read

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

## WebSocket Events

### Connection
**Endpoint:** `ws://api/ws`
**Auth:** Include JWT token in connection header or query parameter

### Events

#### Client → Server

**message:send**
```json
{
  "type": "message:send",
  "conversationId": "uuid",
  "content": "Message content"
}
```

**message:stream:subscribe**
```json
{
  "type": "message:stream:subscribe",
  "messageId": "uuid"
}
```

#### Server → Client

**message:new**
```json
{
  "type": "message:new",
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "AI response",
    "createdAt": "2025-12-10T12:00:00Z"
  }
}
```

**message:stream:chunk**
```json
{
  "type": "message:stream:chunk",
  "messageId": "uuid",
  "chunk": "Partial response text",
  "done": false
}
```

**notification:new**
```json
{
  "type": "notification:new",
  "notification": {
    "id": "uuid",
    "type": "proactive_reminder",
    "title": "Unread email from Greg",
    "message": "Greg sent an urgent email 3 days ago",
    "createdAt": "2025-12-10T12:00:00Z"
  }
}
```

**email:received**
```json
{
  "type": "email:received",
  "email": {
    "id": "uuid",
    "subject": "New email subject",
    "from": { "email": "sender@example.com" },
    "receivedAt": "2025-12-10T12:00:00Z"
  }
}
```

**tool:execution:start**
```json
{
  "type": "tool:execution:start",
  "messageId": "uuid",
  "toolCall": {
    "id": "call_123",
    "name": "send_email",
    "arguments": { ... }
  }
}
```

**tool:execution:complete**
```json
{
  "type": "tool:execution:complete",
  "messageId": "uuid",
  "toolCallId": "call_123",
  "result": { ... }
}
```

