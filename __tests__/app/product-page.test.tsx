describe('Product Page', () => {
  it('should have product page file', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(
      process.cwd(),
      'app',
      '(public)',
      'products',
      '[slug]',
      'page.tsx'
    );
    const exists = fs.existsSync(pagePath);
    expect(exists).toBe(true);
  });

  it('should have generateMetadata function', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(
      process.cwd(),
      'app',
      '(public)',
      'products',
      '[slug]',
      'page.tsx'
    );
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('generateMetadata');
  });

  it('should include all product components', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(
      process.cwd(),
      'app',
      '(public)',
      'products',
      '[slug]',
      'page.tsx'
    );
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('ProductHero');
    expect(pageContent).toContain('ProductOverview');
    expect(pageContent).toContain('ProductFeatures');
    expect(pageContent).toContain('ProductMedia');
    expect(pageContent).toContain('ProductLinks');
    expect(pageContent).toContain('ProductPricing');
    expect(pageContent).toContain('ProductCTA');
    expect(pageContent).toContain('Breadcrumb');
  });

  it('should handle 404 for non-existent products', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(
      process.cwd(),
      'app',
      '(public)',
      'products',
      '[slug]',
      'page.tsx'
    );
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('notFound');
  });
});

