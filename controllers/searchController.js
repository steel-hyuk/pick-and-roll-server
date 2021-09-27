const Posts = require('../models/post')

module.exports = {
    index: (req, res) => {
        res.send({ data: null, message: 'Please enter the word you want to search for'})
    },
    searchView: (req, res, next) => {
        let targetWord = req.params.id
        Posts.findAll({})
        .then(posts => {
            let filterData = posts.filter(el => el.title.includes(targetWord))
            res.send({ data: filterData, message: 'Search success!'})
        })
        .catch(err => {
            console.log(`Error searching posts: ${err.message}`)
            next(err)
        })
    }
}