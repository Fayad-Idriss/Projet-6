//Les technologie requi importer pour le projet 
const express = require('express');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');

const SauceRoutes = require('./routes/Sauce');
const userRoutes = require('./routes/User');



//La base de donnée
const password = "HAuXcmofW7LSBtt3"

mongoose.connect(`mongodb+srv://majinkizaru:${password}@cluster1.uxodmwr.mongodb.net/test`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();



//Le morceau de code qui vont permettre de retirer la sécurité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyparser.json());// Ce qui permet a toutes les requets JSON d'être intercepter



//Les routes 
app.use('/api/Sauce', SauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;