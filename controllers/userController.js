const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Inscription d'un utilisateur
async function signup(req, res, next){
  const {email, password} = req.body;
  const user = new User({email, password});
  const newUser = await user.save();

  if(newUser){
    res.status(201).json({message: 'utilisateur crée'});
  }
}

// Connexion d'un utilisateur
async function login(req, res, next) {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if(!user){
    return res.status(404).json({message: 'utilisateur existe pas'});
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ userId: user._id, token });
};

  //mettre à jour un utilisateur
async function updateUser(req, res, next) {
  const { id } = req.params;
  const { email, password } = req.body;

  const updatedUser = await User.findByIdAndUpdate( id, { email, password }, { new: true, runValidators: true } );
  res.json(updatedUser);
  
}

// Supprimer un utilisateur
async function deleteUser (req, res, next) {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).send();
};

module.exports = {signup,login,updateUser,deleteUser};
