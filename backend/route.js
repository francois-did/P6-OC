const express = require('express');

// Importation des fonctions du bookControllers
const { getAllBooks, createBook, updateBook, deleteBook, rateBook, getBookById, getBooksByBestRating,} = require('./controllers/bookController');

// Importation des fonctions du userControllers
const { signup, login, updateUser, deleteUser,} = require('./controllers/userController');

// Middleware d'authentification
const authenticateToken = require('./middleware/authMiddleware');

// Middleware pour l'upload d'images
const upload = require('./middleware/imageUpload')

const router = express.Router();

// Routes pour les utilisateurs
router.post('/api/auth/signup', signup); // Route pour l'inscription
router.post('/api/auth/login/', login); // Route pour la connexion
router.put('/api/users/:id', authenticateToken, updateUser); // Route pour mettre à jour un user
router.delete('/api/users/:id', authenticateToken, deleteUser); // Route pour supprimer un user

// Routes pour les livres
router.get('/api/books/bestrating', getBooksByBestRating) // Livres avec meilleurs notes
router.get('/api/books', getAllBooks); // Récupérer tous les livres
router.get('/api/books/:id', getBookById) // Récupérer un livre par son ID
router.post('/api/books', authenticateToken, upload.single('image'), createBook); // Créer un livre
router.put('/api/books/:id', authenticateToken, upload.single('image'), updateBook); // Mettre à jour un livre
router.delete('/api/books/:id', authenticateToken, deleteBook) // Supprimer un livre

// Routes pour noter un livre
router.post('/api/books/:id/rate', authenticateToken, rateBook)

module.exports = router;

  


