describe('Style Integration Tests', () => {
  describe('Global Styles', () => {
    it('should have styles imported in layout', () => {
      const fs = require('fs');
      const path = require('path');
      const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      
      expect(layoutContent).toContain("import '../styles/globals.css'");
      expect(layoutContent).toContain("import '../styles/utilities.css'");
      expect(layoutContent).toContain("import '../styles/animations.css'");
    });
  });

  describe('CSS Variables', () => {
    it('should have design tokens imported', () => {
      const fs = require('fs');
      const path = require('path');
      const globalsPath = path.join(process.cwd(), 'styles', 'globals.css');
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      expect(globalsContent).toContain("@import './design-tokens.css'");
    });

    it('should have utilities file available', () => {
      const fs = require('fs');
      const path = require('path');
      const utilitiesPath = path.join(process.cwd(), 'styles', 'utilities.css');
      const exists = fs.existsSync(utilitiesPath);
      expect(exists).toBe(true);
    });
  });

  describe('Layout Integration', () => {
    it('should import styles in root layout', () => {
      const fs = require('fs');
      const path = require('path');
      const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      
      expect(layoutContent).toContain("'../styles/globals.css'");
      expect(layoutContent).toContain("'../styles/utilities.css'");
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive breakpoints in utilities', () => {
      const fs = require('fs');
      const path = require('path');
      const utilitiesPath = path.join(process.cwd(), 'styles', 'utilities.css');
      const utilitiesContent = fs.readFileSync(utilitiesPath, 'utf-8');
      
      expect(utilitiesContent).toContain('@media (min-width: 768px)');
      expect(utilitiesContent).toContain('@media (min-width: 1024px)');
    });
  });

  describe('Accessibility', () => {
    it('should have focus styles defined', () => {
      const fs = require('fs');
      const path = require('path');
      const globalsPath = path.join(process.cwd(), 'styles', 'globals.css');
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      expect(globalsContent).toContain(':focus-visible');
      expect(globalsContent).toContain('outline');
    });

    it('should have screen reader utility', () => {
      const fs = require('fs');
      const path = require('path');
      const utilitiesPath = path.join(process.cwd(), 'styles', 'utilities.css');
      const utilitiesContent = fs.readFileSync(utilitiesPath, 'utf-8');
      
      expect(utilitiesContent).toContain('.sr-only');
    });
  });
});
