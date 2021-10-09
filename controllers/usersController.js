const { User } = require('../models')
const { Post } = require('../models')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Mainimg } = require('../models')
const { Favorite } = require('../models')
const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  isAuthorized,
  checkRefeshToken
} = require('../controllers/token/tokenController')
const { everyScoreSum } = require('../controllers/function/function')

module.exports = {
  signIn: (req, res, next) => {
    const { email, password } = req.body
    User.findOne({
      where: { email, password }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ data: null, message: 'Invalid user' })
        }
        let userData = user.dataValues
        delete userData.password
        const accessToken = generateAccessToken(userData)
        const refreshToken = generateRefreshToken(userData)
        sendRefreshToken(res, refreshToken) //access보다 위에 있어야 한다
        sendAccessToken(res, accessToken, userData)
      })
      .catch((err) => {
        console.log('SignIn Error!')
        next(err)
      })
  },
  signUp: (req, res, next) => {
    const { email, name, password, description } = req.body
    if (!email || !name || !password || !description) {
      res
        .status(422)
        .send({ data: null, message: 'Insufficient parameters supplied' })
    }
    User.findOrCreate({
      where: {
        email: email,
        name: name,
        password: password,
        description: description
      }
    })
      .then(([data, created]) => {
        if (!created) {
          res.status(409).send({ data: null, message: 'Email exists!!' })
        }
        res.status(201).send({ message: 'SignUp success!!' })
      })
      .catch((err) => {
        console.log('signUp accessToken error!')
        next(err)
      })
  },
  logout: (req, res, next) => {
    try {
      res.cookie('jwt', '', { maxAge: 0 })
      res.status(205).send({ message: 'Logged out successfully' })
    } catch (err) {
      console.log('logout error!')
      next(err)
    }
  },
  isAuth: async (req, res, next) => {
    const accessTokenData = isAuthorized(req)
    const refreshToken = req.cookies.jwt
    if (!accessTokenData) {
      if (!refreshToken) {
        res
          .status(403)
          .send("refresh token does not exist, you've never logged in before")
      }
      const refreshTokenData = checkRefeshToken(refreshToken)
      if (!refreshTokenData) {
        res.json({
          data: null,
          message: 'invalid refresh token, please log in again'
        })
      }
      const { email } = refreshTokenData
      let findUser = await User.findOne({ where: { email } })
      if (!findUser) {
        res.json({
          data: null,
          message: 'refresh token has been tempered'
        })
      }
      delete findUser.dataValues.password

      const newAccessToken = generateAccessToken(findUser.dataValues)
      sendAccessToken(res, newAccessToken, findUser.dataValues)
    }
    const { email } = accessTokenData
    User.findOne({
      where: { email }
    })
      .then((user) => {
        let userData = user.dataValues
        delete userData.password
        res.send({ data: userData, message: 'Auth success!' })
      })
      .catch((err) => {
        console.log('isAuth error!')
        next(err)
      })
  },
  mypageUpdate: (req, res, next) => {
    let userEmail = req.params.email,
      //사용자의 가입시 입력한 email은 수정 할 수 없습니다!
      userParams = {
        name: req.body.name,
        password: req.body.password,
        description: req.body.description
      }

    User.update(userParams, {
      where: { email: userEmail }
    })
      .then(() => {
        res.send({ message: 'Mypage update success!!' })
      })
      .catch((err) => {
        console.log('mypage update error!')
        next(err)
      })
  },
  favorite: (req, res, next) => {
    let userEmail = req.params.email

    User.findAll({
      include: [{ model: Favorite, attributes: ['PostId'] }],
      where: { email: userEmail }
    })
      .then(async (info) => {
        let Data = await Promise.all(
          info[0].Favorites.map(async (el) => {
            let value = await Post.findOne({
              include: [
                { model: Tastescore, attributes: ['score'] },
                { model: Easyscore, attributes: ['score'] },
                { model: Mainimg, attributes: ['src'] }
              ],
              where: { id: el.PostId }
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
        if (Data.length === 0) res.send({ data: null, message: "Your favorite doesn't exist" })
        res.send({ data: Data, message: 'Find all favorite posts!' })
      })
      .catch((err) => {
        console.log('favorite posts error!')
        next(err)
      })
  },
  myRecipe: (req, res, next) => {
    let userEmail = req.params.email

    User.findAll({
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'introduction', 'category', 'createdAt']
        }
      ],
      where: { email: userEmail }
    })
      .then(async (info) => {
        let Data = await Promise.all(
          info[0].Posts.map(async (el) => {
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
        if (Data.length === 0) res.send({ data: null, message: "Your post doesn't exist" })
        res.send({ data: Data, message: 'Find all myRecipe posts!' })
      })
      .catch((err) => {
        console.log('myRecipe posts error!')
        next(err)
      })
  }
}
