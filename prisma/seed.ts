import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  // Create sample products
  const lms = await prisma.product.upsert({
    where: { slug: 'lms' },
    update: {},
    create: {
      slug: 'lms',
      name: 'AI Microlearning LMS',
      tagline: 'Intelligent learning management system',
      description: 'A comprehensive learning management system with AI-powered content recommendations, microlearning modules, and analytics. Perfect for organizations looking to deliver personalized learning experiences at scale.',
      status: 'AVAILABLE',
      thumbnail: '/images/lms-thumbnail.jpg',
      githubUrl: 'https://github.com/studio42/lms',
      youtubeUrl: 'https://youtube.com/@studio42',
      demoUrl: 'https://lms.studio42.dev',
      pricing: 'Starting at $99/month',
      features: [
        { title: 'AI-Powered', description: 'Intelligent content recommendations based on learner behavior' },
        { title: 'Microlearning', description: 'Bite-sized learning modules for better retention' },
        { title: 'Analytics', description: 'Comprehensive progress tracking and reporting' },
        { title: 'Mobile Ready', description: 'Learn anywhere, anytime on any device' },
      ],
    },
  });
  console.log('Created product:', lms.name);

  // Create placeholder products
  const product1 = await prisma.product.upsert({
    where: { slug: 'product-1' },
    update: {},
    create: {
      slug: 'product-1',
      name: 'Product 1',
      tagline: 'Placeholder product',
      description: 'This is a placeholder product for demonstration purposes. It will be replaced with an actual product as development progresses.',
      status: 'IN_DEVELOPMENT',
    },
  });
  console.log('Created product:', product1.name);

  const product2 = await prisma.product.upsert({
    where: { slug: 'product-2' },
    update: {},
    create: {
      slug: 'product-2',
      name: 'Product 2',
      tagline: 'Placeholder product',
      description: 'This is a placeholder product for demonstration purposes. It will be replaced with an actual product as development progresses.',
      status: 'COMING_SOON',
    },
  });
  console.log('Created product:', product2.name);

  // Create sample media for LMS
  await prisma.productMedia.upsert({
    where: { id: 'lms-media-1' },
    update: {},
    create: {
      id: 'lms-media-1',
      productId: lms.id,
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=example',
      title: 'LMS Demo Video',
      order: 0,
    },
  });
  console.log('Created sample media');

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

