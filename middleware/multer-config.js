const multer = require('multer');

const MIME_TYPES = { //dictionnaire d'extension de fichier entrant 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; //Creation d'extension de fichier
    callback(null, name + Date.now() + '.' + extension); // Date.now pour le rendre unique 
  }
});

module.exports = multer({storage: storage}).single('image'); // .single parce que c'est un fichier unique
