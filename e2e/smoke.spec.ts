import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Studio42.dev/);
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    // Basic navigation test - verify page loads
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('page has basic structure', async ({ page }) => {
    await page.goto('/');
    // Verify basic HTML structure exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

