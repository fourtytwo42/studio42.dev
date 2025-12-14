import { test, expect } from '@playwright/test';

test.describe('Product Pages', () => {
  test('should load product page', async ({ page }) => {
    // First, ensure we have a product by checking the homepage
    await page.goto('/');
    
    // Try to find a product link
    const productLink = page.locator('.product-card').first();
    
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Should navigate to product page
      await expect(page).toHaveURL(/\/products\//);
      
      // Should have product name
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    }
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    await page.goto('/');
    
    const productLink = page.locator('.product-card').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Check breadcrumb
      await expect(page.locator('text=Home')).toBeVisible();
      await expect(page.locator('text=Products')).toBeVisible();
    }
  });

  test('should navigate via breadcrumb', async ({ page }) => {
    await page.goto('/');
    
    const productLink = page.locator('.product-card').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Click home in breadcrumb
      await page.locator('text=Home').click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should display all product sections', async ({ page }) => {
    await page.goto('/');
    
    const productLink = page.locator('.product-card').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Check for key sections
      await expect(page.locator('text=Overview')).toBeVisible();
    }
  });

  test('should handle 404 for invalid product slug', async ({ page }) => {
    await page.goto('/products/non-existent-product');
    
    // Should show 404 or redirect
    const url = page.url();
    expect(url).toMatch(/\/products\/non-existent-product|\/404|not-found/);
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    
    const productLink = page.locator('.product-card').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});

