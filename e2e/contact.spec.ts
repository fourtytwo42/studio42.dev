import { test, expect } from '@playwright/test';

test.describe('Contact System', () => {
  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('h1')).toContainText('Contact Us');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should pre-populate product from URL parameter', async ({ page }) => {
    await page.goto('/contact?source=lms');
    
    // Wait for form to load
    await page.waitForSelector('input[name="product"]');
    
    const productInput = page.locator('input[name="product"]');
    const value = await productInput.inputValue();
    expect(value).toBe('lms');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contact');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.locator('text=/name must be/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact');
    
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message with enough characters to pass validation.');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should redirect to confirmation page
    await expect(page).toHaveURL(/\/contact\/confirmation/);
  });

  test('should display confirmation page', async ({ page }) => {
    await page.goto('/contact/confirmation');
    
    await expect(page.locator('text=/thank you/i')).toBeVisible();
    await expect(page.locator('text=/we\'ve received/i')).toBeVisible();
  });

  test('should navigate from confirmation to home', async ({ page }) => {
    await page.goto('/contact/confirmation');
    
    const homeLink = page.locator('text=Back to Home');
    await homeLink.click();
    
    await expect(page).toHaveURL('/');
  });
});

