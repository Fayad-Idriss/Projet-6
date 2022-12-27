const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();
const password = require("../middleware/password")


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, 
    legacyHeaders: false,
  })


const userCtrl = require('../controllers/user');

router.post('/signup', limiter, password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;