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
      const content = `
${product.description}

${product.tagline ? `Tagline: ${product.tagline}` : ''}

${product.pricing ? `Pricing: ${product.pricing}` : ''}

${product.githubUrl ? `GitHub: ${product.githubUrl}` : ''}
${product.youtubeUrl ? `YouTube: ${product.youtubeUrl}` : ''}
${product.demoUrl ? `Demo: ${product.demoUrl}` : ''}

Status: ${product.status}
      `.trim();

      await upsertKnowledgeBaseEntry(
        `product-${product.id}`,
        product.name,
        content,
        'product'
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

    // Add company information
    const companyInfo = {
      id: 'company-info',
      title: 'About Studio42.dev',
      content: 'Studio42.dev is a software development company that creates innovative SaaS products. We focus on building high-quality, user-friendly solutions that solve real business problems.',
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

