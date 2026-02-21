const Log = require('../models/log')
const reportLogExcel = require('../utils/report_log_excel')
const reportLogPdf = require('../utils/report_log_by_pdf')
const buildLogQuery = require('../utils/build_log_query')
const formatLogData = require('../utils/formatted')

exports.allLog = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query

    const pageNumber = Number(page)
    const pageSize = Number(limit)
    const skip = (pageNumber - 1) * pageSize

    const query = buildLogQuery(req.query)

    const logs = await Log.find(query)
      .populate({
        path: 'userId',
        select: 'prefix firstname lastname',
        match: { isDel: false }
      })
      .skip(skip)
      .limit(pageSize)
      .lean()
    

    const formatted = formatLogData(logs)

    const total = await Log.countDocuments(query)

    res.json({
      total,
      page: pageNumber,
      limit: pageSize,
      data: formatted
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.reportLog = async (req, res) => {
  try {

    const { format } = req.query
    const query = buildLogQuery(req.query)

    const logs = await Log.find(query)
      .populate({
        path: 'userId',
        select: 'prefix firstname lastname',
        match: { isDel: false }
      })
      .lean()

    const formatted = formatLogData(logs)

    if (format === 'pdf') {
      return reportLogPdf(res, formatted)
    }

    if (format === 'excel') {
      return reportLogExcel(res, formatted)
    }

    return res.json({
      total: formatted.length,
      data: formatted
    })

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

