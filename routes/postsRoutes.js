const router = require('express').Router()
const postsController = require('../controllers/postsController')
const auth = require('../controllers/function/function')
//게시글 작성
router.post('/', auth.isAuth, postsController.writePost)

//게시글 보여주는 페이지
router.get('/:postId', auth.isAuth, postsController.show)
router.get('/:postId/edit', postsController.edit)
router.put('/:postId', postsController.update)
router.delete('/:postId', postsController.delete)

//즐겨찾기 등록&삭제
router.post('/:postId/favorite', postsController.favoriteAdd)
router.delete('/:postId/favorite', postsController.favoriteDelete)

//맛 별점
router.post('/:postId/tastescore', postsController.tasteScore)

//간편성 별점
router.post('/:postId/easyscore', postsController.easyScore)

//댓글 작성, 수정, 삭제
router.post('/:postId/comment', postsController.commentAdd)
router.put('/:postId/comment', postsController.commentEdit)
router.delete('/:postId/comment', postsController.commentDelete)

module.exports = router
