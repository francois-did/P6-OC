const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  rateBook,
  getBooksByBestRating,
} = require('../controllers/bookController'); // Assure-toi que ces fonctions existent

const authenticateToken = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/imageUpload');

const router = express.Router();

// Routes pour les livres
router.get('/bestrating', getBooksByBestRating); // Doit être une fonction existante
router.get('/', getAllBooks); // Vérifie si getAllBooks est bien défini dans le contrôleur
router.get('/:id', getBookById); // Idem
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  processImage,
  createBook
);
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  processImage,
  updateBook
);
router.delete('/:id', authenticateToken, deleteBook);
router.post('/:id/rating', authenticateToken, rateBook);

module.exports = router;
