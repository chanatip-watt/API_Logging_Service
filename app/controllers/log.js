const Log = require('../models/log')

exports.allLog = async (req, res) => {
  try {
  
    const {
      action,
      startDate,
      endDate,
      userId,
      statusCode,
      labnumber,
      minTimeMs = 0,
      maxTimeMs = 999999
    } = req.query

    let query = {}   // 🔥 ต้องมีบรรทัดนี้
    // Filter action
    if (action && action !== 'all') {
      query.action = Array.isArray(action)
        ? { $in: action }
        : action
    }

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } else {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      query.timestamp = {
        $gte: todayStart,
        $lte: todayEnd
      }
    }

    if (userId && userId !== 'all') {
      query.userId = Array.isArray(userId)
        ? { $in: userId }
        : userId
    }

    const logs = await Log.find(query).limit(5)

    res.json(logs)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params

    const log = await Log.findById(id)

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found"
      })
    }

    await log.deleteOne()

    res.status(200).json({
      success: true,
      message: "Log deleted successfully"
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

