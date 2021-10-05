const { Post } = require('../models')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Mainimg } = require('../models')
const { everyScoreSum } = require('../controllers/function/function')

module.exports = {
  index: (req, res) => {
    res.send({
      data: null,
      message: 'Please enter the word you want to search for'
    })
  },
  searchView: (req, res, next) => {
    let targetWord = req.params.searchName
    Post.findAll({})
      .then(async (posts) => {
        let filterData = posts.filter((el) => el.title.includes(targetWord))
        if (filterData.length === 0)
          res.send({ data: null, message: 'Your search returned no results.' })

        let Data = await Promise.all(
          filterData.map(async (el) => {
            let value = await Post.findOne({
              include: [
                { model: Tastescore, attributes: ['score'] },
                { model: Easyscore, attributes: ['score'] },
                { model: Mainimg, attributes: ['src'] }
              ],
              where: { id: el.id }
            })

            let tasteNum = value.Tastescores.length
            let tasteAvg = tasteNum === 0 ? 0 : everyScoreSum(value.Tastescores) / tasteNum
            let easyNum = value.Easyscores.length
            let easyAvg = easyNum === 0 ? 0 : everyScoreSum(value.Easyscores) / easyNum
            let mainImage = value.Mainimg

            const { id, title, introduction, category, createdAt } = value

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
        res.send({ data: Data, message: 'Search success!' })
      })
      .catch((err) => {
        console.log(`Error searching posts: ${err.message}`)
        next(err)
      })
  }
}
