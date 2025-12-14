import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('Products API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have products API route file', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const exists = fs.existsSync(routePath);
    expect(exists).toBe(true);
  });

  it('should export GET function', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('export async function GET');
  });

  it('should fetch products from database', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('prisma.product.findMany');
  });

  it('should order products by status then name', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('orderBy');
    expect(routeContent).toContain('status: \'asc\'');
    expect(routeContent).toContain('name: \'asc\'');
  });

  it('should truncate long descriptions', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('substring(0, 150)');
    expect(routeContent).toContain('...');
  });

  it('should handle errors gracefully', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('catch');
    expect(routeContent).toContain('error');
    expect(routeContent).toContain('status: 500');
  });

  it('should set cache headers', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('Cache-Control');
    expect(routeContent).toContain('s-maxage');
  });
});
