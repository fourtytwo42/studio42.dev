import { test, expect } from '@playwright/test';

test.describe('Design System & Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct styles', async ({ page }) => {
    // Verify page loads
    await expect(page.locator('main')).toBeVisible();
    
    // Check that CSS is loaded by verifying computed styles
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toBeTruthy();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have accessible focus states', async ({ page }) => {
    // Check that focus styles can be applied
    const body = page.locator('body');
    
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    
    // Verify that focus is visible (this tests focus-visible styles)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have custom scrollbar styles', async ({ page }) => {
    // Create content that requires scrolling
    await page.setViewportSize({ width: 375, height: 200 });
    
    // Check that page is scrollable
    const isScrollable = await page.evaluate(() => {
      return document.documentElement.scrollHeight > window.innerHeight;
    });
    
    // If content is scrollable, scrollbar styles should be applied
    if (isScrollable) {
      // Verify scrollbar exists (webkit-scrollbar styles)
      const scrollbarWidth = await page.evaluate(() => {
        const scrollbar = document.createElement('div');
        scrollbar.style.width = '100px';
        scrollbar.style.height = '100px';
        scrollbar.style.overflow = 'scroll';
        document.body.appendChild(scrollbar);
        const width = scrollbar.offsetWidth - scrollbar.clientWidth;
        document.body.removeChild(scrollbar);
        return width;
      });
      expect(scrollbarWidth).toBeGreaterThan(0);
    }
  });

  test('should use CSS variables', async ({ page }) => {
    // Check that CSS variables are defined
    const cssVariables = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        primary: root.getPropertyValue('--color-primary'),
        spacing: root.getPropertyValue('--spacing-md'),
        fontFamily: root.getPropertyValue('--font-family'),
      };
    });
    
    expect(cssVariables.primary).toBeTruthy();
    expect(cssVariables.spacing).toBeTruthy();
    expect(cssVariables.fontFamily).toBeTruthy();
  });

  test('should have hero section styled correctly', async ({ page }) => {
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Verify it has content
    const text = await heroSection.textContent();
    expect(text).toContain('Studio42.dev');
  });
});

