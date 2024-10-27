const mongoose = require('mongoose');

// Schéma pour les notations
const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur qui a donné la note
        ref: 'User',
        required: true
    },
    grade: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
});

// Schéma du livre
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    ratings: [ratingSchema], // Tableau de notations utilisant le schéma de notation
    averageRating: {
        type: Number,
        default: 0
    }
});

// Créer le modèle basé sur le schéma
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
