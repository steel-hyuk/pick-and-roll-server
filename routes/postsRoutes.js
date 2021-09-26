const router = require('express').Router()
const postsController = require('../controllers/postsController')

//게시글 작성
router.get('/write', postsController)
router.post('/write', postsController)

//게시글 보여주는 페이지
router.get('/:id', postsController)
router.get('/:id/edit', postsController)
router.put('/:id/update', postsController)
router.delete('/:id/delete', postsController)

//즐겨찾기 등록&삭제
router.post('/:id/favorite/add', postsController)
router.delete('/:id/favorite/delete', postsController)

//맛 별점
router.post('/:id/tasteScore', postsController)
router.put('/:id/tasteScore', postsController)

//간편성 별점
router.post('/:id/easyScore', postsController)
router.put('/:id/easyScore', postsController)

//댓글 작성, 수정, 삭제
router.post('/:id/comment', postsController)
router.put('/:id/comment/update', postsController)
router.delete('/:id/comment/delete', postsController)

module.exports = router