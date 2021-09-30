const router = require('express').Router()
const postsController = require('../controllers/postsController')

//게시글 작성
router.post('/write', postsController.writePost)

//게시글 보여주는 페이지
router.get('/:id', postsController.show) 
router.get('/:id/edit', postsController.edit)
router.put('/:id/update', postsController.update)
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



