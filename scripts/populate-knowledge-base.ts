import { prisma } from '../lib/prisma';
import { upsertKnowledgeBaseEntry } from '../lib/semantic-search';

async function populateKnowledgeBase() {
  try {
    console.log('Starting knowledge base population...');

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        media: true,
      },
    });

    console.log(`Found ${products.length} products`);

    // Create knowledge base entries for each product
    for (const product of products) {
      // Parse features if they exist
      let featuresText = '';
      if (product.features) {
        try {
          const features = typeof product.features === 'string' 
            ? JSON.parse(product.features) 
            : product.features;
          
          if (Array.isArray(features) && features.length > 0) {
            featuresText = '\n\nKey Features:\n' + features.map((f: any) => {
              if (typeof f === 'object' && f.title && f.description) {
                return `- ${f.title}: ${f.description}`;
              }
              return `- ${JSON.stringify(f)}`;
            }).join('\n');
          }
        } catch (e) {
          // If parsing fails, include raw features
          featuresText = `\n\nFeatures: ${JSON.stringify(product.features)}`;
        }
      }

      const content = `
${product.name}

${product.tagline ? `Tagline: ${product.tagline}` : ''}

${product.description}
${featuresText}

${product.pricing ? `Pricing: ${product.pricing}` : ''}

${product.githubUrl ? `GitHub Repository: ${product.githubUrl}` : ''}
${product.youtubeUrl ? `YouTube Demo: ${product.youtubeUrl}` : ''}
${product.demoUrl ? `Live Demo: ${product.demoUrl}` : ''}

Status: ${product.status}
      `.trim();

      await upsertKnowledgeBaseEntry(
        `product-${product.slug}`,
        product.name,
        content,
        'product',
        product.slug
      );

      console.log(`Added knowledge base entry for: ${product.name}`);
    }

    // Add general FAQs
    const faqs = [
      {
        id: 'faq-general-1',
        title: 'What is Studio42.dev?',
        content: 'Studio42.dev is a company that offers multiple SaaS products. We specialize in creating innovative software solutions for businesses.',
        category: 'faq',
      },
      {
        id: 'faq-general-2',
        title: 'How do I request a demo?',
        content: 'You can request a demo by filling out the contact form on our website. Select "Request Demo" as the inquiry type and specify which product you are interested in.',
        category: 'faq',
      },
      {
        id: 'faq-general-3',
        title: 'How do I contact support?',
        content: 'You can contact support by filling out the contact form and selecting "Technical Support" as the inquiry type. Our team will get back to you as soon as possible.',
        category: 'faq',
      },
      {
        id: 'faq-general-4',
        title: 'Where can I find product documentation?',
        content: 'Product documentation is typically available on GitHub repositories. Check the product page for links to GitHub, YouTube demos, and other resources.',
        category: 'faq',
      },
    ];

    for (const faq of faqs) {
      await upsertKnowledgeBaseEntry(
        faq.id,
        faq.title,
        faq.content,
        faq.category
      );
      console.log(`Added FAQ: ${faq.title}`);
    }

    // Add detailed product-specific knowledge base entries
    const productDetails = [
      {
        id: 'product-ai-microlearning-lms-details',
        title: 'AI Microlearning LMS - Detailed Information',
        content: `AI Microlearning LMS is a zero-human-authoring adaptive microlearning platform that transforms raw content (PDFs, DOCX, TXT, URLs) into atomic, multimedia knowledge nuggets.

Key Capabilities:
- Zero Human Authoring: All content creation, multimedia generation, and narrative planning is automated
- Adaptive Learning: Narrative paths adapt in real-time based on learner choices and knowledge gaps
- Multimedia Rich: Each nugget includes text, AI-generated images, and audio explanations
- Conversational Tutoring: Natural language interaction with AI tutor, no traditional quizzes
- Complete Visibility: Admin console provides full visibility into all AI processes and system state

Technology Stack:
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4.0
- Backend: Node.js 20+, Next.js API Routes, Prisma ORM
- Database: PostgreSQL 15+ with pgvector extension
- AI: OpenAI GPT-5.1 Mini/Nano with function calling, DALL-E 3, Whisper, TTS APIs
- Voice: OpenAI TTS (standard/HD), ElevenLabs (high-quality tier)
- Infrastructure: BullMQ + Redis (job queue), chokidar (file watching)

Use Cases:
- Corporate training and employee onboarding
- Educational institutions and schools
- Professional development programs
- Customer education and training

The system automatically ingests content, performs semantic chunking, generates embeddings, creates learning nuggets with multimedia, and delivers personalized tutoring through conversational AI.`,
        category: 'product',
        productSlug: 'ai-microlearning-lms',
      },
      {
        id: 'product-organizational-ai-assistant-details',
        title: 'Organizational AI Assistant - Detailed Information',
        content: `Organizational AI Assistant is a context-aware organizational knowledge and productivity platform with full access to organizational context (emails, documents, conversations, calendar).

Key Capabilities:
- Context-Aware: AI has full access to organizational context within permission boundaries
- Proactive: Surfaces relevant information and reminders without being asked
- Natural Interaction: Conversational interface - just talk to it like a colleague
- Permission-Bound: Strict department-level data isolation - IT can't see HR data
- Tool-Enabled: AI can execute actions (send emails, create calendar events, search, etc.)
- Verbose & Traceable: Full audit logging of all actions for compliance

Technology Stack:
- Frontend: Next.js 15, React, Tailwind CSS 4, Heroicons
- Backend: Next.js API Routes, Node.js
- Database: PostgreSQL 15+ with pgvector extension
- AI: OpenAI GPT-5.1 mini/nano (chat), OpenAI embeddings (semantic search)
- Authentication: JWT (3-day sessions), SSO (OAuth2/SAML), LDAP/Active Directory
- Email/Calendar: Microsoft Graph API, Google APIs

Use Cases:
- Quick information lookups across organizational data
- Task management and proactive reminders
- Cross-team coordination and reporting
- Department-level information access with strict boundaries

The system provides semantic search across emails, documents, calendar, and files, with department-level security and comprehensive audit logging.`,
        category: 'product',
        productSlug: 'organizational-ai-assistant',
      },
      {
        id: 'product-itsm-helpdesk-details',
        title: 'ITSM Helpdesk - Detailed Information',
        content: `ITSM Helpdesk is a complete IT Service Management platform with AI-powered ticketing, knowledge base, asset management (CMDB), change management, and comprehensive analytics.

Key Capabilities:
- Multi-Channel Ticket Intake: Email tickets (IMAP/POP3), public form, API, and AI chat widget
- AI-Powered Support: Groq GPT OSS 20B model with OpenAI-compatible tool calling, chat widget with knowledge base access
- Knowledge Base: Auto-creation of KB articles from resolved tickets, semantic and keyword search with pgvector
- Asset Management (CMDB): Complete Configuration Management Database with hardware, software, network devices, cloud resources
- Change Management: Change requests with flexible approval workflows, risk assessment, integration with tickets
- SLA & Escalation: SLA tracking for response and resolution times, priority levels, auto-escalation rules
- Analytics & Reporting: Comprehensive dashboards with MTTR, ticket volume, agent performance, SLA compliance

Technology Stack:
- Frontend: Next.js 15+, React 19, TypeScript, Custom CSS (not Tailwind)
- Backend: Next.js API Routes, Node.js 20+
- Database: PostgreSQL 16.0 with pgvector extension
- AI: Groq GPT OSS 20B with OpenAI-compatible tool calling
- Authentication: JWT, SSO (OAuth2/SAML), LDAP
- Email: IMAP/POP3 polling, SMTP forwarding, webhook support

Use Cases:
- IT service desk operations
- Ticket management and resolution
- Asset tracking and configuration management
- Change request management with approval workflows
- SLA compliance and performance analytics

The system is designed to compete with Freshservice and Freshdesk, featuring a beautiful responsive UI with dark mode default, fully configurable through admin UI with all settings stored in database.`,
        category: 'product',
        productSlug: 'itsm-helpdesk',
      },
      {
        id: 'product-restaurant-order-delivery-details',
        title: 'Restaurant Order & Delivery App - Detailed Information',
        content: `Restaurant Order & Delivery App is a comprehensive self-hostable restaurant order and delivery application featuring full order management, POS system, delivery driver tracking, gift cards, loyalty points, coupons, and complete analytics.

Key Capabilities:
- Customer Ordering: DoorDash-style interface with menu browsing, search, filters, item customization with modifiers, guest checkout or account creation, real-time order tracking
- Point of Sale (POS): Touch-screen optimized interface for creating orders, generating gift cards, viewing and managing all orders, printing receipts
- Delivery Management: Mobile-optimized driver app with GPS tracking, route optimization, turn-by-turn directions, auto-assignment based on location
- Payment Processing: Stripe and PayPal integration, Apple Pay and Google Pay support, gift cards (virtual and physical), coupon codes, loyalty points system, cash on delivery
- Menu Management: Flexible category system, time-based availability, complex modifier system (required/optional, groups), dietary tags and allergen information
- Analytics & Reporting: Sales dashboards, order trends and popular items, gift card analytics, staff performance metrics, exportable reports (CSV, PDF)

Technology Stack:
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Node.js 20+
- Database: PostgreSQL 15+ with Prisma ORM
- Real-time: WebSocket (ws library)
- Payments: Stripe, PayPal
- Maps: Google Maps API, browser Geolocation API

Use Cases:
- Restaurant ordering and delivery operations
- In-house POS system for dine-in orders
- Delivery driver management and tracking
- Gift card and loyalty program management
- Sales analytics and reporting

The system is designed to be as easy to use as an iPhone app, easier than WordPress, with self-hostable deployment on restaurant's own VPS.`,
        category: 'product',
        productSlug: 'restaurant-order-delivery',
      },
    ];

    for (const detail of productDetails) {
      await upsertKnowledgeBaseEntry(
        detail.id,
        detail.title,
        detail.content,
        detail.category,
        detail.productSlug
      );
      console.log(`Added detailed knowledge base entry for: ${detail.title}`);
    }

    // Add company information
    const companyInfo = {
      id: 'company-info',
      title: 'About Studio42.dev',
      content: 'Studio42.dev is a software development company that creates innovative SaaS products. We focus on building high-quality, user-friendly solutions that solve real business problems. All our products are self-hostable, giving organizations complete control over their data and avoiding recurring SaaS fees. We specialize in enterprise-grade solutions with modern technology stacks, comprehensive features, and beautiful user interfaces.',
      category: 'general',
    };

    await upsertKnowledgeBaseEntry(
      companyInfo.id,
      companyInfo.title,
      companyInfo.content,
      companyInfo.category
    );
    console.log(`Added company information`);

    console.log('Knowledge base population completed successfully!');
  } catch (error) {
    console.error('Error populating knowledge base:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  populateKnowledgeBase();
}

export default populateKnowledgeBase;

