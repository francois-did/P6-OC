const fs = require('fs');
const path = require('path');
const Book = require('../models/bookModel');

// Fonction pour supprimer une image sur le serveur
const deleteImage = (imagePath) => {
  const fullPath = path.join(__dirname, '..', imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log('Image supprimée avec succès :', fullPath);
  } else {
    console.warn('Image introuvable pour suppression :', fullPath);
  }
};

// Récupérer tous les livres
async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    const booksWithFullImageUrl = books.map((book) => ({
      ...book._doc,
      imageUrl: `http://localhost:4000${book.imageUrl}`,
    }));
    res.status(200).json(booksWithFullImageUrl);
  } catch (err) {
    console.error('Erreur lors de la récupération des livres :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres' });
  }
}

// Récupérer un livre par ID
async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    const bookWithFullImageUrl = {
      ...book._doc,
      imageUrl: `http://localhost:4000${book.imageUrl}`,
    };

    res.status(200).json(bookWithFullImageUrl);
  } catch (err) {
    console.error('Erreur lors de la récupération du livre :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du livre' });
  }
}

// Créer un nouveau livre
async function createBook(req, res) {
  try {
    const bookData = JSON.parse(req.body.book);
    const imageUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : null;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Une image doit être fournie' });
    }

    const newBook = new Book({ ...bookData, imageUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Erreur lors de la création du livre :', err);
    res.status(500).json({ message: 'Erreur lors de la création du livre' });
  }
}

// Mettre à jour un livre
async function updateBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    if (req.file && book.imageUrl) {
      deleteImage(book.imageUrl);
    }

    Object.assign(book, req.body, { imageUrl: req.file ? `/uploads/${path.basename(req.file.path)}` : book.imageUrl });
    await book.save();
    res.status(200).json(book);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du livre :', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du livre' });
  }
}

// Supprimer un livre
async function deleteBook(req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    if (book.imageUrl) {
      deleteImage(book.imageUrl);
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression du livre :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du livre' });
  }
}

// Ajouter une note à un livre
async function rateBook(req, res) {
  try {
    const { id } = req.params;
    const { userId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5.' });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    if (book.ratings.some((rate) => rate.userId.toString() === userId)) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId, grade: rating });
    book.averageRating =
      book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;
    await book.save();

    res.status(200).json(book);
  } catch (err) {
    console.error("Erreur lors de l'ajout de la note :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout de la note." });
  }
}

// Récupérer les livres avec la meilleure note
async function getBooksByBestRating(req, res) {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(5);
    res.status(200).json(books);
  } catch (err) {
    console.error('Erreur lors de la récupération des meilleures notes :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des meilleures notes' });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  rateBook,
  getBooksByBestRating,
};
