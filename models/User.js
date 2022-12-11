const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Le schema imposé pour l'inscription
const userSchema = mongoose.Schema({ 
  email: { type: String, required: true, unique: true }, //Le unique permet de ne pas pouvoir s'inscrire plusieurs fois avec la meme adress
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);