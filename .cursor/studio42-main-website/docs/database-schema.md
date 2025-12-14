# Database Schema

Complete database schema specification for Studio42.dev main website, including pgvector setup for semantic search.

## Database Setup

### PostgreSQL Version
- **Version:** PostgreSQL 15+
- **Extensions Required:**
  - `pgvector` - For vector similarity search
  - `uuid-ossp` - For UUID generation (optional, can use Prisma's built-in)

### pgvector Installation

```sql
-- Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Schema Overview

```
┌─────────────────┐
│    products     │
├─────────────────┤
│ id, slug, name,  │
│ description, etc │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  product_media  │
├─────────────────┤
│ id, product_id, │
│ type, url, etc  │
└─────────────────┘

┌─────────────────┐
│    contacts     │
├─────────────────┤
│ id, name, email,│
│ product, etc    │
└─────────────────┘

┌─────────────────┐
│  email_config   │
├─────────────────┤
│ id, enabled,    │
│ smtp_host, etc  │
└─────────────────┘

┌─────────────────┐
│ knowledge_base  │
├─────────────────┤
│ id, content,    │
│ embedding, etc  │
└─────────────────┘

┌─────────────────┐
│     admins      │
├─────────────────┤
│ id, email,      │
│ password_hash   │
└─────────────────┘
```

## Table Specifications

### products

Stores information about SaaS products to be showcased.

```prisma
model Product {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  tagline     String?
  description String   @db.Text
  status      ProductStatus @default(IN_DEVELOPMENT)
  thumbnail   String?  // URL to thumbnail image
  githubUrl   String?
  youtubeUrl  String?
  demoUrl     String?  // Subdomain URL (e.g., lms.studio42.dev)
  pricing     String?  @db.Text // Pricing information
  features    Json?    // Array of feature objects
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  media       ProductMedia[]
  contacts    Contact[]

  @@index([slug])
  @@index([status])
}
```

**ProductStatus Enum:**
```prisma
enum ProductStatus {
  AVAILABLE
  COMING_SOON
  IN_DEVELOPMENT
}
```

**Fields:**
- `id`: UUID primary key
- `slug`: URL-friendly identifier (e.g., "lms", "product-1")
- `name`: Product name
- `tagline`: Short tagline for product cards
- `description`: Full product description (text)
- `status`: Current status of the product
- `thumbnail`: URL to thumbnail image for product cards
- `githubUrl`: Link to GitHub repository
- `youtubeUrl`: Link to YouTube channel/playlist
- `demoUrl`: Link to demo subdomain
- `pricing`: Pricing information (text, can be formatted)
- `features`: JSON array of feature objects `[{title: string, description: string}]`
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes:**
- `slug` (unique) - For product page lookups
- `status` - For filtering products by status

### product_media

Stores media files (videos, images) associated with products.

```prisma
model ProductMedia {
  id        String   @id @default(uuid())
  productId String
  type      MediaType
  url       String
  title     String?
  order     Int      @default(0) // For ordering in carousel
  createdAt DateTime @default(now())

  // Relations
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([productId, order])
}
```

**MediaType Enum:**
```prisma
enum MediaType {
  VIDEO
  IMAGE
  SCREENSHOT
}
```

**Fields:**
- `id`: UUID primary key
- `productId`: Foreign key to products
- `type`: Type of media (video, image, screenshot)
- `url`: URL to media file (YouTube embed URL, image URL, etc.)
- `title`: Optional title for the media
- `order`: Order for carousel display (0-based)
- `createdAt`: Timestamp

**Indexes:**
- `productId` - For fetching all media for a product
- `productId, order` - For ordered media queries

### contacts

Stores all contact form submissions.

```prisma
model Contact {
  id              String        @id @default(uuid())
  name            String
  email           String
  company         String?
  phone           String?
  product         String?      // Product they're contacting about
  inquiryType     InquiryType
  message         String        @db.Text
  preferredMethod ContactMethod @default(EMAIL)
  source          String?       // URL parameter source (e.g., "lms.studio42.dev")
  createdAt       DateTime      @default(now())
  read            Boolean       @default(false) // Admin read status
  responded       Boolean       @default(false) // Admin response status

  // Relations
  productRelation Product?      @relation(fields: [product], references: [slug])

  @@index([email])
  @@index([product])
  @@index([createdAt])
  @@index([read])
}
```

**InquiryType Enum:**
```prisma
enum InquiryType {
  REQUEST_DEMO
  CONTACT_SALES
  GENERAL_INQUIRY
  TECHNICAL_SUPPORT
  OTHER
}
```

**ContactMethod Enum:**
```prisma
enum ContactMethod {
  EMAIL
  PHONE
  EITHER
}
```

**Fields:**
- `id`: UUID primary key
- `name`: Contact's name
- `email`: Contact's email
- `company`: Optional company name
- `phone`: Optional phone number
- `product`: Product slug they're contacting about (nullable)
- `inquiryType`: Type of inquiry
- `message`: Contact message
- `preferredMethod`: Preferred contact method
- `source`: Source URL parameter (which subdomain they came from)
- `createdAt`: Timestamp
- `read`: Whether admin has read the contact
- `responded`: Whether admin has responded

**Indexes:**
- `email` - For finding contacts by email
- `product` - For filtering by product
- `createdAt` - For sorting by date
- `read` - For filtering unread contacts

### email_config

Stores email configuration for admin-configurable email notifications.

```prisma
model EmailConfig {
  id              String   @id @default(uuid())
  enabled         Boolean  @default(false)
  smtpHost        String?
  smtpPort        Int?
  smtpUser        String?
  smtpPassword    String?  @db.Text // Encrypted
  smtpSecure      Boolean  @default(true) // Use TLS/SSL
  fromEmail       String?
  fromName        String?
  adminEmail      String?  // Email to notify on new contacts
  confirmationTemplate String? @db.Text // Email template for user confirmation
  notificationTemplate String? @db.Text // Email template for admin notification
  updatedAt       DateTime @updatedAt
  updatedBy       String?  // Admin user ID who last updated
}
```

**Fields:**
- `id`: UUID primary key (singleton - only one config record)
- `enabled`: Whether email notifications are enabled
- `smtpHost`: SMTP server hostname
- `smtpPort`: SMTP server port
- `smtpUser`: SMTP username
- `smtpPassword`: Encrypted SMTP password
- `smtpSecure`: Whether to use TLS/SSL
- `fromEmail`: From email address
- `fromName`: From name
- `adminEmail`: Email address to notify on new contacts
- `confirmationTemplate`: Email template for user confirmation
- `notificationTemplate`: Email template for admin notification
- `updatedAt`: Timestamp
- `updatedBy`: Admin user who last updated

**Note:** This should be a singleton table (only one row). Consider adding a constraint or using a single-row approach.

### knowledge_base

Stores content for AI assistant with vector embeddings for semantic search.

```prisma
model KnowledgeBase {
  id          String   @id @default(uuid())
  title       String
  content     String   @db.Text
  category    String?  // e.g., "product", "feature", "faq", "general"
  productSlug String?  // If related to specific product
  embedding   Unsupported("vector(1536)")? // pgvector embedding (1536 dimensions for OpenAI)
  metadata    Json?    // Additional metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([productSlug])
}
```

**Fields:**
- `id`: UUID primary key
- `title`: Title of the knowledge base entry
- `content`: Full content text
- `category`: Category of content (product, feature, faq, general)
- `productSlug`: Related product slug (if applicable)
- `embedding`: Vector embedding for semantic search (1536 dimensions for OpenAI-compatible models)
- `metadata`: Additional JSON metadata
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes:**
- `category` - For filtering by category
- `productSlug` - For filtering by product
- Vector index (HNSW) - For semantic search (created separately)

**Vector Index:**
```sql
-- Create HNSW index for vector similarity search
CREATE INDEX ON knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### admins

Stores admin user accounts for dashboard access.

```prisma
model Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   // Hashed password (bcrypt)
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  lastLogin    DateTime?

  @@index([email])
}
```

**Fields:**
- `id`: UUID primary key
- `email`: Admin email (unique)
- `passwordHash`: Bcrypt hashed password
- `name`: Optional admin name
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `lastLogin`: Last login timestamp

**Indexes:**
- `email` (unique) - For login lookups

## Relationships

- **Product → ProductMedia:** One-to-many (one product has many media items)
- **Product → Contact:** One-to-many (one product can have many contacts)
- **Product → KnowledgeBase:** Implicit (via productSlug)

## Prisma Schema File

Complete Prisma schema:

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductStatus {
  AVAILABLE
  COMING_SOON
  IN_DEVELOPMENT
}

enum MediaType {
  VIDEO
  IMAGE
  SCREENSHOT
}

enum InquiryType {
  REQUEST_DEMO
  CONTACT_SALES
  GENERAL_INQUIRY
  TECHNICAL_SUPPORT
  OTHER
}

enum ContactMethod {
  EMAIL
  PHONE
  EITHER
}

model Product {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  tagline     String?
  description String   @db.Text
  status      ProductStatus @default(IN_DEVELOPMENT)
  thumbnail   String?
  githubUrl   String?
  youtubeUrl  String?
  demoUrl     String?
  pricing     String?  @db.Text
  features    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  media       ProductMedia[]
  contacts    Contact[]

  @@index([slug])
  @@index([status])
}

model ProductMedia {
  id        String   @id @default(uuid())
  productId String
  type      MediaType
  url       String
  title     String?
  order     Int      @default(0)
  createdAt DateTime @default(now())

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([productId, order])
}

model Contact {
  id              String        @id @default(uuid())
  name            String
  email           String
  company         String?
  phone           String?
  product         String?
  inquiryType     InquiryType
  message         String        @db.Text
  preferredMethod ContactMethod @default(EMAIL)
  source          String?
  createdAt       DateTime      @default(now())
  read            Boolean       @default(false)
  responded       Boolean       @default(false)

  productRelation Product?      @relation(fields: [product], references: [slug])

  @@index([email])
  @@index([product])
  @@index([createdAt])
  @@index([read])
}

model EmailConfig {
  id                  String   @id @default(uuid())
  enabled             Boolean  @default(false)
  smtpHost            String?
  smtpPort            Int?
  smtpUser            String?
  smtpPassword        String?  @db.Text
  smtpSecure          Boolean  @default(true)
  fromEmail           String?
  fromName            String?
  adminEmail          String?
  confirmationTemplate String? @db.Text
  notificationTemplate String? @db.Text
  updatedAt           DateTime @updatedAt
  updatedBy           String?
}

model KnowledgeBase {
  id          String   @id @default(uuid())
  title       String
  content     String   @db.Text
  category    String?
  productSlug String?
  embedding   Unsupported("vector(1536)")?
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([productSlug])
}

model Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  lastLogin    DateTime?

  @@index([email])
}
```

## Migration Strategy

1. **Initial Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Add pgvector Extension:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Create Vector Index:**
   ```sql
   CREATE INDEX knowledge_base_embedding_idx 
   ON knowledge_base 
   USING hnsw (embedding vector_cosine_ops)
   WITH (m = 16, ef_construction = 64);
   ```

## Seed Data

Initial seed data should include:
- At least one admin user
- Email config (disabled by default)
- Sample products (LMS + placeholders)
- Sample knowledge base entries

See seed script in implementation details.

