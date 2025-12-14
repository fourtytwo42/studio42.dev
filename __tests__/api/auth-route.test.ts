describe('Auth API Route', () => {
  it('should have auth API route file', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'auth',
      '[...nextauth]',
      'route.ts'
    );
    const exists = fs.existsSync(routePath);
    expect(exists).toBe(true);
  });

  it('should export GET and POST handlers', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'auth',
      '[...nextauth]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain('export const { GET, POST }');
    expect(routeContent).toContain('handlers');
  });

  it('should import handlers from auth lib', () => {
    const fs = require('fs');
    const path = require('path');
    const routePath = path.join(
      process.cwd(),
      'app',
      'api',
      'auth',
      '[...nextauth]',
      'route.ts'
    );
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    
    expect(routeContent).toContain("from '@/lib/auth'");
  });
});

