// const multer = require('multer');
// const path = require('path');

// // Configuration des types MIME pour les images
// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png',
// };

// // Configuration de stockage
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     // Enregistre les fichiers dans 'backend/uploads'
//     callback(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_').split('.')[0]; // Supprime les espaces et l'extension
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, `${name}_${Date.now()}.${extension}`);
//   },
// });

// // Filtrage des fichiers (optionnel)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Format de fichier non supporté. Seuls les fichiers JPEG et PNG sont acceptés.'));
//   }
// };

// // Middleware Multer
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Limite de taille à 5MB
//   },
//   fileFilter: fileFilter,
// });

// module.exports = upload;

const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
