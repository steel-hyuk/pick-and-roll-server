const router = require('express').Router()
const postsController = require('../controllers/postsController')

//게시글 작성
router.get('/write', postsController) // 필요할까?
router.post('/write', postsController) //sql필요

//게시글 보여주는 페이지
router.get('/:id', postsController) // sql
router.get('/:id/edit', postsController) // client에서 관리?
router.put('/:id/update', postsController) // sql
router.delete('/:id/delete', postsController.delete) 

//즐겨찾기 등록&삭제
router.post('/:id/favorite/add', postsController.favoriteAdd)
router.delete('/:id/favorite/delete', postsController.favoriteDelete)

//맛 별점
router.post('/:id/tasteScore', postsController.tasteScore)
router.put('/:id/tasteScore', postsController) //한 번 주면 끝이므로 삭제

//간편성 별점
router.post('/:id/easyScore', postsController.easyScore)
router.put('/:id/easyScore', postsController) //한 번 주면 끝이므로 삭제

//댓글 작성, 수정, 삭제
router.post('/:id/comment', postsController.commentAdd)
router.put('/:id/comment/update', postsController.commentEdit)
router.delete('/:id/comment/delete', postsController.commentDelete)

module.exports = router



