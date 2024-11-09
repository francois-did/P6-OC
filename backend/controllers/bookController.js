const Book = require('../models/bookModel');

// Créer un nouveau livre
async function createBook(req, res) {
  try {
    // Parse le contenu JSON transmis dans "book" (données du formulaire)
    const bookData = JSON.parse(req.body.book);
    const { userId, title, author, year, genre, ratings, averageRating } = bookData;

    // Vérifie que tous les champs obligatoires sont présents
    if (!userId || !title || !author || !year || !genre) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Crée une nouvelle instance de livre
    const newBook = new Book({
      userId,
      title,
      author,
      year,
      genre,
      ratings: ratings || [], // Définit une valeur par défaut si non fournie
      averageRating: averageRating || 0, // Définit une valeur par défaut si non fournie
    });

    // Ajoute l'image si elle est présente
    if (req.file) {
      newBook.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: "Une image doit être fournie." });
    }

    // Sauvegarde dans la base de données
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Erreur lors de la création d\'un livre :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Récupérer tous les livres
async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Mettre à jour un livre
async function updateBook(req, res) {
  try {
    const bookData = req.body;
    const { id } = req.params;

    // Recherche le livre par ID
    const bookToUpdate = await Book.findById(id);
    if (!bookToUpdate) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    // Met à jour les données
    bookToUpdate.title = bookData.title || bookToUpdate.title;
    bookToUpdate.author = bookData.author || bookToUpdate.author;
    bookToUpdate.year = bookData.year || bookToUpdate.year;
    bookToUpdate.genre = bookData.genre || bookToUpdate.genre;

    if (req.file) {
      bookToUpdate.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedBook = await bookToUpdate.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du livre :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Supprimer un livre
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const bookToDelete = await Book.findByIdAndDelete(id);

    if (!bookToDelete) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du livre :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Ajouter une note à un livre
async function rateBook(req, res) {
  try {
    const { id } = req.params;
    const { userId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être entre 1 et 5.' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    const alreadyRated = book.ratings.some((rate) => rate.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId, grade: rating });

    // Recalculer la note moyenne
    const totalRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une note :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  rateBook,
};
