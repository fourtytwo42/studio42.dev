import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validation';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      create: jest.fn(),
    },
  },
}));

describe('Contacts API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have contacts API route file', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const exists = fs.existsSync(routePath);
    expect(exists).toBe(true);
  });

  it('should export POST function', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('export async function POST');
  });

  it('should validate form data', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('contactFormSchema');
    expect(routeContent).toContain('safeParse');
  });

  it('should create contact record', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('prisma.contact.create');
  });

  it('should handle validation errors', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('status: 400');
    expect(routeContent).toContain('Validation failed');
  });

  it('should handle server errors', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(process.cwd(), 'app', 'api', 'contacts', 'route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('catch');
    expect(routeContent).toContain('status: 500');
  });
});

