function formatDate(date) {
  const formattedDate = new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return formattedDate
}

module.exports = {
  formatDate
}
