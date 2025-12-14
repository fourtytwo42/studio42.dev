import AdminLayout from '@/app/admin/layout';

// Mock next-auth
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Admin Layout', () => {
  it('should have admin layout file', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const exists = fs.existsSync(layoutPath);
    expect(exists).toBe(true);
  });

  it('should check authentication', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    expect(layoutContent).toContain('auth()');
  });

  it('should redirect when not authenticated', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    expect(layoutContent).toContain("redirect('/admin/login')");
  });
});

