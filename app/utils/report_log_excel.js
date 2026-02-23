const ExcelJS = require('exceljs')

async function reportLogExcel(res, payload) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Log Report')


  const data = Array.isArray(payload) ? payload : payload.data

  if (!Array.isArray(data)) {
    throw new Error('Invalid data format for Excel export')
  }

  worksheet.columns = [
    { header: 'No.', key: 'no', width: 8 },
    { header: 'User', key: 'userName', width: 25 },
    { header: 'Endpoint', key: 'endpoint', width: 25 },
    { header: 'Method', key: 'method', width: 12 },
    { header: 'Timestamp', key: 'timestamp', width: 22 },
    { header: 'Lab Number', key: 'labnumber', width: 30 },
    { header: 'Action', key: 'action', width: 20 },
    { header: 'Status Code', key: 'statusCode', width: 15 },
    { header: 'Message', key: 'message', width: 35 },
    { header: 'Time (ms)', key: 'timeMs', width: 15 },
  ]


  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })


  data.forEach((row, index) => {
    const excelRow = worksheet.addRow({
      no: index + 1,
      userName: row.userName || '',
      endpoint: row.endpoint || '',
      method: row.method || '',
      timestamp: row.timestampNOformat
        ? new Date(row.timestampNOformat)
        : row.timestamp || '',
      labnumber: row.labnumber
        ? row.labnumber.replace(/,/g, '\n')
        : '',
      action: row.action || '',
      statusCode: row.statusCode || '',
      message: row.message || '',
      timeMs: row.timeMs || '',
    })


    if (row.timestampNOformat) {
      excelRow.getCell('timestamp').numFmt = 'yyyy-mm-dd hh:mm:ss'
    }
  })


  worksheet.getColumn('labnumber').alignment = { wrapText: true }
  worksheet.getColumn('message').alignment = { wrapText: true }

  worksheet.views = [{ state: 'frozen', ySplit: 1 }]


  console.log("tesrt" +data.length)
  worksheet.autoFilter = {
    from: 'A1',
    to: `J${data.length + 1}`,
  }

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=log-report-${Date.now()}.xlsx`
  )

  await workbook.xlsx.write(res)
  res.end()
}

module.exports = reportLogExcel