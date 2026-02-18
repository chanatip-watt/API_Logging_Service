const router = require('express').Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const logController = require('../controllers/log')
const  { authorizeRoles } = require('../middleware/roleMiddleware')

// ทุกคนที่ login แล้วเข้าได้
router.get('/',authMiddleware,  logController.allLog )
// admin เท่านั้น
router.delete('/:id', authMiddleware, authorizeRoles('admin'), logController.deleteLog)

module.exports = router
