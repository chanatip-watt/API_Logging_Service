const  formatDate =  require('../utils/format_log_data')

function formatLogData(logs) {
  return logs.map(log => ({
    userName: log.userId
      ? `${log.userId.prefix}${log.userId.firstname} ${log.userId.lastname}`
      : '-',

    endpoint: log.request?.endpoint || '-',
    method: log.request?.method || '-',

    timestamp: formatDate(log.timestamp),

    labnumber: log.labnumber?.length > 0
      ? log.labnumber.join(',')
      : '-',

    action: log.action || '-',
    statusCode: log.response?.statusCode || '-',
    message: log.response?.message || '-',
    timeMs: log.response?.timeMs || 0,
  }))
}

module.exports = formatLogData