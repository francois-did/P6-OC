const express = require('express');
const { getAllBooks, createBook, updateBook, deleteBook, rateBook } = require('./controllers/bookController');
const { signup, login, updateUser, deleteUser } = require('./controllers/userController');
const jwt = require('jsonwebtoken');
const upload = require('./imageUpload'); // Import Multer

const router = express.Router();

// Middleware d'authentification pour protéger les routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
}

// Routes pour les livres
router.get('/api/books', getAllBooks);
router.post('/api/books', authenticateToken, createBook);
router.put('/api/books/:id', authenticateToken, updateBook);
router.delete('/api/books/:id', authenticateToken, deleteBook);

// Route pour l'upload d'image d'un livre
router.post('/api/books/upload', authenticateToken, upload.single('image'), (req, res) => {
    try {
        res.status(201).json({
            message: 'Image téléchargée avec succès!',
            filePath: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour noter un livre
router.post('/api/books/:id/rate', authenticateToken, rateBook);

// Routes pour les utilisateurs
router.post('/api/auth/signup', signup);
router.post('/api/auth/login', login);
router.put('/api/users/:id', authenticateToken, updateUser);
router.delete('/api/users/:id', authenticateToken, deleteUser);

module.exports = router;
