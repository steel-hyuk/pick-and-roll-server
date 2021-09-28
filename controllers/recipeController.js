const { Post } = require('../models')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Mainimg } = require('../models')

module.exports = {
    index: (req, res, next) => {
        Post.findAll({})
        .then( async (posts) => {
            let Data = await Promise.all(
                posts.map( async (el) => {
                    let value = await Post.findOne({
                        include: [
                            { model: Tastescore, attributes: ['score']},
                            { model: Easyscore, attributes: ['score']},
                            { model: Mainimg, attributes: ['src']},
                        ],
                        where: { id: el.id }
                    })

                    let tasteNum = value.Tastescores.length
                    let tasteAvg = tasteNum === 0 ? 0 : value.Tastescores.reduce((el1, el2) => el1.score + el2.score)/tasteNum
                    let easyNum = value.Easyscores.length
                    let easyAvg = easyNum === 0 ? 0 : value.Easyscores.reduce((el1, el2) => el1.score + el2.score)/easyNum
                    let mainImage = value.Mainimg
                    
                    const { id, title, introduction, category, createdAt} = value

                    return {
                        id,
                        title,
                        mainImage,
                        introduction,
                        category,
                        tasteAvg: tasteAvg.toFixed(2),
                        easyAvg: easyAvg.toFixed(2),
                        createdAt
                    }
                })
            )
            res.send({data: Data, message: "Find all posts!"})
        })
        .catch(err => {
            console.log(`Error fetching posts: ${err.message}`)
            next(err)
        })
    },
    categoryView: (req, res, next) => {
        Post.findAll({
            where: { category: req.params.id }
        })
        .then( async (posts) => {
            let Data = await Promise.all(
                posts.map( async (el) => {
                    let value = await Post.findOne({
                        include: [
                            { model: Tastescore, attributes: ['score']},
                            { model: Easyscore, attributes: ['score']},
                            { model: Mainimg, attributes: ['src']},
                        ],
                        where: { id: el.id }
                    })

                    let tasteNum = value.Tastescores.length
                    let tasteAvg = tasteNum === 0 ? 0 : value.Tastescores.reduce((el1, el2) => el1.score + el2.score)/tasteNum
                    let easyNum = value.Easyscores.length
                    let easyAvg = easyNum === 0 ? 0 : value.Easyscores.reduce((el1, el2) => el1.score + el2.score)/easyNum
                    let mainImage = value.Mainimg
                    
                    const { id, title, introduction, category, createdAt} = value

                    return {
                        id,
                        title,
                        mainImage,
                        introduction,
                        category,
                        tasteAvg: tasteAvg.toFixed(2),
                        easyAvg: easyAvg.toFixed(2),
                        createdAt
                    }
                })
            )
            res.send({data: Data, message: `Find ${req.params.id} posts!`})
        })
        .catch(err => {
            console.log(`Error fetching posts: ${err.message}`)
            next(err)
        })
    }
}