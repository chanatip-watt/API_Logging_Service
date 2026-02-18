const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    prefix: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDel: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    }
  },
  { timestamps: true }
)

// 🔥 ตรงนี้คือจุดสำคัญ
module.exports =
  mongoose.models.users || mongoose.model('users', userSchema)
