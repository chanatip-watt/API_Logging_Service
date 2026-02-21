const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authMiddleware = async (req, res, next) => {
  try {
    let token

    // 1️⃣ เช็คว่ามี Authorization header ไหม
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // 2️⃣ ถ้าไม่มี token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      })
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4️⃣ ดึง user จาก database
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // 5️⃣ แนบ user ไปกับ request
    req.user = user

    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    })
  }
}
