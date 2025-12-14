# System Architecture

Complete system design and component breakdown for Studio42.dev main website.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Frontend   │  │  API Routes  │  │  Admin Pages │    │
│  │   (App       │  │  (Server     │  │  (Protected) │    │
│  │   Router)    │  │  Actions)    │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
│  PostgreSQL  │  │   Groq API   │  │  SMTP Server │
│  + pgvector  │  │   (AI)       │  │  (Optional)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Component Breakdown

### Frontend Components

**Component 1: Homepage (Portfolio Grid)**
- **Responsibility:** Display all products in an attractive portfolio-style grid
- **Technology:** Next.js 16 App Router, React 19, TypeScript, Custom CSS
- **Interactions:** 
  - Fetches product data from API route
  - Navigates to individual product pages
  - Links to contact page with source parameter
- **State Management:** Server components with React Server Components pattern
- **Error Handling:** Error boundaries, fallback UI for failed data fetching

**Component 2: Product Pages**
- **Responsibility:** Display detailed information about individual products
- **Technology:** Next.js 16 App Router, React 19, TypeScript, Custom CSS
- **Interactions:**
  - Fetches product data by slug/ID
  - Embeds YouTube videos (click-to-play, carousel)
  - Links to GitHub and YouTube
  - CTAs to contact page and demo subdomain
- **State Management:** Server components for data, client components for interactivity
- **Error Handling:** 404 page for missing products, error boundaries

**Component 3: Universal Contact Form**
- **Responsibility:** Collect contact information with dynamic product pre-population
- **Technology:** Next.js 16 App Router, React 19, TypeScript, React Hook Form
- **Interactions:**
  - Reads URL parameter `?source=` to pre-populate product field
  - Submits form data to API route
  - Redirects to confirmation page on success
- **State Management:** React Hook Form for form state, server actions for submission
- **Error Handling:** Form validation, error messages, retry logic

**Component 4: AI Chat Widget**
- **Responsibility:** Provide floating chat interface for AI assistant
- **Technology:** Next.js 16, React 19, TypeScript, Custom CSS
- **Interactions:**
  - Communicates with API route for AI responses
  - Handles tool calling for form submission
  - Manages chat history and context
- **State Management:** React state for chat messages, Zustand for global chat state
- **Error Handling:** Error messages for API failures, retry mechanisms

**Component 5: Admin Dashboard**
- **Responsibility:** Admin interface for managing contacts and email configuration
- **Technology:** Next.js 16 App Router, React 19, TypeScript, Custom CSS
- **Interactions:**
  - Authenticates admin users
  - Fetches and displays contacts table
  - Manages email configuration
- **State Management:** Server components for data, client components for interactions
- **Error Handling:** Authentication errors, data fetching errors

### Backend Components

**Component 1: API Routes (Next.js API Routes)**
- **Responsibility:** Handle all API requests (contacts, products, AI, admin)
- **Technology:** Next.js 16 API Routes, Node.js 20+
- **Interactions:**
  - Connects to PostgreSQL database via Prisma
  - Calls Groq API for AI responses
  - Sends emails via SMTP (if enabled)
- **State Management:** Stateless API handlers
- **Error Handling:** Try-catch blocks, proper HTTP status codes, error logging

**Component 2: Database Layer (Prisma ORM)**
- **Responsibility:** Data persistence and querying
- **Technology:** Prisma ORM, PostgreSQL 15+ with pgvector extension
- **Interactions:**
  - Provides type-safe database access
  - Handles migrations and schema management
  - Supports vector similarity search via pgvector
- **State Management:** Database transactions for consistency
- **Error Handling:** Prisma error handling, transaction rollback on failure

**Component 3: AI Integration (Groq API)**
- **Responsibility:** Process AI chat requests with semantic search
- **Technology:** Groq API (OpenAI-compatible), pgvector for embeddings
- **Interactions:**
  - Receives chat messages from frontend
  - Performs semantic search on knowledge base
  - Calls Groq API with context and tools
  - Returns AI responses to frontend
- **State Management:** Stateless, maintains conversation context in request
- **Error Handling:** API error handling, fallback responses, rate limiting

**Component 4: Email Service (Optional)**
- **Responsibility:** Send confirmation and notification emails
- **Technology:** SMTP (Nodemailer or similar), configurable
- **Interactions:**
  - Receives email requests from API routes
  - Sends emails via configured SMTP server
  - Handles email templates
- **State Management:** Stateless email sending
- **Error Handling:** Email sending errors, retry logic, fallback behavior

## Data Flow

### Request Flow: Contact Form Submission

1. User fills form → Frontend validates → Submit button clicked
2. Frontend → API Route `/api/contacts` (POST)
3. API Route → Prisma → Insert into `contacts` table
4. API Route → Check email configuration (if enabled)
5. API Route → Email Service → Send confirmation to user
6. API Route → Email Service → Send notification to admin
7. API Route → Return success response
8. Frontend → Redirect to confirmation page

### Request Flow: AI Chat Message

1. User types message → Frontend sends to API Route `/api/ai/chat` (POST)
2. API Route → Check if semantic search needed
3. API Route → pgvector → Semantic search on knowledge base
4. API Route → Groq API → Send message with context and tools
5. Groq API → Returns response (possibly with tool calls)
6. API Route → Execute tool calls if needed (e.g., submit contact form)
7. API Route → Return AI response to frontend
8. Frontend → Display response in chat widget

### Request Flow: Product Page Load

1. User navigates to `/products/[slug]`
2. Next.js → Server Component fetches product data
3. Server Component → API Route or direct Prisma query
4. Database → Returns product data
5. Server Component → Renders page with data
6. Client → Page loads with all content

## Technology Choices

### Next.js 16 (App Router)

**Why Next.js 16?**
- **Server Components:** Efficient server-side rendering and data fetching
- **App Router:** Modern routing with layouts and nested routes
- **API Routes:** Built-in API endpoints without separate backend
- **TypeScript Support:** Excellent TypeScript integration
- **Performance:** Optimized builds, automatic code splitting

**Alternatives Considered:**
- **Remix:** Good but smaller ecosystem
- **SvelteKit:** Different paradigm, less React ecosystem
- **Vite + React:** More setup required, no built-in API routes

**Trade-offs:**
- Vendor lock-in to Next.js patterns
- Learning curve for App Router
- Larger bundle size than pure React

### PostgreSQL with pgvector

**Why PostgreSQL + pgvector?**
- **Semantic Search:** Native vector similarity search
- **Relational Data:** Structured data for products, contacts, etc.
- **Mature:** Battle-tested database with excellent tooling
- **Prisma Support:** Excellent Prisma integration
- **Self-hosted:** Full control over data

**Alternatives Considered:**
- **Pinecone/Weaviate:** Managed vector databases, but adds complexity
- **MongoDB:** No native vector support, would need separate vector DB
- **SQLite + vector extension:** Not production-ready for this scale

**Trade-offs:**
- Requires pgvector extension installation
- Vector search performance depends on index quality
- More complex than simple key-value store

### Groq API

**Why Groq?**
- **Fast Inference:** Extremely fast response times
- **OpenAI-Compatible:** Standard tool calling interface
- **Cost-Effective:** Competitive pricing
- **Model Support:** Access to various models including GPT-OSS-20B

**Alternatives Considered:**
- **OpenAI API:** More expensive, slower
- **Anthropic Claude:** Different API format, more expensive
- **Self-hosted:** Too complex for initial version

**Trade-offs:**
- Dependency on external API
- Rate limits and availability
- Model selection limited to Groq's offerings

### Custom CSS (Beyond Tailwind)

**Why Custom CSS?**
- **Unique Design:** Stand out from standard Tailwind sites
- **Full Control:** Complete design flexibility
- **Performance:** Only include what's needed
- **Brand Identity:** Custom styling that reflects quality

**Alternatives Considered:**
- **Tailwind CSS:** Too common, less unique
- **CSS-in-JS (styled-components):** Runtime overhead
- **SCSS/SASS:** Good option, but CSS is sufficient

**Trade-offs:**
- More manual CSS writing
- Need to handle responsive design manually
- Less utility classes available

## Version Selection

### Node.js 20.x LTS
- **Why:** Long-term support, modern features, excellent performance
- **Upgrade Path:** Follow LTS schedule, test thoroughly before upgrading

### Next.js 16.x
- **Why:** Latest stable version with App Router improvements
- **Upgrade Path:** Follow Next.js upgrade guide, test breaking changes

### PostgreSQL 15+
- **Why:** Latest stable version with pgvector support
- **Upgrade Path:** Follow PostgreSQL upgrade procedures

### React 19
- **Why:** Latest React with improved server components support
- **Upgrade Path:** Follow React upgrade guide, test component behavior

## Security Considerations

- **Authentication:** Secure admin authentication (NextAuth.js or similar)
- **API Security:** Rate limiting, input validation, SQL injection prevention (Prisma handles this)
- **Email Security:** SMTP authentication, secure credentials storage
- **Data Protection:** Encrypted database connections, secure environment variables
- **XSS Prevention:** React's built-in XSS protection, sanitize user inputs
- **CSRF Protection:** Next.js built-in CSRF protection

## Performance Considerations

- **Server Components:** Minimize client-side JavaScript
- **Image Optimization:** Next.js Image component for automatic optimization
- **Code Splitting:** Automatic with Next.js App Router
- **Database Indexing:** Proper indexes on frequently queried fields
- **Vector Search:** pgvector indexes for fast semantic search
- **Caching:** Next.js caching strategies, database query caching

## Scalability Considerations

- **Database:** PostgreSQL can scale with proper indexing and connection pooling
- **API Routes:** Stateless design allows horizontal scaling
- **Vector Search:** pgvector performance scales with proper indexing
- **Email:** Queue system for high-volume email sending (future enhancement)

