const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorizeRoles = require('../middleware/roleMiddleware')

exports.getUsersForDropdown = async (req, res) => {
  try {
    let query = { isDel: false }

    // ถ้าไม่ใช่ admin ให้เห็นแค่ตัวเอง
    if (req.user.level !== 'admin') {
      query._id = req.user._id
    }

    const users = await User.find(query)
      .select('_id prefix firstname lastname')

    const formattedUsers = users.map(user => ({
      value: user._id,
      label: `${user.prefix || ''}${user.prefix ? ' ' : ''}${user.firstname} ${user.lastname}`
    }))

    const data =
      req.user.level === 'admin'
        ? [{ value: 'all', label: 'แสดงทั้งหมด' }, ...formattedUsers]
        : formattedUsers

    res.json({
      success: true,
      data
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 1️⃣ เช็คว่ามีข้อมูลส่งมาครบไหม
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      })
    }

    // 2️⃣ ค้นหา user จากฐานข้อมูล
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }
    console.log("SIGN SECRET:", process.env.JWT_SECRET)

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
