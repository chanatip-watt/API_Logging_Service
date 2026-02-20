const router = require('express').Router()
const { authMiddleware } = require('../middleware/auth_middleware')
const logController = require('../controllers/log')
const  { authorizeRoles } = require('../middleware/role_middleware')

// ทุกคนที่ login แล้วเข้าได้
router.get('/', authMiddleware, logController.allLog)

// admin เท่านั้น
router.delete('/:id', authMiddleware, authorizeRoles('admin'), logController.deleteLog)

router.get('/report', authMiddleware, logController.reportLog)   

module.exports = router
