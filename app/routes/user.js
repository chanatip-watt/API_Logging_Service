const router = require('express').Router()
const controllers = require('../controllers/user')
const { authMiddleware } = require('../middleware/auth_middleware')

router.post('/login',  controllers.Login)

router.get('/dropdown', authMiddleware, controllers.getUsersForDropdown)

module.exports = router
