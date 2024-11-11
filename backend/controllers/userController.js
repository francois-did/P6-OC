const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Modèle d'utilisateur

// Inscription d'un utilisateur
async function signup(req, res) {
  try {
    const newUser = await User.create(req.body); // Utilisation directe de `User.create`
    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
}

// Connexion d'un utilisateur
async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
}

// Mise à jour d'un utilisateur
async function updateUser(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
}

// Suppression d'un utilisateur
async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (deletedUser) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
}

module.exports = { signup, login, updateUser, deleteUser };
