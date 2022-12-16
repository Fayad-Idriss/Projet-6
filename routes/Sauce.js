const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/Sauce');


//Les routes originals
router.get('/', auth ,sauceCtrl.getAllSauce);
router.post('/', auth ,multer ,sauceCtrl.createSauce);
router.get('/:id', auth ,sauceCtrl.getOneSauce);
router.put('/:id', auth ,multer ,sauceCtrl.modifySauce);
router.delete('/:id', auth ,sauceCtrl.deleteSauce);
router.post('/', auth, sauceCtrl.createLikes);

module.exports = router;