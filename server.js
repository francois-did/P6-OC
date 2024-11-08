// Importer les modules nécessaires
require('dotenv').config(); 
const mongoose = require('mongoose');
const app = require('./app');

const port = 4000;
const mongoURI = process.env.MONGODB_URI; 

// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MongoDB connected');

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
