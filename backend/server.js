require('dotenv').config({path: './backend/.env'});
const mongoose = require('mongoose');
const app = require('./app');

const port = 4000;
const mongoURI = process.env.MONGODB_URI;

// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB est connecté'))
  .catch(err => console.log('erreur de connexion à MongoDB : ', err));



app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});      
      
      


