const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./route');
const cors = require('cors');
const mongoose = require('mongoose');

// Charger les variables d'environnement
dotenv.config();

// Créer une application Express
const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Connexion à la base de données
mongoose.connect('mongodb+srv://FRANCOIS:deathnote94370@p6oc.ukd9e.mongodb.net/sample_mflix?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Configurer CORS pour autoriser les requêtes venant du front-end
app.use(cors({
  // AccessControlAllowOrigin: 'http://localhost:3000',
  AccessControlAllowOrigin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route de test de connexion pour MongoDB Atlas
app.get('/test-connection', async (req, res) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  res.json({
    message: 'Connected to MongoDB Atlas',
    collections: collections.map(col => col.name) 
  });
});

app.use(cors());


// Utiliser les routes
app.use('/', routes);

module.exports = app;

