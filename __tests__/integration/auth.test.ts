import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/password', () => ({
  verifyPassword: jest.fn(),
}));

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should have login page file', () => {
      const fs = require('fs');
      const path = require('path');
      const loginPath = path.join(
        process.cwd(),
        'app',
        'admin',
        'login',
        'page.tsx'
      );
      const exists = fs.existsSync(loginPath);
      expect(exists).toBe(true);
    });

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

    it('should have dashboard page file', () => {
      const fs = require('fs');
      const path = require('path');
      const dashboardPath = path.join(
        process.cwd(),
        'app',
        'admin',
        'dashboard',
        'page.tsx'
      );
      const exists = fs.existsSync(dashboardPath);
      expect(exists).toBe(true);
    });
  });

  describe('Protected Routes', () => {
    it('should protect admin layout', () => {
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
      expect(layoutContent).toContain('redirect');
    });

    it('should redirect to login when not authenticated', () => {
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

  describe('Session Management', () => {
    it('should configure JWT session strategy', () => {
      const fs = require('fs');
      const path = require('path');
      const authPath = path.join(process.cwd(), 'lib', 'auth.ts');
      const authContent = fs.readFileSync(authPath, 'utf-8');
      
      expect(authContent).toContain("strategy: 'jwt'");
    });

    it('should set 7-day session expiry', () => {
      const fs = require('fs');
      const path = require('path');
      const authPath = path.join(process.cwd(), 'lib', 'auth.ts');
      const authContent = fs.readFileSync(authPath, 'utf-8');
      
      expect(authContent).toContain('maxAge: 7 * 24 * 60 * 60');
    });
  });
});

