const mongoose = require('mongoose');

// Schéma pour les notations
const ratingSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },

    grade: {
        type: Number, min: 1, max: 5, required: true
    }
});

// Schéma du livre
const bookSchema = new mongoose.Schema({
    title : {
        type: String, required: true
    },

    author : {
        type: String, required: true
    },

    imageUrl : {
        type: String, required: true
    },

    year : {
        type: Number, required: true
    },

    genre : {
        type: String, required: true  
    },

    ratings: [ratingSchema], // Tableau de notations utilisant le schéma de notation
    averageRating : {
        type: Number, default: 0
    }

});

// Middleware pour calculer averageRating avant de sauvegarder
bookSchema.pre('save', function (next) {
    if (this.ratings.length > 0) {
      const total = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
      this.averageRating = total / this.ratings.length;
    } else {
      this.averageRating = 0;
    }
    next();
  });

// Créer le modèle basé sur le schéma
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
