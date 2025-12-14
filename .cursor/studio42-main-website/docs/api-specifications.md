# API Specifications

Complete API endpoint documentation for Studio42.dev main website.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://studio42.dev`

## Authentication

### Admin Authentication

Admin endpoints require authentication via session cookie (NextAuth.js or similar).

**Headers:**
```
Cookie: next-auth.session-token=<session-token>
```

## API Endpoints

### Products

#### GET /api/products

Get all products for homepage grid.

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "slug": "lms",
      "name": "AI Microlearning LMS",
      "tagline": "Intelligent learning management system",
      "description": "Full description...",
      "status": "AVAILABLE",
      "thumbnail": "https://...",
      "githubUrl": "https://github.com/...",
      "youtubeUrl": "https://youtube.com/...",
      "demoUrl": "https://lms.studio42.dev",
      "pricing": "Starting at $X/month",
      "features": [
        {
          "title": "AI-Powered",
          "description": "Intelligent content recommendations"
        }
      ],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

#### GET /api/products/[slug]

Get single product by slug.

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "slug": "lms",
    "name": "AI Microlearning LMS",
    "tagline": "Intelligent learning management system",
    "description": "Full description...",
    "status": "AVAILABLE",
    "thumbnail": "https://...",
    "githubUrl": "https://github.com/...",
    "youtubeUrl": "https://youtube.com/...",
    "demoUrl": "https://lms.studio42.dev",
    "pricing": "Starting at $X/month",
    "features": [...],
    "media": [
      {
        "id": "uuid",
        "type": "VIDEO",
        "url": "https://youtube.com/embed/...",
        "title": "Product Demo",
        "order": 0
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Product not found
- `500` - Server error

### Contacts

#### POST /api/contacts

Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1234567890",
  "product": "lms",
  "inquiryType": "REQUEST_DEMO",
  "message": "I'm interested in a demo...",
  "preferredMethod": "EMAIL",
  "source": "lms.studio42.dev"
}
```

**Validation:**
- `name`: Required, string, max 255 chars
- `email`: Required, valid email format
- `company`: Optional, string, max 255 chars
- `phone`: Optional, string, max 50 chars
- `product`: Optional, string (must match existing product slug)
- `inquiryType`: Required, one of: REQUEST_DEMO, CONTACT_SALES, GENERAL_INQUIRY, TECHNICAL_SUPPORT, OTHER
- `message`: Required, string, max 5000 chars
- `preferredMethod`: Required, one of: EMAIL, PHONE, EITHER
- `source`: Optional, string

**Response:**
```json
{
  "success": true,
  "contactId": "uuid",
  "message": "Contact submitted successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `500` - Server error

**Email Notifications:**
- If email is enabled, sends confirmation to user
- If email is enabled, sends notification to admin

### Admin - Contacts

#### GET /api/admin/contacts

Get all contacts (admin only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `read`: Filter by read status (true/false)
- `product`: Filter by product slug
- `search`: Search by name or email

**Response:**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Corp",
      "phone": "+1234567890",
      "product": "lms",
      "inquiryType": "REQUEST_DEMO",
      "message": "I'm interested in a demo...",
      "preferredMethod": "EMAIL",
      "source": "lms.studio42.dev",
      "createdAt": "2025-01-01T00:00:00Z",
      "read": false,
      "responded": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

#### PATCH /api/admin/contacts/[id]

Update contact (mark as read, responded, etc.).

**Request Body:**
```json
{
  "read": true,
  "responded": true
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "uuid",
    "read": true,
    "responded": true,
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Contact not found
- `500` - Server error

### Admin - Email Configuration

#### GET /api/admin/email-config

Get email configuration (admin only).

**Response:**
```json
{
  "config": {
    "id": "uuid",
    "enabled": true,
    "smtpHost": "smtp.example.com",
    "smtpPort": 587,
    "smtpUser": "user@example.com",
    "smtpSecure": true,
    "fromEmail": "noreply@studio42.dev",
    "fromName": "Studio42",
    "adminEmail": "admin@studio42.dev",
    "confirmationTemplate": "Email template...",
    "notificationTemplate": "Email template...",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

**Note:** `smtpPassword` is never returned in response.

#### PUT /api/admin/email-config

Update email configuration (admin only).

**Request Body:**
```json
{
  "enabled": true,
  "smtpHost": "smtp.example.com",
  "smtpPort": 587,
  "smtpUser": "user@example.com",
  "smtpPassword": "password",
  "smtpSecure": true,
  "fromEmail": "noreply@studio42.dev",
  "fromName": "Studio42",
  "adminEmail": "admin@studio42.dev",
  "confirmationTemplate": "Email template...",
  "notificationTemplate": "Email template..."
}
```

**Validation:**
- If `enabled` is true, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPassword`, `fromEmail`, `adminEmail` are required
- `smtpPort`: Must be valid port number (1-65535)
- `fromEmail`, `adminEmail`: Must be valid email format

**Response:**
```json
{
  "success": true,
  "config": {
    "id": "uuid",
    "enabled": true,
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

**Note:** `smtpPassword` should be encrypted before storing.

### AI Assistant

#### POST /api/ai/chat

Send message to AI assistant.

**Request Body:**
```json
{
  "message": "What features does the LMS have?",
  "conversationId": "optional-conversation-id",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "The LMS has the following features...",
  "conversationId": "conversation-id",
  "toolCalls": [
    {
      "type": "submit_contact_form",
      "parameters": {
        "name": "John Doe",
        "email": "john@example.com",
        ...
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `500` - Server error
- `503` - Groq API unavailable

**Tool Calls:**
The AI can make tool calls for:
- `search_knowledge_base`: Search knowledge base semantically
- `submit_contact_form`: Submit contact form on behalf of user

#### POST /api/ai/chat/tools/submit-contact

Submit contact form via AI tool call.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "product": "lms",
  "inquiryType": "REQUEST_DEMO",
  "message": "AI collected this information..."
}
```

**Response:**
```json
{
  "success": true,
  "contactId": "uuid",
  "message": "Contact form submitted successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `500` - Server error

### Admin - Authentication

#### POST /api/admin/auth/login

Admin login.

**Request Body:**
```json
{
  "email": "admin@studio42.dev",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "token": "session-token",
    "admin": {
      "id": "uuid",
      "email": "admin@studio42.dev",
      "name": "Admin Name"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `500` - Server error

#### POST /api/admin/auth/logout

Admin logout.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

#### GET /api/admin/auth/me

Get current admin user.

**Response:**
```json
{
  "admin": {
    "id": "uuid",
    "email": "admin@studio42.dev",
    "name": "Admin Name",
    "lastLogin": "2025-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Validation error for specific field"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error
- `EXTERNAL_API_ERROR` - External API (Groq) error

## Rate Limiting

- **Contact Form:** 5 submissions per hour per IP
- **AI Chat:** 20 requests per minute per IP
- **Admin API:** No rate limiting (protected by authentication)

## CORS

- **Allowed Origins:** Same origin only (no CORS needed for same-domain requests)
- **Credentials:** Include cookies for authenticated requests

