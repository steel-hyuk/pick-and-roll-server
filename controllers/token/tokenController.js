require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "1d" });
  },
  sendAccessToken: (res, accessToken, data) => {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      path: '/'
    });
    res.status(200).send({data: data, message: 'SignIn ok!'})
  },
  isAuthorized: (req) => {
    const authorization = req.headers["cookie"];
    if (!authorization) {
      return null;
    } else if (authorization){
      const token = authorization.split("jwt=")[1].split(';')[0];
    try {
      return verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      // return null if invalid token
      return null;
    }
  }
  }
};
