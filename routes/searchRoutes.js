const router = require('express').Router()
const searchController = require('../controllers/searchController')

router.get('/', searchController.index)
router.get('/:searchName', searchController.searchView)

module.exports = router
