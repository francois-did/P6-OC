const multer = require('multer');
const path = require('path');

// Configuration de stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        // Dossier où les fichiers seront sauvegardés
        cb(null, path.join(__dirname, 'uploads'));
    },

});

// Middleware Multer avec limite de taille
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille à 5MB
    fileFilter: (req, file, cb) => {
        // Vérifie directement les types MIME acceptés
        cb(null, ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype));
    },
});

module.exports = upload;