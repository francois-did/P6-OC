require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGODB_URI;

// Connexion à MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connecté avec succès'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
