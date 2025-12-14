describe('Contact Page', () => {
  it('should have contact page file', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'contact', 'page.tsx');
    const exists = fs.existsSync(pagePath);
    expect(exists).toBe(true);
  });

  it('should have contact form component', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'contact', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('ContactForm');
  });

  it('should have hero section', () => {
    const fs = require('fs');
    const path = require('path');
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'contact', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    
    expect(pageContent).toContain('Contact Us');
  });
});

