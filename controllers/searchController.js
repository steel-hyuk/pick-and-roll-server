const { Post } = require('../models')

module.exports = {
    index: (req, res) => {
        res.send({ data: null, message: 'Please enter the word you want to search for'})
    },
    searchView: (req, res, next) => {
        let targetWord = req.params.id
        Post.findAll({})
        .then(posts => {
            let filterData = posts.filter(el => el.title.includes(targetWord))
            if(filterData.length === 0) res.send({ data: null, message: 'Your search returned no results.'})
            res.send({ data: filterData, message: 'Search success!'})
        })
        .catch(err => {
            console.log(`Error searching posts: ${err.message}`)
            next(err)
        })
    }
}