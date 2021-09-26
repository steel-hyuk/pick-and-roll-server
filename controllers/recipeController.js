const Posts = require('../models/posts')

module.exports = {
    index: (req, res, next) => {
        Posts.findAll({})
        .then(posts => {
            res.send({data: posts, message: "Find all posts!"})
        })
        .catch(err => {
            console.log(`Error fetching posts: ${err.message}`)
            next(err)
        })
    },
    categoryView: (req, res, next) => {
        Posts.findAll({
            where: { category: req.params.id }
        })
        .then(posts => {
            res.send({data: posts, message: `Find ${req.params.id} posts!`})
        })
        .catch(err => {
            console.log(`Error fetching posts: ${err.message}`)
            next(err)
        })
    }
}