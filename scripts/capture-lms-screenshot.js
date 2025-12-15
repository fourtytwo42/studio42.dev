const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size for a good thumbnail
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the LMS demo
  await page.goto('https://lms.studio42.dev', { waitUntil: 'networkidle' });
  
  // Wait a bit for any animations or dynamic content
  await page.waitForTimeout(2000);
  
  // Take screenshot
  const screenshotPath = path.join(__dirname, '..', 'public', 'images', 'lms-thumbnail.png');
  await page.screenshot({ 
    path: screenshotPath,
    fullPage: false, // Just the viewport for thumbnail
    type: 'png'
  });
  
  await browser.close();
  console.log(`Screenshot saved to: ${screenshotPath}`);
}

captureScreenshot().catch(console.error);

