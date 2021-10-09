const {
  isAuthorized,
  checkRefeshToken,
  generateAccessToken
} = require('../token/tokenController')
const { User } = require('../../models')

module.exports = {
  everyScoreSum: (arr) => {
    let sum = 0
    arr.map((el) => (sum += el.dataValues.score))
    return sum
  },
  isAuth: async (req, res, next) => {
    const accessTokenData = isAuthorized(req)
    const refreshToken = req.cookies.jwt
    if (!accessTokenData) {
      if (!refreshToken) {
        return res
          .status(403)
          .send("refresh token does not exist, you've never logged in before")
      }
      const refreshTokenData = checkRefeshToken(refreshToken)
      if (!refreshTokenData) {
        return res.json({
          data: null,
          message: 'invalid refresh token, please log in again'
        })
      }
      const { email } = refreshTokenData
      let findUser = await User.findOne({ where: { email } })
      if (!findUser) {
        return res.json({
          data: null,
          message: 'refresh token has been tempered'
        })
      }
      delete findUser.dataValues.password

      const newAccessToken = generateAccessToken(findUser.dataValues)
      res.locals.isAuth = newAccessToken
      res.locals.message = 'newAccessToken'
      next()
    } else {
      const { email } = accessTokenData
      let isAuth = await User.findOne({
        where: { email }
      })
      if (!!isAuth) res.locals.message = 'Auth Ok!'
      next()
    }
  }
}
