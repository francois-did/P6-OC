const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./route'); 

// Charger les variables d'environnement
dotenv.config();

// Créer une application Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Utiliser les routes
app.use('/', routes);

module.exports = app;
