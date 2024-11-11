// module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Ajouté pour gérer les chemins de fichiers
const routes = require('./route');

// Charger les variables d'environnement
dotenv.config();

// Créer une application Express
const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configurer CORS pour autoriser les requêtes venant du front-end
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Servir les fichiers statiques du dossier 'uploads/images' à la racine
app.use('/uploads', express.static(path.join(__dirname, '../uploads/images')));

// Utiliser les routes
app.use('/', routes);

module.exports = app;