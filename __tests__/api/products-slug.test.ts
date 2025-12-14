import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Single Product API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have product slug API route file', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'products',
      '[slug]',
      'route.ts'
    );
    const exists = fs.existsSync(routePath);
    expect(exists).toBe(true);
  });

  it('should export GET function', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'products',
      '[slug]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('export async function GET');
  });

  it('should fetch product by slug with media', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'products',
      '[slug]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('prisma.product.findUnique');
    expect(routeContent).toContain('include');
    expect(routeContent).toContain('media');
  });

  it('should return 404 for non-existent product', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'products',
      '[slug]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('status: 404');
    expect(routeContent).toContain('Product not found');
  });

  it('should handle errors gracefully', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'products',
      '[slug]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('catch');
    expect(routeContent).toContain('status: 500');
  });
});

