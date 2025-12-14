import { readFileSync } from 'fs';
import { join } from 'path';

describe('Utility Classes', () => {
  let utilitiesContent: string;

  beforeAll(() => {
    const utilitiesPath = join(process.cwd(), 'styles', 'utilities.css');
    utilitiesContent = readFileSync(utilitiesPath, 'utf-8');
  });

  describe('Container Utility', () => {
    it('should have container class', () => {
      expect(utilitiesContent).toContain('.container {');
    });

    it('should have max-width of 1400px', () => {
      expect(utilitiesContent).toContain('max-width: 1400px');
    });

    it('should have responsive padding', () => {
      expect(utilitiesContent).toContain('@media (min-width: 768px)');
      expect(utilitiesContent).toContain('@media (min-width: 1024px)');
    });

    it('should use CSS variables for spacing', () => {
      expect(utilitiesContent).toContain('var(--spacing-md)');
      expect(utilitiesContent).toContain('var(--spacing-lg)');
      expect(utilitiesContent).toContain('var(--spacing-xl)');
    });
  });

  describe('Screen Reader Only', () => {
    it('should have sr-only class', () => {
      expect(utilitiesContent).toContain('.sr-only {');
    });

    it('should hide content visually', () => {
      expect(utilitiesContent).toContain('position: absolute');
      expect(utilitiesContent).toContain('width: 1px');
      expect(utilitiesContent).toContain('height: 1px');
      expect(utilitiesContent).toContain('overflow: hidden');
      expect(utilitiesContent).toContain('clip: rect(0, 0, 0, 0)');
    });
  });

  describe('Focus Ring', () => {
    it('should have focus-ring class', () => {
      expect(utilitiesContent).toContain('.focus-ring {');
    });

    it('should use primary color for outline', () => {
      expect(utilitiesContent).toContain('outline: 2px solid var(--color-primary)');
      expect(utilitiesContent).toContain('outline-offset: 2px');
    });
  });

  describe('Text Truncation', () => {
    it('should have truncate class', () => {
      expect(utilitiesContent).toContain('.truncate {');
    });

    it('should truncate single line text', () => {
      expect(utilitiesContent).toContain('text-overflow: ellipsis');
      expect(utilitiesContent).toContain('white-space: nowrap');
    });

    it('should have line-clamp-2 class', () => {
      expect(utilitiesContent).toContain('.line-clamp-2 {');
      expect(utilitiesContent).toContain('-webkit-line-clamp: 2');
    });

    it('should have line-clamp-3 class', () => {
      expect(utilitiesContent).toContain('.line-clamp-3 {');
      expect(utilitiesContent).toContain('-webkit-line-clamp: 3');
    });
  });

  describe('CSS Best Practices', () => {
    it('should not contain Tailwind classes', () => {
      const tailwindPatterns = [
        'bg-',
        'text-',
        'p-',
        'm-',
        'flex',
        'grid',
        'rounded-',
      ];
      
      // Check that common Tailwind patterns are not used as class names
      tailwindPatterns.forEach((pattern) => {
        const classPattern = new RegExp(`\\.${pattern}[a-z-]*\\s*{`, 'g');
        const matches = utilitiesContent.match(classPattern);
        // Should not have Tailwind-style utility classes
        expect(matches).toBeNull();
      });
    });

    it('should use CSS variables', () => {
      expect(utilitiesContent).toContain('var(');
    });
  });
});

