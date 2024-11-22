const express = require('express');
const { signup, login } = require('../controllers/userController');

const router = express.Router();

// Routes pour les utilisateurs
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
