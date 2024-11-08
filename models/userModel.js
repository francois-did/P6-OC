const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
  email: {
    type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
  },

  password: {
    type: String, required: true
  }

});

// Middleware pour hacher le mot de passe avant de le sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Créer le modèle basé sur le schéma
const User = mongoose.model('User', userSchema);

module.exports = User;




