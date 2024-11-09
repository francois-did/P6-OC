// // Importer les modules nécessaires
// require('dotenv').config({ path: './backend/.env' });

// const mongoose = require('mongoose');
// const app = require('./app');

// const port = 4000;
// const mongoURI = process.env.MONGODB_URI; 

// // Connexion à MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log('MongoDB connected');

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Importer les modules nécessaires
require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const app = require('./app');

const port = 4000;
const mongoURI = process.env.MONGODB_URI;

// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


