const { User } = require('../models')
const { Post } = require('../models')
const { Favorite } = require('../models')
const { Tastescore } = require('../models')
const { Easyscore } = require('../models')
const { Comment } = require('../models')
const { Ingredient } = require('../models')
const { Contentimage } = require('../models')
const { Mainimg } = require('../models')
const { isAuthorized } = require('../controllers/token/tokenController')
const { everyScoreSum } = require('../controllers/function/function')

module.exports = {
  writePost: async (req, res, next) => {
    console.log(req.locals.message)
    let userParams = `{
            "UserId": "${req.body.userId}",
            "title": "${req.body.title}",
            "introduction": "${req.body.introduction}",
            "category": "${req.body.category}",
            "requiredTime": "${req.body.requiredTime}",
            "content": "${req.body.content}",
            "mainImg": "${req.body.mainImg}",
            "contentImgs": "${req.body.contentImgs}",
            "ingredients": "${req.body.ingredients}"        
        }`

    let postData = JSON.parse(userParams)
    const {
      UserId,
      title,
      introduction,
      category,
      requiredTime,
      content,
      mainImg,
      contentImgs,
      ingredients
    } = postData

    Post.findOrCreate({
      where: {
        title,
        introduction,
        category,
        requiredTime,
        content,
        UserId
      }
    })
      .then(async ([data, created]) => {
        if (created) {
          const postId = data.dataValues.id

          await Mainimg.create({
            src: mainImg,
            PostId: postId
          })

          let contentImgsArr = contentImgs.split(',')
          await Promise.all(
            contentImgsArr.map(async (el) => {
              await Contentimage.create({
                src: el,
                PostId: postId
              })
            })
          )

          let ingredientsFirstSeperate = ingredients.split('@')
          await Promise.all(
            ingredientsFirstSeperate.map(async (el) => {
              let ingredientsSecondSeperate = el.split(',')
              await Ingredient.create({
                ingredient: ingredientsSecondSeperate[0],
                amount: ingredientsSecondSeperate[1],
                PostId: postId
              })
            })
          )
        }
        let accessToken = res.locals.isAuth

        res.locals.message === 'Auth Ok!'
          ? res.send({ message: `${data.dataValues.title} post was made` })
          : res.send({
              data: accessToken,
              message: `${data.dataValues.title} post was made`
            })
      })
      .catch((err) => {
        console.log('warning!')
        next(err)
      })
  },
  show: (req, res, next) => {
    let postId = req.params.postId
    Post.findOne({
      include: [
        { model: Tastescore, attributes: ['score'] },
        { model: Easyscore, attributes: ['score'] },
        { model: Mainimg, attributes: ['src'] },
        { model: Contentimage, attributes: ['src'] },
        { model: Ingredient, attributes: ['ingredient', 'amount'] },
        { model: Comment, attributes: ['id', 'content', 'createdAt', 'UserId'] }
      ],
      where: { id: postId }
    })
      .then(async (post) => {
        let tasteNum = post.Tastescores.length
        let tasteAvg = tasteNum === 0 ? 0 : everyScoreSum(post.Tastescores) / tasteNum
        let easyNum = post.Easyscores.length
        let easyAvg = easyNum === 0 ? 0 : everyScoreSum(post.Easyscores) / easyNum
        let seperateWords = post.content.split('@')
        let isMyPost = false // 내가 만든 게시물인지 확인여부
        let isMyFavorite = false // 내가 등록한 즐겨찾기 게시물인지 확인여부

        const {
          id,
          UserId,
          title,
          introduction,
          category,
          requiredTime,
          createdAt,
          updatedAt,
          Mainimg,
          Contentimages,
          Ingredients,
          Comments
        } = post

        let commentData = await Promise.all(
          Comments.map(async (el) => {
            let value = await User.findOne({
              where: { id: el.UserId }
            })
            let newObj = { name: value.name }
            let result = { ...el.dataValues, ...newObj }

            return result
          })
        )

        //지금 로그인 중인 사용자 정보를 토큰에서 가져와서 사용자가 작성한 게시물인지, 사용자의 즐겨찾기 게시물인지 확인
        const accessTokenData = isAuthorized(req)
        if (accessTokenData) {
          const { email } = accessTokenData
          let findUserId = await User.findOne({
            where: { email }
          })
          if (findUserId.id === UserId) isMyPost = true

          let findFavoritePost = await Favorite.findOne({
            where: {
              UserId: findUserId.id,
              PostId: id
            }
          })
          if (!!findFavoritePost) isMyFavorite = true
        }

        let postData = {
          id,
          UserId, //어떤 사용자가 게시물을 작성했는지 확인가능
          isMyPost,
          isMyFavorite,
          title,
          introduction,
          category,
          requiredTime,
          content: seperateWords,
          createdAt,
          updatedAt,
          tasteAvg: tasteAvg.toFixed(2),
          easyAvg: easyAvg.toFixed(2),
          Mainimg,
          Contentimages,
          Ingredients,
          commentData
        }

        let accessToken = res.locals.isAuth

        res.locals.message === 'Auth Ok!'
          ? res.send({ data: postData, message: `Show post number: ${postId}` })
          : res.send({
              data: { accessToken, postInfo: postData },
              message: `Show post number: ${postId}`
            })
      })
      .catch((err) => {
        console.log(`Show ${postId} post Error!`)
        next(err)
      })
  },
  edit: (req, res, next) => {
    let postId = req.params.postId
    Post.findOne({
      include: [
        { model: Mainimg, attributes: ['src'] },
        { model: Contentimage, attributes: ['src'] },
        { model: Ingredient, attributes: ['ingredient', 'amount'] }
      ],
      where: { id: postId }
    })
      .then(async (post) => {
        let seperateWords = post.content.split('@')

        const {
          id,
          UserId,
          title,
          introduction,
          category,
          requiredTime,
          Mainimg,
          Contentimages,
          Ingredients
        } = post

        let postData = {
          id,
          UserId, //어떤 사용자가 게시물을 작성했는지 확인가능
          title,
          introduction,
          category,
          requiredTime,
          content: seperateWords,
          Mainimg,
          Contentimages,
          Ingredients
        }
        res.send({ data: postData, message: `Edit post number: ${postId}` })
      })
      .catch((err) => {
        console.log(`Show ${postId} post Error!`)
        next(err)
      })
  },
  update: async (req, res, next) => {
    try {
      let userParams = `{
            "title": "${req.body.title}",
            "introduction": "${req.body.introduction}",
            "category": "${req.body.category}",
            "requiredTime": "${req.body.requiredTime}",
            "content": "${req.body.content}",
            "mainImg": "${req.body.mainImg}",
            "contentImgs": "${req.body.contentImgs}",
            "ingredients": "${req.body.ingredients}"        
        }`

      let postData = JSON.parse(userParams)
      let postId = req.params.postId
      const {
        title,
        introduction,
        category,
        requiredTime,
        content,
        mainImg,
        contentImgs,
        ingredients
      } = postData

      let updatePostData = {
        title,
        introduction,
        category,
        requiredTime,
        content
      }
      let contentImgsArr = contentImgs.split(',')
      console.log(contentImgsArr)
      let ingredientsFirstSeperate = ingredients.split('@')
      await Post.update(updatePostData, { where: { id: postId } })
      await Mainimg.update({ src: mainImg }, { where: { PostId: postId } })

      await Promise.all(
        contentImgsArr.map(async (el) => {
          await Contentimage.destroy({ where: { PostId: postId } })
          await Contentimage.create({
            src: el,
            PostId: postId
          })
        })
      )

      await Promise.all(
        ingredientsFirstSeperate.map(async (el) => {
          let ingredientsSecondSeperate = el.split(',')
          await Ingredient.destroy({ where: { PostId: postId } })
          await Ingredient.create({
            ingredient: ingredientsSecondSeperate[0],
            amount: ingredientsSecondSeperate[1],
            PostId: postId
          })
        })
      )
      res.send({ message: `${postId} post was update!!` })
    } catch (err) {
      console.log('Post Update Error!!')
      next(err)
    }
  },
  delete: (req, res, next) => {
    Post.destroy({
      where: { id: req.params.postId }
    })
      .then(() => {
        res.send({ message: 'Data was deleted!' })
      })
      .catch((err) => {
        console.log('post delete error!')
        next(err)
      })
  },
  favoriteAdd: async (req, res, next) => {
    let postId = req.params.postId,
      userId = req.body.userId
    Favorite.findOrCreate({
      where: {
        UserId: userId,
        PostId: postId
      }
    })
      .then(([data, created]) => {
        if (!created) {
          res.status(409).send({ message: 'Same recipe exists' })
        }
        res.status(201).send({ message: 'Favorite recipe added!' })
      })
      .catch((err) => {
        console.log('Favorite Add Error!')
        next(err)
      })
  },

  favoriteDelete: (req, res, next) => {
    let postId = req.params.postId,
      userId = req.body.userId
    Favorite.destroy({
      where: {
        UserId: userId,
        PostId: postId
      }
    })
      .then(() => {
        res.send({ message: 'Favorite post was deleted!' })
      })
      .catch((err) => {
        console.log('Favorite Delete Error!')
        next(err)
      })
  },
  tasteScore: (req, res, next) => {
    let postId = req.params.postId,
      userId = req.body.userId,
      score = req.body.score

    Tastescore.findOrCreate({
      where: {
        score: score,
        PostId: postId,
        UserId: userId
      }
    })
      .then(([data, created]) => {
        if (!created) {
          res.status(409).send('Taste score exists')
        }
        res.status(201).send({ message: 'Taste score added!' })
      })
      .catch((err) => {
        console.log('Taste score Add Error!')
        next(err)
      })
  },
  easyScore: (req, res, next) => {
    let postId = req.params.postId,
      userId = req.body.userId,
      score = req.body.score

    Easyscore.findOrCreate({
      where: {
        score: score,
        PostId: postId,
        UserId: userId
      }
    })
      .then(([data, created]) => {
        if (!created) {
          res.status(409).send('Easy score exists')
        }
        res.status(201).send({ message: 'Easy score added!' })
      })
      .catch((err) => {
        console.log('Easy score Add Error!')
        next(err)
      })
  },
  commentAdd: (req, res, next) => {
    let postId = req.params.postId,
      userId = req.body.userId,
      content = req.body.content,
      newComment = {
        content: content,
        UserId: userId,
        PostId: postId
      }

    Comment.create(newComment)
      .then(() => {
        res.send({ message: 'New comment added!' })
      })
      .catch((err) => {
        console.log('New comment add Error!')
        next(err)
      })
  },
  commentEdit: (req, res, next) => {
    let commentId = req.body.id,
      content = req.body.content,
      updateComment = {
        content: content
      }

    Comment.update(updateComment, {
      where: { id: commentId }
    })
      .then(() => {
        res.send({ message: 'Comment update success!!' })
      })
      .catch((err) => {
        console.log('Update comment Error!')
      })
  },
  commentDelete: (req, res, next) => {
    let commentId = req.body.id

    Comment.destroy({
      where: { id: commentId }
    }).then(() => {
      res.send({ message: 'Comment delete success!!' })
    })
  }
}
