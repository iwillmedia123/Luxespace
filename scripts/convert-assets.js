const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function convertScrollAnimationFrames() {
  const directory = path.join(__dirname, "../public/assets/scroll-animation");
  if (!fs.existsSync(directory)) {
    console.log(`Scroll animation directory not found at: ${directory}`);
    return;
  }

  console.log("Starting scroll animation frames WebP conversion...");
  const files = fs.readdirSync(directory);
  const jpgFiles = files.filter(f => f.startsWith("Temp-frame_") && f.endsWith(".jpg"));

  console.log(`Found ${jpgFiles.length} frames to convert.`);

  let successCount = 0;
  for (const file of jpgFiles) {
    const inputPath = path.join(directory, file);
    const outputName = file.replace(".jpg", ".webp");
    const outputPath = path.join(directory, outputName);

    try {
      // Compress with 80% quality which yields massive savings while retaining premium details
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

      fs.unlinkSync(inputPath); // Delete the original jpg
      successCount++;
    } catch (err) {
      console.error(`Failed to convert frame ${file}:`, err);
    }
  }

  console.log(`Successfully converted ${successCount}/${jpgFiles.length} scroll animation frames to WebP.`);
}

async function convertStaticRenders() {
  const directory = path.join(__dirname, "../public/assets");
  const filesToConvert = [
    "villa_render.png",
    "penthouse_render.png",
    "apartment_render.png",
    "palm_jumeirah_render.png"
  ];

  console.log("Starting static property renders WebP conversion...");

  for (const file of filesToConvert) {
    const inputPath = path.join(directory, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Static file not found: ${file}, skipping.`);
      continue;
    }

    const outputName = file.replace(".png", ".webp");
    const outputPath = path.join(directory, outputName);

    try {
      await sharp(inputPath)
        .webp({ quality: 85 }) // slightly higher quality for main renders
        .toFile(outputPath);

      fs.unlinkSync(inputPath); // Delete original png
      console.log(`Successfully converted ${file} -> ${outputName}`);
    } catch (err) {
      console.error(`Failed to convert static render ${file}:`, err);
    }
  }
}

async function run() {
  try {
    await convertScrollAnimationFrames();
    await convertStaticRenders();
    console.log("WebP asset conversion task completed successfully!");
  } catch (err) {
    console.error("Critical error in WebP asset conversion:", err);
  }
}

run();
