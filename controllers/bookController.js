const Book = require('../models/bookModel');

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

// Créer un nouveau livre
exports.createBook = async (req, res) => {
    const { title, author, imageUrl, year, genre } = req.body;
    const book = new Book({ title, author, imageUrl, year, genre });
    const newBook = await book.save();
    res.status(201).json(newBook);
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, imageUrl, year, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
        id,
        { title, author, imageUrl, year, genre },
        { new: true }
    );
    res.json(updatedBook);
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(204).send();
};

// Ajouter une notation à un livre et recalculer la note moyenne
exports.rateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user._id; // Utilisateur authentifié
        const { rating } = req.body;

        // Vérifier la validité de la note
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'La note doit être entre 1 et 5.' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        const existingRating = book.ratings.find(r => r.userId.toString() === userId.toString());
        if (existingRating) {
            return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
        }

        // Ajouter la nouvelle note
        book.ratings.push({ userId, grade: rating });

        // Recalculer la moyenne des notes
        const totalRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
        book.averageRating = totalRatings / book.ratings.length;

        await book.save();

        res.status(201).json({ message: 'Notation ajoutée avec succès.', book });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
