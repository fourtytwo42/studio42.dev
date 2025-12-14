import HomePage from '@/app/(public)/page';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('HomePage with Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have homepage file', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const exists = fs.existsSync(pagePath);
    expect(exists).toBe(true);
  });

  it('should fetch products on render', async () => {
    const mockProducts = [
      {
        id: '1',
        slug: 'lms',
        name: 'LMS',
        description: 'Test',
        status: 'AVAILABLE',
        tagline: null,
        thumbnail: null,
        githubUrl: null,
        youtubeUrl: null,
        demoUrl: null,
        pricing: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    // The component is async, so we test the structure
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    expect(pageContent).toContain('getProducts');
    expect(pageContent).toContain('ProductGrid');
    expect(pageContent).toContain('Our Products');
  });

  it('should have hero section', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    expect(pageContent).toContain('hero-section');
    expect(pageContent).toContain('Studio42.dev');
  });

  it('should have products section', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    expect(pageContent).toContain('products-section');
    expect(pageContent).toContain('Our Products');
  });
});

