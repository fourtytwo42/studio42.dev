import { test, expect } from '@playwright/test';

test.describe('Full User Journey', () => {
  test('should complete full user journey from homepage to contact', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Verify homepage loads
    await expect(page).toHaveTitle(/Studio42.dev/);
    
    // Check for product grid
    const productGrid = page.locator('[data-testid="product-grid"]').or(page.locator('text=Products'));
    await expect(productGrid.first()).toBeVisible();
    
    // Navigate to contact page
    await page.goto('/contact');
    
    // Fill contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message with enough characters to pass validation.');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to confirmation page
    await expect(page).toHaveURL(/\/contact\/confirmation/);
  });

  test('should navigate to product page and view details', async ({ page }) => {
    await page.goto('/');
    
    // Find and click first product (if available)
    const productLink = page.locator('a[href^="/products/"]').first();
    
    if (await productLink.count() > 0) {
      await productLink.click();
      
      // Verify product page loads
      await expect(page).toHaveURL(/\/products\//);
      
      // Check for product name
      const productName = page.locator('h1').first();
      await expect(productName).toBeVisible();
    }
  });

  test('should test AI chat widget', async ({ page }) => {
    await page.goto('/');
    
    // Find and click chat button
    const chatButton = page.locator('button[aria-label*="chat" i]').or(page.locator('button:has-text("💬")'));
    
    if (await chatButton.count() > 0) {
      await chatButton.click();
      
      // Verify chat window opens
      await expect(page.locator('text=AI Assistant')).toBeVisible();
      
      // Type message
      const input = page.locator('input[placeholder*="message" i]');
      await input.fill('Hello');
      
      // Send message
      const sendButton = page.locator('button:has-text("Send")');
      await sendButton.click();
      
      // Wait for response (may take time)
      await page.waitForTimeout(2000);
    }
  });
});

