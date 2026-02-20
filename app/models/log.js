const mongoose = require('mongoose')

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now // เก็บเป็น ISO 8601 UTC อัตโนมัติ
    },

    request: {
      method: {
        type: String,
        required: true
      },
      endpoint: {
        type: String,
        required: true
      }
    },

    response: {
      statusCode: {
        type: String ,
        required: true
      },
      message: {
        type: String
      },
      timeMs: {
        type: Number,
        required: true
      }
    },

    action: {
      type: String,
      required: true,
      enum: [
        'labOrder',
        'labResult',
        'receive',
        'accept',
        'approve',
        'reapprove',
        'unapprove',
        'unreceive',
        'rerun',
        'save',
        'listTransactions',
        'getTransaction',
        'analyzerResult',
        'analyzerRequest'
      ]
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },

    labnumber: {
      type: [String], // เป็น array
      default: []
    }
  },
  {
    timestamps: false // เพราะเรามี timestamp ของเราเองแล้ว
  }
)

module.exports =   mongoose.models.logs ||   mongoose.model('logs', logSchema)
