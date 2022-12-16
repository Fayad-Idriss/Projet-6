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

exports.createLikes = (req, res, next) => {
  let like = req.body.userId
  const user = req.body.userId

  const usersLiked = []
  const usersDisliked = []

  if(like = 1){

    like ++;
    usersLiked.push(user, like ++)
  }
  if(like = -1){

    like --
    usersDisliked.push(user, like--);
  }

  console.log(usersLiked, 'vote 1')
  console.log(usersDisliked, 'vote -1')
}














/* exports.likeSauce = (req, res, next) => {
  const likes = req.body.likes
  const dislikes = req.body.dislikes
  const userId = req.body.usersLiked
  const usersLiked = req.body.usersLiked
  const usersDisliked = req.body.usersDisliked

  Sauce.findOne({ _id: req.params.id})

    .then(sauce => {
      switch(likes){
        case 1: 
            Sauce.updateOne(
              {_id: req.params.id},
              {$push: {usersLiked: userId}, $inc: {likes: +1}}
            )
          .then(() => res.status(200).json({ message: 'sauce aimée'}))
          .catch(error => res.status(400).json({error}))
          break;
      }

      switch(dislikes){
        case -1:
          Sauce.updateOne(
            { _id: req.params.id}, 
            {$push:  {usersDisliked: userId}, $inc: {dislikes: -1}}
          )
        .then(() => res.status(200).json ({ message: 'sauce non aimée'}))
        .catch( error => res.status(400).json ({error}))
      }
    })
} */