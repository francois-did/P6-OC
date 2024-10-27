const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Inscription d'un utilisateur
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  const newUser = await user.save();
  res.status(201).json({ message: 'User created' });
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ userId: user._id, token });
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { email, password },
    { new: true }
  );
  res.json(updatedUser);
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).send();
};
