const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targets = [
  {
    name: 'AI Microlearning LMS',
    url: 'https://lmsnuggets.studio42.dev',
    fileBase: 'ai-microlearning-lms',
  },
  {
    name: 'Organizational AI Assistant',
    url: 'https://airepository.studio42.dev',
    fileBase: 'organizational-ai-assistant',
  },
  {
    name: 'ITSM Helpdesk',
    url: 'https://itsm.studio42.dev',
    fileBase: 'itsm-helpdesk',
  },
  {
    name: 'Restaurant Order & Delivery App',
    url: 'https://fooddelivery.studio42.dev',
    fileBase: 'restaurant-order-delivery',
  },
];

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function captureScreenshots() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  await ensureDir(imagesDir);

  const browser = await chromium.launch({ headless: true });

  for (const target of targets) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    console.log(`Navigating to ${target.url} for ${target.name}...`);
    await page.goto(target.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2000);

    const pngPath = path.join(imagesDir, `${target.fileBase}.png`);
    const jpgPath = path.join(imagesDir, `${target.fileBase}.jpg`);

    await page.screenshot({
      path: pngPath,
      fullPage: false,
      type: 'png',
    });
    console.log(`Saved PNG: ${pngPath}`);

    // Convert to optimized JPG for use on the marketing site
    await sharp(pngPath)
      .resize({ width: 1600, height: 900, fit: 'cover' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpgPath);
    console.log(`Saved JPG: ${jpgPath}`);
  }

  await browser.close();
  console.log('All screenshots captured.');
}

captureScreenshots().catch((error) => {
  console.error('Error capturing product screenshots:', error);
  process.exit(1);
});

