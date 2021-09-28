const { Post } = require('../models')
//const Favorites = require('../models/favorites')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Comment } = require('../models')
const { Ingredient } = require('../models')
const { Contentimage } = require('../models')
const { Mainimg } = require('../models')

module.exports = {
    show: (req, res, next) => {
        let postId = req.params.id
        Post.findOne({
            include: [
                { model: Tastescore, attributes: ['score']},
                { model: Easyscore, attributes: ['score']},
                { model: Mainimg, attributes: ['src']},
                { model: Contentimage, attributes: ['src']},
                { model: Ingredient, attributes: ['ingredient', 'amount']},
                { model: Comment, attributes: ['content', 'createdAt','UserId']}
            ],
            where: { id: postId }        
        })
        .then(post => {
            let tasteNum = post.Tastescores.length
            let tasteAvg = tasteNum === 0 ? 0 : post.Tastescores.reduce((el1, el2) => el1.score + el2.score)/tasteNum
            let easyNum = post.Easyscores.length
            let easyAvg = easyNum === 0 ? 0 : post.Easyscores.reduce((el1, el2) => el1.score + el2.score)/easyNum
            let seperateWords = post.content.split('@')
            
            const { id, title, introduction, category, requiredTime, createdAt, updatedAt, Mainimg, Contentimages, Ingredients, Comments } = post
            let postData = {
                id,
                title,
                introduction,
                category,
                requiredTime,
                content: seperateWords,
                createdAt,
                updatedAt,
                tasteAvg: tasteAvg.toFixed(2),
                easyAvg: easyAvg.toFixed(2),
                Mainimg,
                Contentimages,
                Ingredients,
                Comments
            }
            res.send({data: postData, message: `Show post number: ${postId}`})
        })
        .catch(err => {
            console.log(`Show ${postId} post Error!`)
            next(err)
        })
    },
    delete: (req, res, next) => {
        Post.destroy({
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

        Tastescore.findOrCreate({
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

        Easyscore.findOrCreate({
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

        Comment.create(newComment)
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

        Comment.update(updateComment, {
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

        Comment.destroy({
            where: { id: commentId }
        })
        .then(() => {
            res.send({message: 'Comment delete success!!'})
        })
     }     
}