const CONVERT = {
  stringAddSymbol: (str) => `${str}！`,
  formatDate: (date) => {
    const formattedDate = new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const formattedTime = new Date(date).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    return `${formattedDate} ${formattedTime}`
  }
}

module.exports = {
  CONVERT
}
