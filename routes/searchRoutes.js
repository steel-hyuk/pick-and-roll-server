const router = require('express').Router()
const searchController = require('../controllers/searchController')

router.get('/', searchController.index)
router.get('/:id', searchController.searchView)

module.exports = router