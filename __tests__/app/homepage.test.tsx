describe('HomePage', () => {
  it('should have homepage file', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const exists = fs.existsSync(pagePath);
    expect(exists).toBe(true);
  });

  it('should have hero section content', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('Studio42.dev');
    expect(pageContent).toContain('hero-section');
  });

  it('should have products section', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('ProductGrid');
    expect(pageContent).toContain('Our Products');
  });
});
