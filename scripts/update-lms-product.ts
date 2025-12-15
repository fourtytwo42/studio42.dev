/**
 * Script to update the LMS product in the database
 * Run with: npx ts-node scripts/update-lms-product.ts
 * Or: DATABASE_URL=your_url npx ts-node scripts/update-lms-product.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Updating LMS product...');

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

  console.log('✅ LMS product updated successfully!');
  console.log(`   Name: ${lms.name}`);
  console.log(`   Status: ${lms.status}`);
  console.log(`   Demo URL: ${lms.demoUrl}`);
  console.log(`   Features: ${Array.isArray(lms.features) ? lms.features.length : 0} features`);
}

main()
  .catch((e) => {
    console.error('❌ Error updating LMS product:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

