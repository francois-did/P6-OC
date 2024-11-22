const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge'), false);
  }
};

const upload = multer({ storage, fileFilter });

const processImage = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  try {
    const outputDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputFilename = `${Date.now()}-${req.file.originalname.replace(
      /[^a-zA-Z0-9]/g,
      '_'
    )}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    await sharp(req.file.buffer).resize(800).toFile(outputPath);

    req.file.path = `/uploads/${outputFilename}`;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImage };
