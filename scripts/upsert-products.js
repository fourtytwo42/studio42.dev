const { PrismaClient, ProductStatus } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const products = [
  {
    slug: 'lms',
    name: 'Learning Management System',
    tagline: 'Enterprise-grade learning management system',
    description:
      'A comprehensive, self-hosted learning management system built on modern web technologies. Perfect for organizations that need complete control over their training programs with advanced course management, progress tracking, assessments, and analytics. Features role-based access control for learners, instructors, and administrators, comprehensive video tracking, automated assessments, and detailed reporting dashboards.',
    status: ProductStatus.AVAILABLE,
    thumbnail: '/images/lms-thumbnail.jpg',
    githubUrl: 'https://github.com/fourtytwo42/lms',
    demoUrl: 'https://lms.studio42.dev',
    pricing: 'Self-hosted with enterprise support plans available',
    features: [
      {
        title: 'Course Management',
        description: 'Create and organize courses with flexible learning plans, reusable content, and granular permissions',
      },
      {
        title: 'Progress Tracking',
        description: 'Comprehensive tracking of video watch time, test scores, completion status, and time-to-complete metrics',
      },
      {
        title: 'Role-Based Access',
        description: 'Clear separation between learners, instructors, and administrators with appropriate permissions for each role',
      },
      {
        title: 'Video Player & Tracking',
        description: 'HTML5 video player with progress tracking, watch time monitoring, and completion thresholds',
      },
      {
        title: 'Assessment Engine',
        description: 'Automated testing with multiple question types (single choice, multiple choice, true/false, short answer, fill-in-the-blank) with auto-grading',
      },
      {
        title: 'Analytics & Reporting',
        description: 'Detailed dashboards with charts, progress reports, and CSV export functionality for instructors and admins',
      },
      {
        title: 'File Repository',
        description: 'Support for videos, PDFs, PowerPoint presentations with automatic PPT to PDF conversion',
      },
      {
        title: 'Certificate Generation',
        description: 'Automated certificate generation upon course completion',
      },
      {
        title: 'Bulk Operations',
        description: 'Import/export functionality for courses, users, and enrollments with bulk management capabilities',
      },
      {
        title: 'Modern UI/UX',
        description: 'Built with Next.js 16, React 19, and Tailwind CSS 4. Mobile-responsive, accessible, and performant with dark/light mode support',
      },
    ],
  },
  {
    slug: 'ai-microlearning-lms',
    name: 'AI Microlearning LMS',
    tagline: 'Zero-authoring, adaptive microlearning with AI tutoring',
    description:
      'Transform raw documents and URLs into adaptive, multimedia learning nuggets with zero human authoring. The AI microlearning platform automates ingestion, semantic chunking, narrative planning, and multimodal tutoring to deliver personalized learning paths for every role.',
    status: ProductStatus.AVAILABLE,
    thumbnail: '/images/ai-microlearning-lms.jpg',
    demoUrl: 'https://lmsnuggets.studio42.dev',
    pricing: 'Self-hosted with premium support tiers for AI workloads',
    features: [
      {
        title: 'Zero Human Authoring',
        description: 'Automated ingestion for files and URLs with semantic chunking, embedding, and nugget generation - no manual course building required.',
      },
      {
        title: 'Adaptive Narrative Paths',
        description: 'Choose-your-own-adventure narrative planning that adapts to learner knowledge gaps in real time.',
      },
      {
        title: 'Conversational AI Tutor',
        description: 'Voice + chat tutoring that delivers organic assessments without rigid quizzes, tuned for learner intent.',
      },
      {
        title: 'Multimodal Nuggets',
        description: 'Slides, AI imagery, and TTS audio per nugget with multiple voice quality tiers to control cost.',
      },
      {
        title: 'Mastery & Analytics',
        description: 'Real-time mastery tracking, knowledge-gap detection, and dashboards for admins and instructors.',
      },
      {
        title: 'Secure & Self-Hosted',
        description: 'Deploy on your infrastructure with PostgreSQL + pgvector, Redis, and PM2; no vendor lock-in.',
      },
      {
        title: 'Background Job Pipeline',
        description: 'BullMQ-driven ingestion, content generation, and multimedia jobs with retries and monitoring.',
      },
      {
        title: 'Admin Console & Visibility',
        description: 'Full visibility into ingestion jobs, content state, and AI outputs with audit-friendly logging.',
      },
    ],
  },
  {
    slug: 'organizational-ai-assistant',
    name: 'Organizational AI Assistant',
    tagline: 'Secure AI co-pilot for every conversation, file, and email',
    description:
      'Context-aware AI copilot that unifies email, documents, calendar, and files with strict department-level permissions. Delivers semantic search, proactive reminders, and tool-based actions with full auditability and enterprise controls.',
    status: ProductStatus.AVAILABLE,
    thumbnail: '/images/organizational-ai-assistant.jpg',
    demoUrl: 'https://airepository.studio42.dev',
    pricing: 'Self-hosted enterprise licensing with premium support',
    features: [
      {
        title: 'Context-Aware Chat',
        description: 'Natural language answers grounded in your org emails, documents, calendar, and files.',
      },
      {
        title: 'Department-Level Security',
        description: 'RLS-enforced data isolation with department-aware tool permissions and access checks.',
      },
      {
        title: 'Tool-Enabled Actions',
        description: 'Execute actions like sending emails and creating calendar events with validated tool calls.',
      },
      {
        title: 'Semantic Search',
        description: 'Hybrid keyword + vector search on PostgreSQL + pgvector tuned for organizational content.',
      },
      {
        title: 'Proactive Alerts',
        description: 'Reminders for missed emails, deadlines, and follow-ups with configurable guardrails.',
      },
      {
        title: 'Audit & Compliance',
        description: 'Comprehensive audit logging, usage tracking, and rate limits for every tool execution.',
      },
      {
        title: 'Admin Console',
        description: 'Controls for departments, users, costs, API keys, and usage policies in one place.',
      },
      {
        title: 'Production-Ready Delivery',
        description: 'PM2 + Playwright coverage, streaming responses, and deployment patterns for scale.',
      },
    ],
  },
  {
    slug: 'itsm-helpdesk',
    name: 'ITSM Helpdesk',
    tagline: 'Modern IT Service Management made simple',
    description:
      'Complete IT Service Management platform with AI-powered ticketing, knowledge base, asset management (CMDB), change management, and comprehensive analytics. Self-hostable solution designed to compete with Freshservice and Freshdesk, featuring multi-channel ticket intake, AI chat widget, SLA tracking, and beautiful responsive UI.',
    status: ProductStatus.AVAILABLE,
    thumbnail: '/images/itsm-helpdesk.jpg',
    demoUrl: 'https://itsm.studio42.dev',
    pricing: 'Self-hosted with enterprise support plans available',
    features: [
      {
        title: 'Multi-Channel Ticket Intake',
        description: 'Email tickets (IMAP/POP3), public form, API, and AI chat widget for comprehensive ticket creation from any source.',
      },
      {
        title: 'AI-Powered Support',
        description: 'Groq GPT OSS 20B model with OpenAI-compatible tool calling, chat widget with knowledge base access, learns from resolved tickets.',
      },
      {
        title: 'Knowledge Base',
        description: 'Auto-creation of KB articles from resolved tickets, semantic and keyword search with pgvector, categories and tags.',
      },
      {
        title: 'Asset Management (CMDB)',
        description: 'Complete Configuration Management Database with hardware, software, network devices, cloud resources, and relationship mapping.',
      },
      {
        title: 'Change Management',
        description: 'Change requests with flexible approval workflows, risk assessment, integration with tickets, and change types (Standard, Normal, Emergency).',
      },
      {
        title: 'SLA & Escalation',
        description: 'SLA tracking for response and resolution times, priority levels, auto-escalation rules, and assignment strategies.',
      },
      {
        title: 'Analytics & Reporting',
        description: 'Comprehensive dashboards with MTTR, ticket volume, agent performance, SLA compliance, custom reports, and CSV/PDF exports.',
      },
      {
        title: 'Fully Configurable',
        description: 'All settings configurable through admin UI (email, auth, branding, custom fields), stored in database, no env file dependencies.',
      },
    ],
  },
  {
    slug: 'restaurant-order-delivery',
    name: 'Restaurant Order & Delivery App',
    tagline: 'Complete restaurant ordering and delivery management system',
    description:
      'Comprehensive self-hostable restaurant order and delivery application featuring full order management, POS system, delivery driver tracking, gift cards, loyalty points, coupons, and complete analytics. Built with Next.js 16, featuring DoorDash-style customer interface, touch-screen POS, mobile driver app with GPS tracking, and comprehensive admin panel.',
    status: ProductStatus.AVAILABLE,
    thumbnail: '/images/restaurant-order-delivery.jpg',
    demoUrl: 'https://fooddelivery.studio42.dev',
    pricing: 'Self-hosted with restaurant support plans available',
    features: [
      {
        title: 'Customer Ordering',
        description: 'DoorDash-style interface with menu browsing, search, filters, item customization with modifiers, guest checkout or account creation, real-time order tracking.',
      },
      {
        title: 'Point of Sale (POS)',
        description: 'Touch-screen optimized interface for creating orders, generating gift cards, viewing and managing all orders, printing receipts, marking orders complete.',
      },
      {
        title: 'Delivery Management',
        description: 'Mobile-optimized driver app with GPS tracking, route optimization, turn-by-turn directions, auto-assignment based on location, native map integration.',
      },
      {
        title: 'Payment Processing',
        description: 'Stripe and PayPal integration, Apple Pay and Google Pay support, gift cards (virtual and physical), coupon codes, loyalty points system, cash on delivery.',
      },
      {
        title: 'Menu Management',
        description: 'Flexible category system, time-based availability, complex modifier system (required/optional, groups), dietary tags and allergen information, featured items.',
      },
      {
        title: 'Analytics & Reporting',
        description: 'Sales dashboards, order trends and popular items, gift card analytics, staff performance metrics, exportable reports (CSV, PDF).',
      },
      {
        title: 'User Roles',
        description: 'Admin, Manager, Staff/Employee, Delivery Driver, and Customer roles with appropriate permissions for each user type.',
      },
      {
        title: 'Self-Hostable',
        description: 'Deploy on your own VPS (Ubuntu 22.04), full control over data, no recurring SaaS fees, complete customization available.',
      },
    ],
  },
];

async function main() {
  for (const product of products) {
    const result = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`Upserted product: ${result.name} (${result.slug})`);
  }
  console.log('All products upserted.');
}

main()
  .catch((error) => {
    console.error('Error upserting products:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

