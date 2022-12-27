const passwordValidator = require("password-validator")

let passwordSchema = new passwordValidator()


passwordSchema
.is().min(3)                                    // Minimum  3
.is().max(15)                                   // Maximum  15
.has().uppercase(1)                              // Majuscule
.has().lowercase()                              // Minuscule
.has().digits(2)                                // 2 chiffre
.has().not().spaces()                           // sans espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist 


module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
      next()
    }else{
        return res.status(400).json({error : "Le mot de passe n'est pas assez fort" + passwordSchema.validate("req.body.password", {list: true}) })
    }
}