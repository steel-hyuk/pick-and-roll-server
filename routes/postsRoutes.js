const router = require('express').Router()
const postsController = require('../controllers/postsController')
const usersController = require('../controllers/usersController')

//게시글 작성
//router.post('/write', postsController) //sql필요

//게시글 보여주는 페이지
router.get('/:id', postsController.show, usersController.isAuth) 
//router.get('/:id/edit', postsController) // 서버에서 뿌려주는게 좋을 듯
//router.put('/:id/update', postsController) // sql
router.delete('/:id/delete', postsController.delete) 

//즐겨찾기 등록&삭제
router.post('/:id/favorite/add', postsController.favoriteAdd)
router.delete('/:id/favorite/delete', postsController.favoriteDelete)

//맛 별점
router.post('/:id/tasteScore', postsController.tasteScore)

//간편성 별점
router.post('/:id/easyScore', postsController.easyScore)

//댓글 작성, 수정, 삭제
router.post('/:id/comment', postsController.commentAdd)
router.put('/:id/comment/update', postsController.commentEdit)
router.delete('/:id/comment/delete', postsController.commentDelete)

module.exports = router



