# AI Assistant Integration

Complete specification for the Groq AI assistant with semantic search capabilities.

## Overview

The AI assistant is a floating chat widget that provides intelligent responses about all products and services. It uses Groq API with OpenAI-compatible tool calling and semantic search via pgvector.

## Groq API Integration

### Model Selection

**Primary Model:** Research exact Groq model name (user mentioned "gpt oss 20b")

**Model Requirements:**
- OpenAI-compatible API format
- Tool calling support
- Fast inference (Groq's main advantage)
- Good performance for Q&A tasks

**API Endpoint:**
- Base URL: `https://api.groq.com/openai/v1`
- Chat endpoint: `/chat/completions`

### API Configuration

**Headers:**
```
Authorization: Bearer {GROQ_API_KEY}
Content-Type: application/json
```

**Request Format:**
```json
{
  "model": "model-name",
  "messages": [
    {
      "role": "system",
      "content": "System prompt..."
    },
    {
      "role": "user",
      "content": "User message..."
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_knowledge_base",
        "description": "Search the knowledge base for information",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            }
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "submit_contact_form",
        "description": "Submit a contact form on behalf of the user",
        "parameters": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "product": {"type": "string"},
            "inquiryType": {"type": "string"},
            "message": {"type": "string"}
          },
          "required": ["name", "email", "message"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

## System Prompt

The AI assistant should have a system prompt that includes:

1. **Role Definition:**
   - You are a helpful assistant for Studio42.dev
   - You help users learn about SaaS products and services

2. **Capabilities:**
   - Answer questions about products, features, pricing
   - Search knowledge base for detailed information
   - Help users submit contact forms
   - Provide links to demos, GitHub, YouTube

3. **Instructions:**
   - Be friendly and professional
   - Use search tools when you need more information
   - Ask clarifying questions if needed
   - Guide users to contact form if they want to request demos

4. **Knowledge Base:**
   - You have access to a searchable knowledge base
   - Use `search_knowledge_base` tool when you need specific information
   - The knowledge base contains information about all products

**Example System Prompt:**
```
You are a helpful AI assistant for Studio42.dev, a company that offers multiple SaaS products.

Your role is to:
- Answer questions about our products, features, pricing, and services
- Help users find information using the searchable knowledge base
- Assist users in submitting contact forms for demos or sales inquiries
- Provide links to product demos, GitHub repositories, and YouTube channels

When you need specific information, use the search_knowledge_base tool to find relevant content.

Be friendly, professional, and helpful. If a user wants to request a demo or contact sales, guide them through the contact form submission process.
```

## Semantic Search

### Knowledge Base Structure

The knowledge base is stored in PostgreSQL with pgvector for semantic search.

**Table:** `knowledge_base`
- `id`: UUID
- `title`: String
- `content`: Text (full content)
- `category`: String (product, feature, faq, general)
- `productSlug`: String (optional, for product-specific content)
- `embedding`: Vector(1536) - OpenAI-compatible embeddings

### Embedding Generation

**Model:** OpenAI `text-embedding-3-small` or similar (1536 dimensions)

**Process:**
1. When adding knowledge base entry:
   - Generate embedding from `title + content`
   - Store embedding in database
   - Create/update vector index

2. When searching:
   - Generate embedding from user query
   - Perform cosine similarity search
   - Return top N results

### Search Implementation

**Tool: `search_knowledge_base`**

**Parameters:**
- `query`: User's search query (string, required, min 3 characters)

**Process:**
1. **Generate Embedding:**
   ```typescript
   async function generateEmbedding(text: string): Promise<number[]> {
     const response = await fetch('https://api.openai.com/v1/embeddings', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         model: 'text-embedding-3-small',
         input: text,
       }),
     });
     
     const data = await response.json();
     return data.data[0].embedding; // 1536 dimensions
   }
   ```

2. **Perform Vector Similarity Search:**
   ```sql
   -- Using cosine distance (<=> operator)
   SELECT 
     id, 
     title, 
     content, 
     category,
     product_slug,
     1 - (embedding <=> $1::vector) as similarity
   FROM knowledge_base
   WHERE 1 - (embedding <=> $1::vector) > 0.7  -- Similarity threshold (0.7 = 70%)
   ORDER BY embedding <=> $1::vector
   LIMIT 5;
   ```
   
   **Parameters:**
   - `$1`: Query embedding vector (1536 dimensions)
   - Similarity threshold: 0.7 (70% similarity minimum)
   - Results limit: 5 entries

3. **Format Results:**
   ```typescript
   interface SearchResult {
     id: string;
     title: string;
     content: string;
     category: string;
     productSlug: string | null;
     similarity: number;
   }
   
   function formatResults(results: SearchResult[]): string {
     if (results.length === 0) {
       return 'No relevant information found in the knowledge base.';
     }
     
     return results
       .map((result, index) => {
         return `[${index + 1}] ${result.title}\n${result.content.substring(0, 500)}${result.content.length > 500 ? '...' : ''}\n(Similarity: ${(result.similarity * 100).toFixed(1)}%)`;
       })
       .join('\n\n');
   }
   ```

4. **Return to AI:**
   - Format results as context string
   - Include similarity scores
   - Limit content length (500 chars per result)

**Response Format:**
```json
{
  "results": [
    {
      "id": "uuid",
      "title": "LMS Features",
      "content": "The LMS includes AI-powered content recommendations, microlearning modules, progress tracking, and analytics dashboards...",
      "category": "product",
      "productSlug": "lms",
      "similarity": 0.95
    },
    {
      "id": "uuid",
      "title": "LMS Pricing",
      "content": "The LMS is available starting at $99/month for up to 100 users...",
      "category": "pricing",
      "productSlug": "lms",
      "similarity": 0.87
    }
  ],
  "formattedContext": "[1] LMS Features\nThe LMS includes AI-powered content recommendations...\n(Similarity: 95.0%)\n\n[2] LMS Pricing\nThe LMS is available starting at $99/month...\n(Similarity: 87.0%)"
}
```

**Error Handling:**
- If embedding generation fails: Return error to AI
- If no results found: Return empty results array
- If database error: Log error, return generic message to AI

## Tool Calling

### Available Tools

#### 1. search_knowledge_base

**Purpose:** Search knowledge base for information

**When to Use:**
- User asks about products, features, pricing
- AI needs specific information not in system prompt
- User asks detailed questions

**Parameters:**
- `query`: Search query string

**Response:**
- Returns relevant knowledge base entries
- AI uses this information to answer user

#### 2. submit_contact_form

**Purpose:** Submit contact form on behalf of user

**When to Use:**
- User wants to request a demo
- User wants to contact sales
- User provides contact information

**Parameters:**
- `name`: User's name (required)
- `email`: User's email (required)
- `product`: Product slug (optional)
- `inquiryType`: Type of inquiry (optional, default: "GENERAL_INQUIRY")
- `message`: Message content (required)

**Process:**
1. AI collects information from user conversation
2. AI calls tool with collected information
3. Backend validates and submits form
4. Returns success/failure to AI
5. AI informs user of result

**Example Flow:**
```
User: "I'd like to request a demo of the LMS"
AI: "I'd be happy to help! What's your name and email?"
User: "John Doe, john@example.com"
AI: [Calls submit_contact_form tool]
AI: "Great! I've submitted your demo request. You'll receive a confirmation email shortly."
```

## Chat Widget UI

### Floating Widget

**Position:** 
- Fixed position: Bottom-right corner
- Distance from edges: 24px from bottom, 24px from right
- Z-index: 9999 (above all other content)
- Mobile: 16px from edges

**Widget States:**
- **Minimized:** 
  - Size: 64px × 64px (circular button)
  - Icon: Chat bubble icon
  - Background: Brand primary color (`#6366f1`)
  - Shadow: `0 4px 12px rgba(0,0,0,0.15)`
  - Hover: Scale 1.1x, shadow `0 6px 16px rgba(0,0,0,0.2)`
- **Maximized:**
  - Size: 400px width × 600px height (desktop)
  - Size: 100% width × 100% height (mobile, full screen)
  - Border-radius: 16px (top corners), 0 (bottom corners on mobile)
  - Shadow: `0 8px 24px rgba(0,0,0,0.2)`
  - Background: White
  - Border: 1px solid `#e5e7eb` (optional)

**Features:**
- Minimize/Maximize toggle button
- Chat history with scroll
- Message input with send button
- Loading indicator (animated spinner)
- Error messages with retry button
- Smooth open/close animations (300ms ease)

### Chat Interface

**Components:**

1. **Header:**
   - **Height:** 64px
   - **Background:** Brand primary color (`#6366f1`) or white with border-bottom
   - **Padding:** 16px 20px
   - **Content:**
     - **Title:** "AI Assistant"
       - Typography: 18px, 600 weight, white (if colored bg) or primary text
       - Left-aligned
     - **Minimize Button:**
       - Position: Right side
       - Size: 32px × 32px
       - Icon: Chevron down (minimized) or X (maximized)
       - Background: Transparent or white with 20% opacity
       - Hover: Background white with 30% opacity
       - Border-radius: 50%
   - **Border-bottom:** 1px solid `#e5e7eb` (if white background)

2. **Messages Area:**
   - **Height:** Calc(100% - 64px header - 80px input area)
   - **Padding:** 20px
   - **Overflow:** Auto (scrollable)
   - **Background:** White or `#f9fafb`
   - **Message Styling:**
     - **User Messages:**
       - Alignment: Right
       - Background: Brand primary color (`#6366f1`)
       - Text: White, 15px, 400 weight
       - Padding: 12px 16px
       - Border-radius: 16px 16px 4px 16px
       - Max-width: 75% of container
       - Margin: 0 0 12px auto
     - **AI Messages:**
       - Alignment: Left
       - Background: `#f3f4f6`
       - Text: Primary text (`#111827`), 15px, 400 weight
       - Padding: 12px 16px
       - Border-radius: 16px 16px 16px 4px
       - Max-width: 75% of container
       - Margin: 0 auto 12px 0
     - **Timestamps:**
       - Typography: 11px, 400 weight, color `#9ca3af`
       - Position: Below message, aligned with message
       - Margin: 4px 0 0 0
   - **Tool Call Indicators:**
     - Small badge: "Searching..." or "Submitting..."
     - Typography: 12px, 500 weight, color `#6366f1`
     - Icon: Spinner or search icon
     - Position: Below AI message or inline

3. **Input Area:**
   - **Height:** 80px
   - **Padding:** 16px 20px
   - **Background:** White
   - **Border-top:** 1px solid `#e5e7eb`
   - **Layout:** Flexbox, gap 12px
   - **Text Input:**
     - Flex: 1 (takes remaining space)
     - Padding: 12px 16px
     - Border: 1px solid `#d1d5db`
     - Border-radius: 24px
     - Font: 15px, 400 weight
     - Max-height: 120px (multi-line)
     - Resize: None
     - Focus: Border `#6366f1`, outline 2px solid `#6366f1` with 20% opacity
   - **Send Button:**
     - Size: 48px × 48px (circular)
     - Background: Brand primary color (`#6366f1`)
     - Icon: Send icon (24px, white)
     - Border-radius: 50%
     - Disabled: Opacity 0.5
     - Hover: Darken 10%, scale 1.05x
     - Active: Scale 0.95x
   - **Character Counter (optional):**
     - Position: Bottom-right of input
     - Typography: 12px, 400 weight, color `#9ca3af`
     - Show when approaching limit (e.g., > 1000 characters)

4. **States:**
   - **Initial:**
     - Show welcome message
     - Input enabled
   - **Loading:**
     - Show typing indicator (animated dots)
     - Disable input and send button
     - Show "AI is thinking..." message
   - **Error:**
     - Show error message in red
     - Show retry button
     - Re-enable input
   - **Success:**
     - Normal chat flow
     - Scroll to bottom on new message

### Welcome Message

**Initial Message:**
```
Hi! I'm the Studio42 AI assistant. I can help you learn about our products, answer questions, and even help you request a demo. What would you like to know?
```

**Styling:**
- Same as AI message styling
- Show immediately on widget open
- Typography: 15px, 400 weight
- Background: `#f3f4f6`
- Padding: 12px 16px
- Border-radius: 16px 16px 16px 4px

## Knowledge Base Population

### Content Types

1. **Product Information:**
   - Product descriptions
   - Feature lists
   - Pricing information
   - Use cases

2. **FAQ:**
   - Common questions
   - Troubleshooting
   - Setup guides

3. **General:**
   - Company information
   - Contact information
   - Support resources

### Population Strategy

**Initial Population:**
- Extract all product information from database
- Create knowledge base entries for each product
- Add common FAQs
- Add company information

**Ongoing Updates:**
- Admin interface for adding/editing entries
- Automatic updates when products change (optional)
- Manual curation for quality

### Embedding Generation

**Process:**
1. For each knowledge base entry:
   - Combine `title + content`
   - Generate embedding using OpenAI API
   - Store in database

2. **Batch Processing:**
   - Script to generate embeddings for all entries
   - Update existing entries when content changes

## API Implementation

### POST /api/ai/chat

**Request:**
```json
{
  "message": "What features does the LMS have?",
  "conversationId": "optional-id",
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

**Complete Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { generateEmbedding } from '@/lib/embeddings';
import { prisma } from '@/lib/prisma';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for Studio42.dev, a company that offers multiple SaaS products.

Your role is to:
- Answer questions about our products, features, pricing, and services
- Help users find information using the searchable knowledge base
- Assist users in submitting contact forms for demos or sales inquiries
- Provide links to product demos, GitHub repositories, and YouTube channels

When you need specific information, use the search_knowledge_base tool to find relevant content.

Be friendly, professional, and helpful. If a user wants to request a demo or contact sales, guide them through the contact form submission process.`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { message, conversationId, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate embedding for semantic search
    const queryEmbedding = await generateEmbedding(message);
    
    // Perform semantic search
    const searchResults = await prisma.$queryRaw<Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      product_slug: string | null;
      similarity: number;
    }>>`
      SELECT 
        id, 
        title, 
        content, 
        category,
        product_slug,
        1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM knowledge_base
      WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.7
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT 5
    `;

    // Format search results as context
    const context = searchResults.length > 0
      ? searchResults
          .map((r, i) => `[${i + 1}] ${r.title}\n${r.content.substring(0, 500)}${r.content.length > 500 ? '...' : ''}`)
          .join('\n\n')
      : 'No relevant information found in knowledge base.';

    // Build messages array
    const messages = [
      {
        role: 'system' as const,
        content: `${SYSTEM_PROMPT}\n\nKnowledge Base Context:\n${context}`,
      },
      ...history,
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'gpt-4o-mini', // Replace with actual Groq model name
      messages: messages as any,
      tools: [
        {
          type: 'function',
          function: {
            name: 'search_knowledge_base',
            description: 'Search the knowledge base for information',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
              },
              required: ['query'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'submit_contact_form',
            description: 'Submit a contact form on behalf of the user',
            parameters: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                product: { type: 'string' },
                inquiryType: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['name', 'email', 'message'],
            },
          },
        },
      ],
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0].message;
    let response = assistantMessage.content || '';
    const toolCalls = assistantMessage.tool_calls || [];

    // Handle tool calls
    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'search_knowledge_base') {
        const { query } = JSON.parse(toolCall.function.arguments);
        // Perform search and add results to context
        // (Implementation similar to above)
      } else if (toolCall.function.name === 'submit_contact_form') {
        const formData = JSON.parse(toolCall.function.arguments);
        // Submit contact form
        // (Implementation similar to contact form API)
      }
    }

    return NextResponse.json({
      response,
      conversationId: conversationId || crypto.randomUUID(),
      toolCalls: toolCalls.map(tc => ({
        type: tc.function.name,
        parameters: JSON.parse(tc.function.arguments),
      })),
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your message' },
      { status: 500 }
    );
  }
}
```

**Response:**
```json
{
  "response": "The LMS has the following features: AI-powered content recommendations, microlearning modules, progress tracking, and analytics dashboards. Would you like to know more about any specific feature?",
  "conversationId": "conversation-id",
  "toolCalls": []
}
```

**Error Responses:**
- `400`: Invalid request (missing message)
- `429`: Rate limit exceeded
- `500`: Server error
- `503`: Groq API unavailable

### Tool Execution

**When AI makes tool call:**
1. Parse tool call from Groq response
2. Execute tool function
3. Add tool result to messages
4. Call Groq API again with tool result
5. Return final response

## Error Handling

### Groq API Errors

**Handling:**
- Rate limit errors: Return user-friendly message, suggest retry
- API errors: Log error, return generic error message
- Timeout errors: Retry once, then return error

### Search Errors

**Handling:**
- Database errors: Log, return error to user
- No results: Inform AI, let AI respond appropriately

### Tool Execution Errors

**Handling:**
- Validation errors: Return to AI, let AI inform user
- Submission errors: Return to AI, let AI handle gracefully

## Rate Limiting

**Limits:**
- 20 requests per minute per IP
- 100 requests per hour per IP

**Implementation:**
- Use Next.js middleware or API route rate limiting
- Return 429 status with retry-after header

## Security Considerations

1. **API Key Security:**
   - Store Groq API key in environment variables
   - Never expose in client-side code

2. **Input Sanitization:**
   - Sanitize user messages
   - Validate tool call parameters

3. **Rate Limiting:**
   - Prevent abuse
   - Protect API costs

4. **Content Filtering:**
   - Filter inappropriate content (optional)
   - Monitor for abuse

## Testing

### Test Scenarios

1. **Basic Questions:**
   - Product information
   - Feature questions
   - Pricing questions

2. **Semantic Search:**
   - Complex queries
   - Product-specific questions
   - General questions

3. **Tool Calling:**
   - Search tool usage
   - Contact form submission
   - Error handling

4. **Error Cases:**
   - API failures
   - Rate limiting
   - Invalid inputs

5. **UI/UX:**
   - Widget appearance
   - Message display
   - Loading states
   - Error states

