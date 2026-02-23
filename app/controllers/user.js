const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorizeRoles = require('../middleware/role_middleware')

exports.getUsersForDropdown = async (req, res) => {
  try {
    let query = { isDel: false }

    if (req.user.level !== 'admin') {
      query._id = req.user._id
    }

    const users = await User.find(query)
      .select('_id prefix firstname lastname')

    const formattedUsers = users.map(user => ({
      value: user._id,
      label: `${user.prefix || ''}${user.prefix ? ' ' : ''}${user.firstname} ${user.lastname}`
    }))

    const data = formattedUsers
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

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      })
    }


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
        role: user.level,
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
