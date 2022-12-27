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

  let sauceObject = {}
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  ) : (
    sauceobject = {...req.body}
  )
  
  Sauce.updateOne(
    {
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    }
  )  .then(() => res.status(200).json({message : 'sauce modifier'}))
     .catch((error) => res.status(400).json({error}))
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

exports.createLikes = (req, res, next) => {
  switch (req.body.like){
    case 1: 
    Sauce.updateOne({ _id: req.params.id}, {$push:{usersLiked:req.body.userId}, $inc:{likes: +1}}) // On recherche l'id et on push le tableau avec un incrementation de 1
    .then(() => { res.status(200).json({message: 'like !'})})
    .catch(error => res.status(401).json({ error }));
    break
    case 0: 
        Sauce.findOne({ _id: req.params.id })
           .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)){
               Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { like: -1}})
                  .then(() => { res.status(200).json({message: 'like annulé !'})})
                  .catch(error => res.status(401).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.body.userId)){
                 Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: {dislikes: -1}})
                  .then(() => { res.status(200).json({message: 'dislike annulé !'})})
                  .catch(error => res.status(401).json({ error }));
            }
    })
    .catch((error) => res.status(404).json({ error }))
    break;

    case -1: 
       Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1}})
       .then(() => { res.status(200).json({message: 'dislike !'})})
       .catch(error => res.status(401).json({ error }));
        break;

        default:
           console.log(error)
  }
  
}




