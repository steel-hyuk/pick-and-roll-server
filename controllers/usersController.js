const { User } = require('../models')
const { Post } = require('../models')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Mainimg } = require('../models')
const { Favorite } = require('../models')
const { generateAccessToken, sendAccessToken, isAuthorized } = require('../controllers/token/tokenController');

module.exports = {
    signIn: (req, res, next) => {
        const { email, password } = req.body
        User.findOne({
            where: { email, password }
        })
        .then( user => {
            if(!user) {
                return res.status(404).send({data: null, message: 'Invalid user'})
            }
            let userData = user.dataValues
            delete userData.password
            const accessToken = generateAccessToken(userData)
            sendAccessToken(res, accessToken, userData)
        })
        .catch(err => {
            console.log('SignIn accessToken error!')
            next(err)
        })
    },
    signUp: (req, res, next) => {
        const { email, name, password, description } = req.body
        if(!email || !name || !password || !description ) {
            res.status(422).send({data: null, message: 'Insufficient parameters supplied'})
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
            if(!created) {
                res.status(409).send({data: null, message: 'Email exists!!'})
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
            res.status(401).send({ data: null, message: 'Not authorized!!'})
        }
        const { email } = accessTokenData
        User.findOne({
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
            email: req.body.email, //email도 바꿀 수 있나요?
            password: req.body.password,
            description: req.body.description
        }

        User.update(userParams,{ 
            where: {email: userEmail} 
        })
        .then(() => {
            res.send({message: 'Mypage update success!!'})
        })
        .catch(err => {
            console.log('mypage update error!')
            next(err)
        })
    },
    favorite: (req, res, next) => {
        let userEmail = req.params.id
        
        User.findAll({
            include: [
                {model: Favorite, attributes: ['PostId']}
            ],
            where: {email: userEmail}
        })
        .then( async (info) => {
            let Data = await Promise.all(
                info[0].Favorites.map( async (el) => {
                    let value = await Post.findOne({
                        include: [
                            { model: Tastescore, attributes: ['score']},
                            { model: Easyscore, attributes: ['score']},
                            { model: Mainimg, attributes: ['src']},
                        ],
                        where: { id: el.PostId }
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
            if(Data.length === 0) res.send({data: null, message: "Your favorite doesn't exist"})
            res.send({data: Data, message: "Find all favorite posts!"})
        })
        .catch(err => {
            console.log('favorite posts error!')
            next(err)
        })
    },
    myRecipe: (req, res, next) => {
        let userEmail = req.params.id

        User.findAll({
            include: [
                {model: Post, attributes: ['id','title', 'introduction', 'category', 'createdAt']}
            ],            
            where: {email: userEmail}
        })
        .then( async (info) => {
            let Data = await Promise.all(
                info[0].Posts.map( async (el) => {
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
            if(Data.length === 0) res.send({data: null, message: "Your post doesn't exist"})
            res.send({data: Data, message: "Find all myRecipe posts!"})
        })
        .catch(err => {
            console.log('myRecipe posts error!')
            next(err)
        })
    }
}