const Users = require('../models/users')
const Posts = require('../models/posts')
const Favorites = require('../models/favorites')
const { generateAccessToken, sendAccessToken, isAuthorized } = require('../controllers/token/tokenController');

module.exports = {
    signIn: (req, res, next) => {
        const { email } = req.body
        Users.findOne({
            where: { email }
        })
        .then( user => {
            let userData = user.dataValues
            if(!user) {
                return res.status(404).send('invalid user')
            }
            delete userData.password
            const accessToken = generateAccessToken(userData)
            sendAccessToken(res, accessToken)
        })
        .catch(err => {
            console.log('signIn accessToken error!')
            next(err)
        })
    },
    signUp: (req, res, next) => {
        const { email, name, password, description } = req.body
        if(!email || !name || !password || !description ) {
            res.status(422).send('insufficient parameters supplied')
        }
        Users.findOrCrate({
            where: {
                email: email,
                name: name,
                password: password,
                description: description
            }
        })
        .then(([data, created]) => {
            if(!created) {
                res.status(409).send('email exists')
            }
            const accessToken = generateAccessToken(req.body)
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                path: '/'
            })
            res.status(201).send({message: 'ok'})
        })
        .catch(err => {
            console.log('signUp accessToken error!')
            next(err)
        })
    },
    logout: (req, res, next) => {
        try {
            res.cookie('jwt','',{maxAge:0})
            res.status(205).send('Logged out successfully')
        } catch (err) {
            console.log('logout error!')
            next(err)
        }
    },
    isAuth: (req, res, next) => {
        const accessTokenData = isAuthorized(req)
        if(!accessTokenData) {
            res.status(401).send({ data: null, message: 'not authorized'})
        }
        const { email } = accessTokenData
        user.findOne({
            where: { email }
        })
        .then(user => {
            let userData = user.dataValues
            delete userData.password
            res.send({ data: userData, message: 'ok' })
        })
        .catch(err => {
            console.log('isAuth error!')
            next(err)
        })
    },
    mypageUpdate: (req, res, next) => {
        let userEmail = req.params.id,
        userParams = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            description: req.body.description
        }

        Users.update(userParams,{ 
            where: {email: userEmail} 
        })
        .then(() => {
            res.send({message: 'mypage update success!!'})
        })
        .catch(err => {
            console.log('mypage update error!')
            next(err)
        })
    },
    favorite: (req, res, next) => {
        //favorite은 sql문이 필요
        let userName = req.params.id
        
        Favorites.findAll({
            where: {userId: userName}
        })
        .then(posts => {
            res.send({data: posts, message: "Find all favorite posts!"})
        })
        .catch(err => {
            console.log('favorite posts error!')
            next(err)
        })
    },
    myRecipe: (req, res, next) => {
        // params.id를 Users.name 으로 사용할건지 Users.id로 사용할건지
        // Users.id는 다른 데이터들이 삭제돼도 번호를 그대로 유지하는지
        let userEmail = req.params.id //스키마도 맞춰서 수정

        Posts.findAll({
            where: {UserId: userEmail}
        })
        .then(posts => {
            res.send({data: posts, message: "Find all myRecipe posts!"})
        })
        .catch(err => {
            console.log('myRecipe posts error!')
            next(err)
        })
    }
}