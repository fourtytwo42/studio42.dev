# AI Microlearning LMS - API Specifications

**Complete API endpoint specifications, request/response formats, authentication, WebSocket events, and error handling.**

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Content Ingestion Endpoints](#content-ingestion-endpoints)
3. [Learning Endpoints](#learning-endpoints)
4. [Narrative Planning Endpoints](#narrative-planning-endpoints)
5. [Admin Endpoints](#admin-endpoints)
6. [Analytics Endpoints](#analytics-endpoints)
7. [WebSocket Events](#websocket-events)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)

## Authentication Endpoints

### POST /api/auth/register

**Description:** Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "organizationName": "Acme Corp" // Optional, creates new org if not provided
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
    "role": "learner",
    "organizationId": "uuid"
  },
  "expiresAt": "2025-12-13T12:00:00Z"
}
```

**Status Codes:**
- `201 Created` - User created successfully
- `400 Bad Request` - Validation error (email format, password strength)
- `409 Conflict` - Email already exists

### POST /api/auth/login

**Description:** Authenticate user with email/password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
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
    "role": "learner",
    "organizationId": "uuid"
  },
  "expiresAt": "2025-12-13T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Authentication successful
- `401 Unauthorized` - Invalid credentials

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

**Status Codes:**
- `200 OK` - Token refreshed
- `401 Unauthorized` - Invalid or expired token

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

## Content Ingestion Endpoints

### POST /api/admin/ingestion/folders

**Description:** Create a new watched folder

**Headers:**
- `Authorization: Bearer <token>`
- Requires: `admin` or `instructor` role

**Request:**
```json
{
  "path": "/path/to/content/folder",
  "fileTypes": ["pdf", "docx", "txt"],
  "recursive": true,
  "autoProcess": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "path": "/path/to/content/folder",
  "enabled": true,
  "fileTypes": ["pdf", "docx", "txt"],
  "recursive": true,
  "autoProcess": true,
  "createdAt": "2025-12-10T12:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Folder created and watching started
- `400 Bad Request` - Invalid path or file types
- `403 Forbidden` - Insufficient permissions

### GET /api/admin/ingestion/folders

**Description:** List all watched folders for organization

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `enabled` (optional): Filter by enabled status

**Response:**
```json
{
  "folders": [
    {
      "id": "uuid",
      "path": "/path/to/folder",
      "enabled": true,
      "fileTypes": ["pdf", "docx"],
      "recursive": true,
      "autoProcess": true,
      "createdAt": "2025-12-10T12:00:00Z"
    }
  ],
  "total": 5
}
```

### PUT /api/admin/ingestion/folders/:id

**Description:** Update watched folder configuration

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "enabled": false,
  "fileTypes": ["pdf"],
  "recursive": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "path": "/path/to/folder",
  "enabled": false,
  "fileTypes": ["pdf"],
  "recursive": false,
  "updatedAt": "2025-12-10T12:00:00Z"
}
```

### DELETE /api/admin/ingestion/folders/:id

**Description:** Delete watched folder and stop watching

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

### POST /api/admin/ingestion/urls

**Description:** Add a monitored URL

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "url": "https://example.com/educational-content",
  "checkInterval": 5
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com/educational-content",
  "enabled": true,
  "checkInterval": 5,
  "createdAt": "2025-12-10T12:00:00Z"
}
```

### GET /api/admin/ingestion/urls

**Description:** List all monitored URLs

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "urls": [
    {
      "id": "uuid",
      "url": "https://example.com/content",
      "enabled": true,
      "checkInterval": 5,
      "lastChecked": "2025-12-10T11:00:00Z",
      "lastModified": "2025-12-10T10:00:00Z"
    }
  ],
  "total": 3
}
```

### DELETE /api/admin/ingestion/urls/:id

**Description:** Remove monitored URL

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

### GET /api/admin/ingestion/jobs

**Description:** List ingestion jobs

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `processing`, `completed`, `failed`)
- `type` (optional): Filter by type (`file`, `url`)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)

**Response:**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "type": "file",
      "source": "/path/to/file.pdf",
      "status": "completed",
      "nuggetCount": 15,
      "startedAt": "2025-12-10T10:00:00Z",
      "completedAt": "2025-12-10T10:05:00Z",
      "createdAt": "2025-12-10T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20
}
```

### GET /api/admin/ingestion/jobs/:id

**Description:** Get ingestion job details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "type": "file",
  "source": "/path/to/file.pdf",
  "status": "completed",
  "metadata": {
    "folderId": "uuid",
    "fileName": "file.pdf",
    "fileSize": 1024000
  },
  "nuggetCount": 15,
  "errorMessage": null,
  "startedAt": "2025-12-10T10:00:00Z",
  "completedAt": "2025-12-10T10:05:00Z",
  "createdAt": "2025-12-10T10:00:00Z",
  "nuggets": [
    {
      "id": "uuid",
      "content": "Preview...",
      "status": "ready"
    }
  ]
}
```

## Learning Endpoints

### POST /api/learning/sessions

**Description:** Create a new learning session

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "mode": "text" // Optional: 'text' | 'voice', default: 'text'
}
```

**Response:**
```json
{
  "id": "uuid",
  "learnerId": "uuid",
  "currentNodeId": null,
  "mode": "text",
  "startedAt": "2025-12-10T12:00:00Z",
  "lastActivity": "2025-12-10T12:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Session created
- `401 Unauthorized` - Not authenticated

### GET /api/learning/sessions

**Description:** List learner's sessions

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `active` (optional): Filter active sessions only
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "currentNodeId": "uuid",
      "mode": "text",
      "startedAt": "2025-12-10T12:00:00Z",
      "lastActivity": "2025-12-10T12:30:00Z",
      "completedAt": null
    }
  ],
  "total": 10
}
```

### GET /api/learning/sessions/:id

**Description:** Get session details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "learnerId": "uuid",
  "currentNodeId": "uuid",
  "pathHistory": ["node-id-1", "node-id-2"],
  "mode": "text",
  "startedAt": "2025-12-10T12:00:00Z",
  "lastActivity": "2025-12-10T12:30:00Z",
  "currentNode": {
    "id": "uuid",
    "nugget": {
      "id": "uuid",
      "content": "Learning content...",
      "imageUrl": "/api/files/nugget-123/image.png",
      "audioUrl": "/api/files/nugget-123/audio.mp3"
    },
    "choices": [
      {
        "id": "choice-1",
        "text": "I want to learn more about X",
        "nextNodeId": "uuid"
      }
    ]
  }
}
```

### POST /api/learning/sessions/:id/messages

**Description:** Send message to AI tutor

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "content": "Hello, I'd like to learn about machine learning",
  "mode": "text" // Optional: 'text' | 'voice'
}
```

**Response:**
```json
{
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "Great! Let's explore machine learning together...",
    "toolCalls": [
      {
        "id": "call-123",
        "name": "deliver_nugget",
        "arguments": {
          "nuggetId": "uuid",
          "format": "multimedia"
        }
      }
    ],
    "toolResults": [
      {
        "toolCallId": "call-123",
        "toolName": "deliver_nugget",
        "result": {
          "success": true,
          "nugget": {
            "id": "uuid",
            "content": "Machine learning is...",
            "imageUrl": "/api/files/nugget-123/image.png"
          }
        }
      }
    ],
    "media": [
      {
        "type": "image",
        "url": "/api/files/nugget-123/image.png",
        "caption": "Machine learning illustration"
      }
    ],
    "createdAt": "2025-12-10T12:00:05Z"
  },
  "nextNode": {
    "id": "uuid",
    "choices": [...]
  }
}
```

**Status Codes:**
- `200 OK` - Message processed
- `400 Bad Request` - Invalid message
- `404 Not Found` - Session not found

### GET /api/learning/sessions/:id/messages

**Description:** Get conversation history

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50, max: 100)
- `before` (optional): Get messages before this timestamp

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Hello",
      "createdAt": "2025-12-10T12:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Hi! How can I help you learn today?",
      "toolCalls": null,
      "createdAt": "2025-12-10T12:00:01Z"
    }
  ],
  "total": 25
}
```

### POST /api/learning/sessions/:id/choices

**Description:** Make a narrative choice

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "choiceId": "choice-123"
}
```

**Response:**
```json
{
  "nextNode": {
    "id": "uuid",
    "nugget": {
      "id": "uuid",
      "content": "New learning content...",
      "imageUrl": "/api/files/nugget-456/image.png"
    },
    "choices": [
      {
        "id": "choice-456",
        "text": "Continue learning",
        "nextNodeId": "uuid"
      }
    ]
  },
  "masteryUpdates": [
    {
      "concept": "machine-learning-basics",
      "masteryLevel": 65,
      "evidence": "Correctly explained supervised learning"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Choice processed, next node returned
- `400 Bad Request` - Invalid choice
- `404 Not Found` - Session or choice not found

### GET /api/learning/sessions/:id/progress

**Description:** Get learner progress for session

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "concepts": [
    {
      "concept": "machine-learning-basics",
      "masteryLevel": 65,
      "lastUpdated": "2025-12-10T12:15:00Z",
      "evidence": "Correctly explained supervised learning"
    }
  ],
  "knowledgeGaps": [
    "neural-networks",
    "deep-learning"
  ],
  "pathHistory": ["node-1", "node-2", "node-3"],
  "sessionDuration": 1800, // seconds
  "nuggetsViewed": 5
}
```

### POST /api/learning/sessions/:id/complete

**Description:** Mark session as completed

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "uuid",
    "completedAt": "2025-12-10T12:30:00Z"
  }
}
```

## Narrative Planning Endpoints

### GET /api/narrative/nodes/:id

**Description:** Get narrative node details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "nugget": {
    "id": "uuid",
    "content": "Learning content...",
    "metadata": {
      "topics": ["machine-learning"],
      "difficulty": 5,
      "estimatedTime": 10
    },
    "imageUrl": "/api/files/nugget-123/image.png",
    "audioUrl": "/api/files/nugget-123/audio.mp3"
  },
  "choices": [
    {
      "id": "choice-1",
      "text": "I want to learn more about neural networks",
      "nextNodeId": "uuid",
      "revealsGap": ["neural-networks"],
      "confirmsMastery": []
    }
  ],
  "prerequisites": ["machine-learning-basics"],
  "adaptsTo": ["neural-networks"]
}
```

## Admin Endpoints

### GET /api/admin/nuggets

**Description:** List all nuggets (paginated)

**Headers:**
- `Authorization: Bearer <token>`
- Requires: `admin` or `instructor` role

**Query Parameters:**
- `status` (optional): Filter by status
- `search` (optional): Search in content
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Response:**
```json
{
  "nuggets": [
    {
      "id": "uuid",
      "content": "Preview of content...",
      "metadata": {
        "topics": ["machine-learning"],
        "difficulty": 5,
        "estimatedTime": 10
      },
      "status": "ready",
      "createdAt": "2025-12-10T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 20
}
```

### GET /api/admin/nuggets/:id

**Description:** Get nugget details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "content": "Full content...",
  "metadata": {
    "topics": ["machine-learning"],
    "difficulty": 5,
    "prerequisites": ["python-basics"],
    "estimatedTime": 10,
    "relatedConcepts": ["neural-networks", "deep-learning"]
  },
  "imageUrl": "/api/files/nugget-123/image.png",
  "audioUrl": "/api/files/nugget-123/audio.mp3",
  "status": "ready",
  "sources": [
    {
      "type": "file",
      "path": "/path/to/source.pdf"
    }
  ],
  "createdAt": "2025-12-10T10:00:00Z",
  "updatedAt": "2025-12-10T10:05:00Z"
}
```

### PUT /api/admin/nuggets/:id

**Description:** Update nugget (content or metadata)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "content": "Updated content...",
  "metadata": {
    "difficulty": 6
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "content": "Updated content...",
  "metadata": {
    "difficulty": 6
  },
  "updatedAt": "2025-12-10T12:00:00Z"
}
```

### DELETE /api/admin/nuggets/:id

**Description:** Delete nugget

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

### POST /api/admin/nuggets/:id/regenerate

**Description:** Regenerate nugget (image, audio, or content)

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
  "regenerateImage": true,
  "regenerateAudio": true,
  "regenerateContent": false
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "uuid" // Background job ID
}
```

### GET /api/admin/learners

**Description:** List all learners

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional): Search by name or email
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Response:**
```json
{
  "learners": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "profile": {
        "interests": ["machine-learning"],
        "goals": "Learn AI fundamentals"
      },
      "masteryMap": {
        "machine-learning-basics": 65
      },
      "knowledgeGaps": ["neural-networks"]
    }
  ],
  "total": 50
}
```

### GET /api/admin/learners/:id

**Description:** Get learner details

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "profile": {
    "interests": ["machine-learning"],
    "goals": "Learn AI fundamentals",
    "learningStyle": "visual"
  },
  "masteryMap": {
    "machine-learning-basics": 65,
    "python-basics": 80
  },
  "knowledgeGaps": ["neural-networks", "deep-learning"],
  "sessions": [
    {
      "id": "uuid",
      "startedAt": "2025-12-10T12:00:00Z",
      "lastActivity": "2025-12-10T12:30:00Z"
    }
  ],
  "progress": [
    {
      "concept": "machine-learning-basics",
      "masteryLevel": 65,
      "evidence": "Correctly explained supervised learning",
      "updatedAt": "2025-12-10T12:15:00Z"
    }
  ]
}
```

### GET /api/admin/settings

**Description:** Get system settings

**Headers:**
- `Authorization: Bearer <token>`
- Requires: `admin` role

**Response:**
```json
{
  "voice": {
    "ttsProvider": "openai-standard",
    "ttsModel": "tts-1",
    "ttsVoice": "alloy",
    "sttProvider": "openai-whisper",
    "sttModel": "whisper-1",
    "qualityTier": "low"
  },
  "aiModels": {
    "contentGenerationModel": "gpt-5.1-mini",
    "narrativePlanningModel": "gpt-5.1-mini",
    "tutoringModel": "gpt-5.1-mini",
    "metadataModel": "gpt-5.1-nano",
    "embeddingModel": "text-embedding-3-small",
    "contentGenerationTemp": 0.7,
    "narrativePlanningTemp": 0.8,
    "tutoringTemp": 0.7
  },
  "contentProcessing": {
    "chunking": {
      "maxTokens": 2000,
      "overlapPercent": 15
    },
    "imageGeneration": {
      "model": "dall-e-3",
      "size": "1024x1024",
      "quality": "standard"
    }
  }
}
```

### PUT /api/admin/settings

**Description:** Update system settings

**Headers:**
- `Authorization: Bearer <token>`
- Requires: `admin` role

**Request:**
```json
{
  "voice": {
    "ttsProvider": "openai-hd",
    "qualityTier": "mid"
  },
  "aiModels": {
    "tutoringModel": "gpt-5.1-mini",
    "tutoringTemp": 0.8
  }
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    // Updated settings
  }
}
```

### GET /api/admin/analytics

**Description:** Get system analytics

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` (default: `week`)

**Response:**
```json
{
  "learners": {
    "total": 100,
    "active": 75, // Active in last 7 days
    "new": 10 // New in period
  },
  "sessions": {
    "total": 500,
    "averageDuration": 25, // minutes
    "completed": 450,
    "active": 50
  },
  "nuggets": {
    "total": 1000,
    "byStatus": {
      "ready": 950,
      "processing": 30,
      "failed": 20
    }
  },
  "engagement": {
    "averageSessionsPerLearner": 5,
    "averageNuggetsPerSession": 8,
    "averageSessionDuration": 25
  },
  "costs": {
    "total": 150.50,
    "byService": {
      "ai": 100.00,
      "voice": 45.50,
      "images": 5.00
    },
    "perLearner": 1.51
  }
}
```

## Analytics Endpoints

### GET /api/analytics/events

**Description:** Get analytics events (admin only)

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `eventType` (optional): Filter by event type
- `learnerId` (optional): Filter by learner
- `startDate` (optional): ISO 8601 date
- `endDate` (optional): ISO 8601 date
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "eventType": "nugget_delivered",
      "eventData": {
        "nuggetId": "uuid",
        "format": "multimedia"
      },
      "timestamp": "2025-12-10T12:00:00Z"
    }
  ],
  "total": 1000
}
```

## WebSocket Events

### Connection

**URL:** `ws://yourdomain.com/api/ws`

**Authentication:**
- Include JWT token in query string: `?token=<jwt-token>`
- Or send authentication message after connection

### Client → Server Events

#### session:join
```json
{
  "event": "session:join",
  "data": {
    "sessionId": "uuid"
  }
}
```

#### session:message
```json
{
  "event": "session:message",
  "data": {
    "content": "Hello, I'd like to learn about X",
    "mode": "text"
  }
}
```

#### session:choice
```json
{
  "event": "session:choice",
  "data": {
    "choiceId": "choice-123"
  }
}
```

#### session:voice:start
```json
{
  "event": "session:voice:start",
  "data": {}
}
```

#### session:voice:data
```json
{
  "event": "session:voice:data",
  "data": {
    "audio": "base64-encoded-audio-data"
  }
}
```

#### session:voice:stop
```json
{
  "event": "session:voice:stop",
  "data": {}
}
```

### Server → Client Events

#### session:joined
```json
{
  "event": "session:joined",
  "data": {
    "sessionId": "uuid",
    "currentNode": {
      "id": "uuid",
      "nugget": {...},
      "choices": [...]
    }
  }
}
```

#### session:message
```json
{
  "event": "session:message",
  "data": {
    "id": "uuid",
    "role": "assistant",
    "content": "AI tutor response...",
    "toolCalls": [...],
    "media": [...],
    "createdAt": "2025-12-10T12:00:05Z"
  }
}
```

#### session:node:updated
```json
{
  "event": "session:node:updated",
  "data": {
    "nodeId": "uuid",
    "node": {
      "id": "uuid",
      "nugget": {...},
      "choices": [...]
    }
  }
}
```

#### session:progress:updated
```json
{
  "event": "session:progress:updated",
  "data": {
    "concepts": [
      {
        "concept": "machine-learning-basics",
        "masteryLevel": 65
      }
    ],
    "knowledgeGaps": ["neural-networks"]
  }
}
```

#### session:media:show
```json
{
  "event": "session:media:show",
  "data": {
    "type": "image",
    "url": "/api/files/nugget-123/image.png",
    "caption": "Machine learning illustration"
  }
}
```

#### ingestion:job:updated
```json
{
  "event": "ingestion:job:updated",
  "data": {
    "jobId": "uuid",
    "status": "processing",
    "progress": 45, // percentage
    "nuggetCount": 10
  }
}
```

#### error
```json
{
  "event": "error",
  "data": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": true,
  "errorType": "validation_error" | "authentication_error" | "authorization_error" | "not_found" | "rate_limit" | "server_error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

### Error Types

**validation_error (400):**
```json
{
  "error": true,
  "errorType": "validation_error",
  "message": "Invalid input",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**authentication_error (401):**
```json
{
  "error": true,
  "errorType": "authentication_error",
  "message": "Invalid or expired token",
  "code": "AUTH_ERROR"
}
```

**authorization_error (403):**
```json
{
  "error": true,
  "errorType": "authorization_error",
  "message": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

**not_found (404):**
```json
{
  "error": true,
  "errorType": "not_found",
  "message": "Resource not found",
  "code": "NOT_FOUND",
  "details": {
    "resource": "session",
    "id": "uuid"
  }
}
```

**rate_limit (429):**
```json
{
  "error": true,
  "errorType": "rate_limit",
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT",
  "details": {
    "limit": 100,
    "remaining": 0,
    "resetAt": "2025-12-10T13:00:00Z"
  }
}
```

**server_error (500):**
```json
{
  "error": true,
  "errorType": "server_error",
  "message": "An internal error occurred",
  "code": "INTERNAL_ERROR"
}
```

**service_unavailable (503):**
```json
{
  "error": true,
  "errorType": "service_unavailable",
  "message": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "details": {
    "retryAfter": 60, // seconds
    "reason": "Database connection lost"
  }
}
```

**timeout (504):**
```json
{
  "error": true,
  "errorType": "timeout",
  "message": "Request timeout",
  "code": "TIMEOUT",
  "details": {
    "timeout": 30000, // milliseconds
    "operation": "AI API call"
  }
}
```

### Error Recovery Strategies

**Client-Side Retry Logic:**
- **Transient Errors (500, 503, 504):** Retry with exponential backoff
  - Initial delay: 1 second
  - Max retries: 3
  - Max delay: 10 seconds
- **Rate Limit (429):** Retry after `retryAfter` seconds
- **Network Errors:** Retry with exponential backoff
- **Permanent Errors (400, 401, 403, 404):** Don't retry, show error to user

**Server-Side Retry Logic:**
- **External API Calls:** Retry with exponential backoff (3 attempts)
- **Database Queries:** Retry once on connection error
- **File Operations:** Retry on temporary failures (3 attempts)
- **Job Processing:** Automatic retry via BullMQ (configurable attempts)

### Error Logging

**Error Log Format:**
```json
{
  "timestamp": "2025-12-10T12:00:00Z",
  "level": "error",
  "errorType": "server_error",
  "code": "INTERNAL_ERROR",
  "message": "Database connection failed",
  "userId": "uuid",
  "organizationId": "uuid",
  "requestId": "uuid",
  "endpoint": "/api/learning/sessions",
  "method": "POST",
  "stack": "Error stack trace...",
  "context": {
    "sessionId": "uuid",
    "additional": "context"
  }
}
```

**Error Monitoring:**
- All errors logged to structured logs (Winston)
- Critical errors sent to monitoring service (Sentry, etc.)
- Error rate alerts (threshold: 5% error rate)
- Error trend analysis (daily/weekly reports)

## Rate Limiting

### Rate Limit Headers

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702224000
```

### Rate Limit Configuration

**Default Limits:**
- **API Endpoints:** 100 requests per minute per user
- **WebSocket Messages:** 60 messages per minute per connection
- **File Uploads:** 10 uploads per minute per user
- **AI API Calls:** 50 calls per minute per organization

**Rate Limit Implementation:**
```typescript
// src/lib/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
```

---

This API specification provides complete details for all endpoints, WebSocket events, error handling, and rate limiting. All endpoints require authentication unless otherwise specified.

