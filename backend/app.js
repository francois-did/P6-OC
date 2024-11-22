const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');

dotenv.config();

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configurer CORS
app.use(cors());

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utiliser les routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
