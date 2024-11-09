const multer = require('multer');
const path = require('path');

// Configuration de stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dossier où les fichiers seront sauvegardés
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        // Nom unique pour chaque fichier
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '_' + uniqueSuffix + fileExtension);
    },
});

// Filtrage des fichiers (optionnel)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non supporté. Seuls les fichiers JPEG et PNG sont acceptés.'));
    }
};

// Middleware Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de taille à 5MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
