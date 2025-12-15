const sharp = require('sharp');
const path = require('path');

async function convertScreenshot() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'lms-thumbnail.png');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'lms-thumbnail.jpg');
  
  await sharp(inputPath)
    .resize(1200, 675, { // 16:9 aspect ratio, good for thumbnails
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ 
      quality: 85,
      progressive: true
    })
    .toFile(outputPath);
  
  console.log(`Converted screenshot to: ${outputPath}`);
}

convertScreenshot().catch(console.error);

