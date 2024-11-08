const Book = require('../models/bookModel');

// Récupérer tous les livres
async function getAllBooks(req, res, next) {
    const books = await Book.find();
    res.json(books);
}

// Créer un nouveau livre
async function createBook(req, res, next) {
    const { title, author, imageUrl, year, genre } = req.body;
    console.log("title: " + title);
    
    const book = new Book({ title, author, imageUrl, year, genre });

    const newBook = await book.save();
    if (newBook) {
        res.status(201).json(newBook);
    }
}

// Mettre à jour un livre
async function updateBook(req, res, next) {
    const { id } = req.params;
    const { title, author, imageUrl, year, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
        id, { title, author, imageUrl, year, genre }, { new: true }
    );

    res.json(updatedBook);
}

// Supprimer un livre
async function deleteBook(req, res, next) {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);

    res.status(204).send();
}

// Ajouter une notation à un livre et recalculer la note moyenne
async function rateBook(req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating } = req.body;

    // Vérifier la validité de la note
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "La note doit être entre 1 et 5" });
    }

    const book = await Book.findById(id);
    if (!book) {
        return res.status(404).json({ message: "Le livre n'existe pas" });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const alreadyRated = book.ratings.some(r => r.userId == userId);
    if (alreadyRated) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    // Ajouter la nouvelle note
    book.ratings.push({ userId, grade: rating });

    // Recalculer la moyenne des notes
    const totalRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    // Sauvegarder les modifications
    await book.save();
    res.status(201).json({ message: 'Notation ajoutée avec succès.', book });
}

// Exporter les fonctions pour les utiliser dans d'autres fichiers
module.exports = { getAllBooks, createBook, updateBook, deleteBook, rateBook };
