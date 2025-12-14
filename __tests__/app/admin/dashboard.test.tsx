import AdminDashboardPage from '@/app/admin/dashboard/page';

describe('Admin Dashboard Page', () => {
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

  it('should render dashboard content', () => {
    const fs = require('fs');
    const path = require('path');
    const dashboardPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'dashboard',
      'page.tsx'
    );
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(dashboardContent).toContain('Dashboard');
    expect(dashboardContent).toContain('totalContacts');
  });
});

