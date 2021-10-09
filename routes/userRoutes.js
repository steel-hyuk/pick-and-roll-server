const router = require('express').Router()
const usersController = require('../controllers/usersController')

//로그인 & 로그아웃 & 회원가입
router.post('/signin', usersController.signIn)
router.post('/signup', usersController.signUp)
router.post('/logout', usersController.logout)

//마이페이지
router.get('/:email', usersController.isAuth)
router.put('/:email', usersController.mypageUpdate)
router.get('/:email/edit', usersController.isAuth)
//router.delete('/:id/delete', usersController) 회원탈퇴 -> 첫번째 advanced
router.get('/:email/favorite', usersController.favorite)
router.get('/:email/myRecipe', usersController.myRecipe)

module.exports = router
