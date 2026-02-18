const router = require('express').Router()
const controllers = require('../controllers/user')

router.post('/',  controllers.Login)

module.exports = router
