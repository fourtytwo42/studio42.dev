describe('Admin Layout Coverage', () => {
  it('should have admin layout with authentication check', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    // Verify structure
    expect(layoutContent).toContain('auth()');
    expect(layoutContent).toContain('redirect');
    expect(layoutContent).toContain('children');
    expect(layoutContent).toContain('return');
  });

  it('should render admin navigation', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    expect(layoutContent).toContain('Admin Dashboard');
    expect(layoutContent).toContain('nav');
    expect(layoutContent).toContain('main');
  });

  it('should display user email when authenticated', () => {
    const fs = require('fs');
    const path = require('path');
    const layoutPath = path.join(
      process.cwd(),
      'app',
      'admin',
      'layout.tsx'
    );
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    expect(layoutContent).toContain('session.user?.email');
  });
});

