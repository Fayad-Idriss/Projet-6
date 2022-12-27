const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/Sauce');


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, 
    legacyHeaders: false,
  })


//Les routes originals
router.get('/', auth ,sauceCtrl.getAllSauce);
router.post('/', limiter, auth ,multer ,sauceCtrl.createSauce);
router.get('/:id', auth ,sauceCtrl.getOneSauce);
router.put('/:id', auth ,multer ,sauceCtrl.modifySauce);
router.delete('/:id', auth ,sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.createLikes);

module.exports = router;