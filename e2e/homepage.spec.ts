import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage with products', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('Studio42.dev');
    await expect(page.locator('text=Premium SaaS Products')).toBeVisible();
    
    // Check products section
    await expect(page.locator('text=Our Products')).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    await page.goto('/');
    
    // Check that product grid exists
    const productGrid = page.locator('.product-grid');
    await expect(productGrid).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to product page on card click', async ({ page }) => {
    await page.goto('/');
    
    // Wait for products to load
    const productCard = page.locator('.product-card').first();
    
    if (await productCard.count() > 0) {
      await productCard.click();
      // Should navigate to product page
      await expect(page).toHaveURL(/\/products\//);
    }
  });
});

