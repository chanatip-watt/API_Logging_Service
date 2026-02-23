const Log = require('../models/log')
const reportLogExcel = require('../utils/report_log_excel')
const reportLogPdf = require('../utils/report_log_by_pdf')
const buildLogQuery = require('../utils/build_log_query')
const formatLogData = require('../utils/formatted')


exports.allLog = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortField = "none",
      sortOrder = "none"
    } = req.query

    const pageNumber = Number(page)
    const pageSize = Number(limit)
    const skip = (pageNumber - 1) * pageSize

    const query = buildLogQuery(req.query)

    if (req.user.level === "user") {
      query.userId = req.user._id
    }



    let sortOption = {}

    if (sortOrder !== "none") {

      if (sortField === "timestamp") {
        if (sortOrder === "asc") sortOption.timestamp = 1
        if (sortOrder === "desc") sortOption.timestamp = -1
      }
      
      if (sortField === "timeMs") {
        if (sortOrder === "asc") sortOption["response.timeMs"]  = 1
        if (sortOrder === "desc") sortOption["response.timeMs"]  = -1
      }

      if (sortField === "action") {
        if (sortOrder === "asc") sortOption.action = 1
        if (sortOrder === "desc") sortOption.action = -1
      }
    }


    const actionOrder = [
      "labOrder",
      "labResult",
      "receive",
      "accept",
      "approve",
      "reapprove",
      "unapprove",
      "unreceive",
      "rerun",
      "save",
      "listTransactions",
      "getTransaction",
      "analyzerResult",
      "analyzerRequest"
    ]

    let logs
    let total = await Log.countDocuments(query)

    if (sortField === "action" && sortOrder === "custom") {
      logs = await Log.aggregate([
        { $match: query },
        {
          $addFields: {
            actionIndex: { $indexOfArray: [actionOrder, "$action"] }
          }
        },
        { $sort: { actionIndex: 1 } },
        { $skip: skip },
        { $limit: pageSize }
      ])
    } else {
      logs = await Log.find(query)
        .populate({
          path: "userId",
          select: "prefix firstname lastname",
          match: { isDel: false }
        })
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean()
    }

    const formatted = formatLogData(logs)

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

    if (req.user.level === "user") {
      query.userId = req.user._id
    }
    
    
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
      console.log(format)
      return reportLogExcel(res, formatted)
    }

    return res.json({
      data: formatted
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


