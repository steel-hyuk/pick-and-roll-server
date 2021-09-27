const router = require('express').Router()
const recipeController = require('../controllers/recipeController')

//정렬기준은 client에서 따로 처리
router.get('/', recipeController.index)
router.get('/:id', recipeController.categoryView)

module.exports = router