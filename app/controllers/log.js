const Log = require('../models/log')

exports.allLog = async (req, res) => {
  try {
    const logs = await Log.find()

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

