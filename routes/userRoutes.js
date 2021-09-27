const router = require('express').Router()
const usersController = require('../controllers/usersController')

//로그인 & 로그아웃 & 회원가입
router.post('/signIn', usersController.signIn)
router.get('/signUp', usersController) // 없어도 될 듯
router.post('/signUp', usersController.signUp)
router.post('/logout', usersController.logout)

//마이페이지
router.get('/:id', usersController.isAuth) 
router.get('/:id/edit', usersController.isAuth)
router.put('/:id/update', usersController.mypageUpdate)
//router.delete('/:id/delete', usersController) 회원탈퇴 -> 첫번째 advanced
router.get('/:id/favorite', usersController.favorite) //spl 필요
router.get('/:id/myRecipe', usersController.myRecipe) 

module.exports = router