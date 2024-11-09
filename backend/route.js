const express = require('express');
const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  rateBook,
  getBookById, // Nouvelle fonction ajoutée
} = require('./controllers/bookController');
const {
  signup,
  login,
  updateUser,
  deleteUser,
} = require('./controllers/userController');
const authenticateToken = require('./middleware/authMiddleware');
const upload = require('./middleware/imageUpload'); // Importer imageUpload du bon dossier

const router = express.Router();

// Routes pour les utilisateurs
router.post('/api/auth/signup', signup);
router.post('/api/auth/login', login);
router.put('/api/users/:id', authenticateToken, updateUser);
router.delete('/api/users/:id', authenticateToken, deleteUser);

// Routes pour les livres
router.get('/api/books', getAllBooks);
router.get('/api/books/:id', getBookById); // Route ajoutée pour obtenir un livre par ID
router.post('/api/books', authenticateToken, upload.single('image'), createBook);
router.put('/api/books/:id', authenticateToken, upload.single('image'), updateBook);
router.delete('/api/books/:id', authenticateToken, deleteBook);

// Routes pour noter un livre
router.post('/api/books/:id/rate', authenticateToken, rateBook);

module.exports = router;
