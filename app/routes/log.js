const router = require('express').Router()
const { authMiddleware } = require('../middleware/auth_middleware')
const logController = require('../controllers/log')


router.get('/', authMiddleware, logController.allLog)


router.get('/export', authMiddleware, logController.reportLog)   

module.exports = router
