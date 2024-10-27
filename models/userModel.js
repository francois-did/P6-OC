const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
  },
  password: {
    type: String,
    required: true
  }
});

// Hachage du mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparer le mot de passe lors de la connexion
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Créer le modèle basé sur le schéma
const User = mongoose.model('User', userSchema);

module.exports = User;
