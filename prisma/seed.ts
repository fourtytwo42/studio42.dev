import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables from .env file if it exists
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@studio42.dev' },
    update: {},
    create: {
      email: 'admin@studio42.dev',
      passwordHash: hashedPassword,
      name: 'Admin User',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create email config (disabled by default)
  const emailConfig = await prisma.emailConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      enabled: false,
    },
  });
  console.log('Created email config');

  // Create LMS product
  const lms = await prisma.product.upsert({
    where: { slug: 'lms' },
    update: {
      name: 'Learning Management System',
      tagline: 'Enterprise-grade learning management system',
      description: 'A comprehensive, self-hosted learning management system built on modern web technologies. Perfect for organizations that need complete control over their training programs with advanced course management, progress tracking, assessments, and analytics. Features role-based access control for learners, instructors, and administrators, comprehensive video tracking, automated assessments, and detailed reporting dashboards.',
      status: 'AVAILABLE',
      thumbnail: '/images/lms-thumbnail.jpg',
      githubUrl: 'https://github.com/fourtytwo42/lms',
      demoUrl: 'https://lms.studio42.dev',
      pricing: 'Self-hosted with enterprise support plans available',
      features: [
        { 
          title: 'Course Management', 
          description: 'Create and organize courses with flexible learning plans, reusable content, and granular permissions' 
        },
        { 
          title: 'Progress Tracking', 
          description: 'Comprehensive tracking of video watch time, test scores, completion status, and time-to-complete metrics' 
        },
        { 
          title: 'Role-Based Access', 
          description: 'Clear separation between learners, instructors, and administrators with appropriate permissions for each role' 
        },
        { 
          title: 'Video Player & Tracking', 
          description: 'HTML5 video player with progress tracking, watch time monitoring, and completion thresholds' 
        },
        { 
          title: 'Assessment Engine', 
          description: 'Automated testing with multiple question types (single choice, multiple choice, true/false, short answer, fill-in-the-blank) with auto-grading' 
        },
        { 
          title: 'Analytics & Reporting', 
          description: 'Detailed dashboards with charts, progress reports, and CSV export functionality for instructors and admins' 
        },
        { 
          title: 'File Repository', 
          description: 'Support for videos, PDFs, PowerPoint presentations with automatic PPT to PDF conversion' 
        },
        { 
          title: 'Certificate Generation', 
          description: 'Automated certificate generation upon course completion' 
        },
        { 
          title: 'Bulk Operations', 
          description: 'Import/export functionality for courses, users, and enrollments with bulk management capabilities' 
        },
        { 
          title: 'Modern UI/UX', 
          description: 'Built with Next.js 16, React 19, and Tailwind CSS 4. Mobile-responsive, accessible, and performant with dark/light mode support' 
        },
      ],
    },
    create: {
      slug: 'lms',
      name: 'Learning Management System',
      tagline: 'Enterprise-grade learning management system',
      description: 'A comprehensive, self-hosted learning management system built on modern web technologies. Perfect for organizations that need complete control over their training programs with advanced course management, progress tracking, assessments, and analytics. Features role-based access control for learners, instructors, and administrators, comprehensive video tracking, automated assessments, and detailed reporting dashboards.',
      status: 'AVAILABLE',
      thumbnail: '/images/lms-thumbnail.jpg',
      githubUrl: 'https://github.com/fourtytwo42/lms',
      demoUrl: 'https://lms.studio42.dev',
      pricing: 'Self-hosted with enterprise support plans available',
      features: [
        { 
          title: 'Course Management', 
          description: 'Create and organize courses with flexible learning plans, reusable content, and granular permissions' 
        },
        { 
          title: 'Progress Tracking', 
          description: 'Comprehensive tracking of video watch time, test scores, completion status, and time-to-complete metrics' 
        },
        { 
          title: 'Role-Based Access', 
          description: 'Clear separation between learners, instructors, and administrators with appropriate permissions for each role' 
        },
        { 
          title: 'Video Player & Tracking', 
          description: 'HTML5 video player with progress tracking, watch time monitoring, and completion thresholds' 
        },
        { 
          title: 'Assessment Engine', 
          description: 'Automated testing with multiple question types (single choice, multiple choice, true/false, short answer, fill-in-the-blank) with auto-grading' 
        },
        { 
          title: 'Analytics & Reporting', 
          description: 'Detailed dashboards with charts, progress reports, and CSV export functionality for instructors and admins' 
        },
        { 
          title: 'File Repository', 
          description: 'Support for videos, PDFs, PowerPoint presentations with automatic PPT to PDF conversion' 
        },
        { 
          title: 'Certificate Generation', 
          description: 'Automated certificate generation upon course completion' 
        },
        { 
          title: 'Bulk Operations', 
          description: 'Import/export functionality for courses, users, and enrollments with bulk management capabilities' 
        },
        { 
          title: 'Modern UI/UX', 
          description: 'Built with Next.js 16, React 19, and Tailwind CSS 4. Mobile-responsive, accessible, and performant with dark/light mode support' 
        },
      ],
    },
  });
  console.log('Created/Updated product:', lms.name);

  // AI Microlearning LMS product
  const aiMicroLms = await prisma.product.upsert({
    where: { slug: 'ai-microlearning-lms' },
    update: {
      name: 'AI Microlearning LMS',
      tagline: 'Zero-authoring, adaptive microlearning with AI tutoring',
      description: 'Transform raw documents and URLs into adaptive, multimedia learning nuggets with zero human authoring. The AI microlearning platform automates ingestion, semantic chunking, narrative planning, and multimodal tutoring to deliver personalized learning paths for every role.',
      status: 'AVAILABLE',
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
    create: {
      slug: 'ai-microlearning-lms',
      name: 'AI Microlearning LMS',
      tagline: 'Zero-authoring, adaptive microlearning with AI tutoring',
      description: 'Transform raw documents and URLs into adaptive, multimedia learning nuggets with zero human authoring. The AI microlearning platform automates ingestion, semantic chunking, narrative planning, and multimodal tutoring to deliver personalized learning paths for every role.',
      status: 'AVAILABLE',
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
  });
  console.log('Created/Updated product:', aiMicroLms.name);

  // Organizational AI Assistant product
  const orgAssistant = await prisma.product.upsert({
    where: { slug: 'organizational-ai-assistant' },
    update: {
      name: 'Organizational AI Assistant',
      tagline: 'Secure AI co-pilot for every conversation, file, and email',
      description: 'Context-aware AI copilot that unifies email, documents, calendar, and files with strict department-level permissions. Delivers semantic search, proactive reminders, and tool-based actions with full auditability and enterprise controls.',
      status: 'AVAILABLE',
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
    create: {
      slug: 'organizational-ai-assistant',
      name: 'Organizational AI Assistant',
      tagline: 'Secure AI co-pilot for every conversation, file, and email',
      description: 'Context-aware AI copilot that unifies email, documents, calendar, and files with strict department-level permissions. Delivers semantic search, proactive reminders, and tool-based actions with full auditability and enterprise controls.',
      status: 'AVAILABLE',
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
  });
  console.log('Created/Updated product:', orgAssistant.name);

  // Create media for LMS - remove old media first if updating
  await prisma.productMedia.deleteMany({
    where: { productId: lms.id },
  });

  // Create LMS media (can be added later when screenshots/videos are available)
  // await prisma.productMedia.createMany({
  //   data: [
  //     {
  //       productId: lms.id,
  //       type: 'SCREENSHOT',
  //       url: '/images/lms/dashboard.png',
  //       title: 'Admin Dashboard',
  //       order: 0,
  //     },
  //     {
  //       productId: lms.id,
  //       type: 'SCREENSHOT',
  //       url: '/images/lms/course-viewer.png',
  //       title: 'Course Viewer',
  //       order: 1,
  //     },
  //     {
  //       productId: lms.id,
  //       type: 'SCREENSHOT',
  //       url: '/images/lms/analytics.png',
  //       title: 'Analytics Dashboard',
  //       order: 2,
  //     },
  //   ],
  // });
  console.log('LMS product ready (media can be added later)');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

