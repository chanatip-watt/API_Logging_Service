const PDFDocument = require('pdfkit')

function reportLogByPdf(res, data) {
  const doc = new PDFDocument({ size: 'A4', margin: 30 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=log-report-${Date.now()}.pdf`
  )

  doc.pipe(res)

  // Title
  doc.fontSize(16).text('Log Report', { align: 'center' })
  doc.moveDown()

  // Body
  data.forEach((row, index) => {
    doc
      .fontSize(8)
      .text(
        `${index + 1}. ${row.userName} | ${row.endpoint} | ${row.method} | ${row.timestamp}`
      )
      .text(
        `Lab: ${row.labnumber} | Action: ${row.action} | Status: ${row.statusCode}`
      )
      .text(`Message: ${row.message} | Time: ${row.timeMs} ms`)
      .moveDown()
  })

  doc.end()
}

module.exports = reportLogByPdf