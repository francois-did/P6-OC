const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  rateBook,
  getBooksByBestRating,
} = require('../controllers/bookController'); 

const authenticateToken = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/imageUpload');

const router = express.Router();

// Routes pour les livres
router.get('/bestrating', getBooksByBestRating);
router.get('/', getAllBooks); 
router.get('/:id', getBookById); 
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
