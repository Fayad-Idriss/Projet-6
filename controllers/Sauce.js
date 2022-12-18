const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId; // on retire le userId pour pas qu'une personne mal intentionner puisse se faire passer pour quelqu'un dautre
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // l'url crée 
      like: 0, 
      dislike: 0,
      usersLiked: [],
      usersDisliked: [], 

  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(400).json({error}))
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId; //Pour eviter que qu'une personne modifie sont object avec le nom de quelqu'un dautre
  Sauce.findOne({_id: req.params.id}) // recuperer l'object en base de donnée 
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) { // Le cas ou une personne essai de modifier un fichier qui n'est pas le sien 
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.createLikes = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id)

    console.log(sauce);
    let userId = req.body.userId
    let like = req.body.like
    let usersLiked = sauce.usersLiked
    let usersDisliked = sauce.usersDisliked

    console.log(usersLiked)

    switch (like) {
      case 1: 
      if ((usersLiked === usersLiked.includes(userId))) {
        return usersLiked;
      } else {
        usersLiked.addToset(userId)
      }
       usersDisliked = usersDisliked.filter((el) => el !== req.userId)
       break
       case -1:
        if ((usersDisliked === usersDisliked.includes(userId))){
          return usersDisliked
        } else {
          usersDisliked.addToset(userId)
        }
        usersLiked = usersLiked.filter((el) => el !== userId)
        break
        case 0:
        usersLiked = usersLiked.filter((el) => el !== userId)
        usersDisliked = usersDisliked.filter((el) => el !== userId)
        break
        default:
          throw res.status(400).json({error})
    }
    console.log(usersLiked)

    const likes = usersLiked.length
    const dislikes = usersDisliked.length

    await sauce.updateOne({
      usersLiked: usersLiked,
      usersDisliked: usersDisliked,
      likes: likes,
      dislikes: dislikes,
    })

    res.status(200).send({ message: "Victoire"})
    } catch(error){
      res.status(400).json({ error})
      console.log(error)
    }
}