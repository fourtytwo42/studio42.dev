import { readFileSync } from 'fs';
import { join } from 'path';

describe('Design Tokens', () => {
  let tokensContent: string;

  beforeAll(() => {
    const tokensPath = join(process.cwd(), 'styles', 'design-tokens.css');
    tokensContent = readFileSync(tokensPath, 'utf-8');
  });

  describe('Color Tokens', () => {
    it('should have primary color tokens', () => {
      expect(tokensContent).toContain('--color-primary:');
      expect(tokensContent).toContain('--color-primary-dark:');
      expect(tokensContent).toContain('--color-primary-light:');
    });

    it('should have secondary color tokens', () => {
      expect(tokensContent).toContain('--color-secondary:');
      expect(tokensContent).toContain('--color-secondary-dark:');
    });

    it('should have text color tokens', () => {
      expect(tokensContent).toContain('--color-text-primary:');
      expect(tokensContent).toContain('--color-text-secondary:');
      expect(tokensContent).toContain('--color-text-tertiary:');
    });

    it('should have background color tokens', () => {
      expect(tokensContent).toContain('--color-background:');
      expect(tokensContent).toContain('--color-background-secondary:');
      expect(tokensContent).toContain('--color-background-tertiary:');
    });

    it('should have status color tokens', () => {
      expect(tokensContent).toContain('--color-status-available:');
      expect(tokensContent).toContain('--color-status-available-bg:');
      expect(tokensContent).toContain('--color-status-coming-soon:');
      expect(tokensContent).toContain('--color-status-coming-soon-bg:');
      expect(tokensContent).toContain('--color-status-in-development:');
      expect(tokensContent).toContain('--color-status-in-development-bg:');
    });

    it('should have semantic color tokens', () => {
      expect(tokensContent).toContain('--color-success:');
      expect(tokensContent).toContain('--color-warning:');
      expect(tokensContent).toContain('--color-error:');
      expect(tokensContent).toContain('--color-info:');
    });
  });

  describe('Spacing Tokens', () => {
    it('should have all spacing tokens', () => {
      const spacingTokens = [
        '--spacing-xs:',
        '--spacing-sm:',
        '--spacing-md:',
        '--spacing-lg:',
        '--spacing-xl:',
        '--spacing-2xl:',
        '--spacing-3xl:',
        '--spacing-4xl:',
        '--spacing-5xl:',
      ];

      spacingTokens.forEach((token) => {
        expect(tokensContent).toContain(token);
      });
    });

    it('should use 4px base unit', () => {
      expect(tokensContent).toContain('--spacing-xs: 4px');
    });
  });

  describe('Typography Tokens', () => {
    it('should have font family tokens', () => {
      expect(tokensContent).toContain('--font-family:');
      expect(tokensContent).toContain('--font-family-mono:');
    });

    it('should have font size tokens', () => {
      const fontSizes = [
        '--font-size-xs:',
        '--font-size-sm:',
        '--font-size-base:',
        '--font-size-lg:',
        '--font-size-xl:',
        '--font-size-2xl:',
        '--font-size-3xl:',
        '--font-size-4xl:',
        '--font-size-5xl:',
        '--font-size-6xl:',
      ];

      fontSizes.forEach((token) => {
        expect(tokensContent).toContain(token);
      });
    });

    it('should have font weight tokens', () => {
      const fontWeights = [
        '--font-weight-normal:',
        '--font-weight-medium:',
        '--font-weight-semibold:',
        '--font-weight-bold:',
        '--font-weight-extrabold:',
      ];

      fontWeights.forEach((token) => {
        expect(tokensContent).toContain(token);
      });
    });

    it('should have line height tokens', () => {
      expect(tokensContent).toContain('--line-height-tight:');
      expect(tokensContent).toContain('--line-height-normal:');
      expect(tokensContent).toContain('--line-height-relaxed:');
      expect(tokensContent).toContain('--line-height-loose:');
    });
  });

  describe('Shadow Tokens', () => {
    it('should have all shadow tokens', () => {
      expect(tokensContent).toContain('--shadow-sm:');
      expect(tokensContent).toContain('--shadow-md:');
      expect(tokensContent).toContain('--shadow-lg:');
      expect(tokensContent).toContain('--shadow-xl:');
      expect(tokensContent).toContain('--shadow-card:');
      expect(tokensContent).toContain('--shadow-card-hover:');
    });
  });

  describe('Border Radius Tokens', () => {
    it('should have all radius tokens', () => {
      expect(tokensContent).toContain('--radius-sm:');
      expect(tokensContent).toContain('--radius-md:');
      expect(tokensContent).toContain('--radius-lg:');
      expect(tokensContent).toContain('--radius-xl:');
      expect(tokensContent).toContain('--radius-full:');
    });
  });

  describe('Transition Tokens', () => {
    it('should have all transition tokens', () => {
      expect(tokensContent).toContain('--transition-fast:');
      expect(tokensContent).toContain('--transition-base:');
      expect(tokensContent).toContain('--transition-slow:');
      expect(tokensContent).toContain('--transition-bounce:');
    });
  });

  describe('Z-Index Tokens', () => {
    it('should have all z-index tokens', () => {
      expect(tokensContent).toContain('--z-dropdown:');
      expect(tokensContent).toContain('--z-sticky:');
      expect(tokensContent).toContain('--z-fixed:');
      expect(tokensContent).toContain('--z-modal-backdrop:');
      expect(tokensContent).toContain('--z-modal:');
      expect(tokensContent).toContain('--z-popover:');
      expect(tokensContent).toContain('--z-tooltip:');
      expect(tokensContent).toContain('--z-chat-widget:');
    });
  });

  describe('CSS Variable Format', () => {
    it('should use :root selector', () => {
      expect(tokensContent).toContain(':root {');
    });

    it('should have valid CSS variable syntax', () => {
      // Check that variables are defined with -- prefix
      const variablePattern = /--[a-z-]+:\s*[^;]+;/g;
      const matches = tokensContent.match(variablePattern);
      expect(matches?.length).toBeGreaterThan(50); // Should have many variables
    });
  });
});

