const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  // Définir le répertoire où les fichiers seront stockés
  destination: (req, file, cb) => {
    cb(null, path.join('uploads', 'images'));
  },
  
});

// Format acceptés
const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true); // Fichier accepté
  } else {
    cb(new Error('Format de fichier non pris en charge.'), false); 
  }
};

  const upload = multer({ storage, fileFilter });

module.exports = upload;