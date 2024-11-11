const Book = require('../models/bookModel');

// Récupérer tous les livres
async function getAllBooks(req, res) {
  const books = await Book.find();
  if (!books.length) return res.status(404).json({ message: 'Aucun livre disponible.' });
  res.status(200).json(books);
}

// Récupérer un livre par ID
async function getBookById(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livre non trouvé.' });
  res.status(200).json(book);
}

// Récupérer les livres avec la meilleure note
async function getBooksByBestRating(req, res) {
  const books = await Book.find().sort({ averageRating: -1 }).limit(5);
  if (!books.length) return res.status(404).json({ message: "Aucun livre trouvé." });
  res.status(200).json(books);
}

// Créer un nouveau livre
async function createBook(req, res) {
  const bookData = JSON.parse(req.body.book);
  if (Object.values({ userId: bookData.userId, title: bookData.title, author: bookData.author, year: bookData.year, genre: bookData.genre }).includes(undefined)) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const newBook = new Book({
    ...bookData,
    ratings: bookData.ratings || [],
    averageRating: bookData.averageRating || 0,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined,
  });

  if (!newBook.imageUrl) return res.status(400).json({ error: "Une image doit être fournie." });

  const savedBook = await newBook.save();
  res.status(201).json(savedBook);
}

// Mettre à jour un livre
async function updateBook(req, res) {
  const bookData = JSON.parse(req.body.book);
  const bookToUpdate = await Book.findById(req.params.id);
  if (!bookToUpdate) return res.status(404).json({ error: 'Livre non trouvé.' });

  Object.assign(bookToUpdate, bookData);

  if (req.file) {
    bookToUpdate.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const updatedBook = await bookToUpdate.save();
  res.status(200).json(updatedBook);
}

// Supprimer un livre
async function deleteBook(req, res) {
  const bookToDelete = await Book.findByIdAndDelete(req.params.id);
  if (!bookToDelete) return res.status(404).json({ error: 'Livre non trouvé.' });
  res.status(204).send();
}

// Ajouter une note à un livre
async function rateBook(req, res) {
  const { id } = req.params;
  const { userId, rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être entre 1 et 5.' });
  }

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ error: 'Livre non trouvé.' });

  if (book.ratings.some((rate) => rate.userId === userId)) {
    return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
  }

  book.ratings.push({ userId, grade: rating });
  book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;

  const updatedBook = await book.save();
  res.status(200).json(updatedBook);
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  getBooksByBestRating,
  updateBook,
  deleteBook,
  rateBook,
};
