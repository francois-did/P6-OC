const mongoose = require('mongoose');
const app = require('./app'); 

const port = 4000;
const mongoURI = 'mongodb://localhost:27017/mon_vieux_grimoire';

// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  
