const Posts = require('../models/post')
//const Favorites = require('../models/favorites')
const TasteScores = require('../models/tastescore')
const Comments = require('../models/comment')

module.exports = {
    delete: (req, res, next) => {
        Posts.destroy({
            where: {id: req.params.id}
        })
        .then(() => {
            res.send({message: 'Data was deleted!'})
        })
        .catch((err) => {
            console.log('post delete error!')
            next(err)
        });
    },
    /*
    favoriteAdd: (req, res, next) => {
        let postId = req.params.id,
        userEmail = req.body.email
        Favorites.findOrCreate({
            where: {
                UserId: userEmail,
                PostId: postId
            }
        })
        .then(([data, created]) => {
            if(!created) {
                res.status(409).send('same recipe exists')
            }
            res.status(201).send({message: 'Favorite recipe added!'})
        })
        .catch(err => {
            console.log('Favorite Add Error!')
            next(err)
        })  
     },
     favoriteDelete: (req, res, next) => {
        let postId = req.params.id,
        userEmail = req.body.email
        Favorites.destroy({
            where: {
                UserId: userEmail,
                PostId: postId
            }
        })
        .then(() => {
            res.send({message: 'Favorite post was deleted!'})
        })
        .catch(err => {
            console.log('Favorite Delete Error!')
            next(err)
        })
     },*/
     tasteScore: (req, res, next) => {
        let postId = req.params.id,
        userEmail = req.body.email,
        score = req.body.score

        TasteScores.findOrCreate({
            where: {
                score: score,
                PostId: postId,
                UserId: userEmail
            }
        }).then(([data, created]) => {
            if(!created) {
                res.status(409).send('Taste score exists')
            }
            res.status(201).send({message: 'Taste score added!'})
        })
        .catch(err => {
            console.log('Taste score Add Error!')
            next(err)
        })
     },
     easyScore: (req, res, next) => {
        let postId = req.params.id,
        userEmail = req.body.email,
        score = req.body.score

        TasteScores.findOrCreate({
            where: {
                score: score,
                PostId: postId,
                UserId: userEmail
            }
        }).then(([data, created]) => {
            if(!created) {
                res.status(409).send('Easy score exists')
            }
            res.status(201).send({message: 'Easy score added!'})
        })
        .catch(err => {
            console.log('Easy score Add Error!')
            next(err)
        })
     },
     commentAdd: (req, res, next) => {
        let postId = req.params.id,
        userEmail = req.body.email,
        content = req.body.content,
        newComment = {
            content: content,
            UserId: userEmail,
            PostId: postId
        }

        Comments.create(newComment)
        .then(() => {
            res.send({message: 'New comment added!'})
        })
        .catch(err => {
            console.log('New comment add Error!')
            next(err)
        })

     },
     commentEdit: (req, res, next) => {
        let commentId = req.body.id,
        content = req.body.content,
        updateComment = {
            content: content
        }

        Comments.update(updateComment, {
            where: { id: commentId }
        })
        .then(() => {
            res.send({message: 'Comment update success!!'})
        })
        .catch(err => {
            console.log('Update comment Error!')
        })
     },
     commentDelete: (req, res, next) => {
        let commentId = req.body.id

        Comments.destroy({
            where: { id: commentId }
        })
        .then(() => {
            res.send({message: 'Comment delete success!!'})
        })
     }     
}