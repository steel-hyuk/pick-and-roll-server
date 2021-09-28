const router = require('express').Router()
const recipeRoutes = require('./recipeRoutes')
const searchRoutes = require('./searchRoutes')
const userRoutes = require('./userRoutes')
const postRoutes = require('./postsRoutes')
const homeRoutes = require('./homeRoutes')
const errorRoutes = require('./errorRoutes')

router.use('/recipe', recipeRoutes)
router.use('/search', searchRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/', homeRoutes)
router.use('/', errorRoutes)

module.exports = router