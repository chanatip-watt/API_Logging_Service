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
    const mongoose = require('mongoose')

    let query = {}

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

      if (Array.isArray(userId)) {
        query.userId = {
          $in: userId.map(id => new mongoose.Types.ObjectId(id))
        }
      } else {
        query.userId = new mongoose.Types.ObjectId(userId)
      }
    }

    if (statusCode && statusCode.trim() !== '') {
      query["response.statusCode"] = statusCode;
    }

    if (labnumber) {

      let labArray = []

      if (Array.isArray(labnumber)) {
        labArray = labnumber
      } else if (typeof labnumber === 'string') {
        labArray = labnumber
          .split(',')
          .map(x => x.trim())
          .filter(x => x !== '')
      }

      if (labArray.length > 0) {
        query.labnumber = { $in: labArray }
      }
    }

    if ( minTimeMs & maxTimeMs) {
      query['response.timeMs'] = {
        $gte: Number(minTimeMs),
        $lte: Number(maxTimeMs)
      }
    }

    const logs = await Log.find(query).limit(50);

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

