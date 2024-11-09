const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Modèle d'utilisateur

// Inscription d'un utilisateur
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    const newUser = await user.save();

    if (newUser) {
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
}

// Connexion d'un utilisateur
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ userId: user._id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
}

// Mise à jour d'un utilisateur
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, password },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
}

// Suppression d'un utilisateur
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
}

module.exports = { signup, login, updateUser, deleteUser };




