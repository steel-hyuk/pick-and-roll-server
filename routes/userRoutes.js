const router = require('express').Router()
const usersController = require('../controllers/usersController')

//로그인 & 로그아웃 & 회원가입
router.post('/signIn', usersController)
router.get('/signUp', usersController)
router.post('/signUp', usersController)
router.post('/logout', usersController)

//마이페이지
router.get('/:id', usersController)
router.get('/:id/edit', usersController)
router.put('/:id/update', usersController)
//router.delete('/:id/delete', usersController) 회원탈퇴 -> 첫번째 advanced
router.get('/:id/favorite', usersController)
router.get('/:id/myRecipe', usersController) 

module.exports = router