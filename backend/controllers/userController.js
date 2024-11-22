const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Inscription d'un utilisateur
async function signup(req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId: newUser._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
}

// Connexion d'un utilisateur
async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Identifiants invalides' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ userId: user._id, token });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la connexion' });
  }
}

module.exports = { signup, login };
