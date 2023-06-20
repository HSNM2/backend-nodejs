const CONVERT = {
  stringAddSymbol: (str) => `${str}！`,
  formatDate: (date) => {
    // 因伺服器時區不是台灣時間
    const localDate = new Date(date)
    localDate.setHours(localDate.getHours() + 8) // 加上 8 小時以調整時區差異

    // 處理超出 24 小時的情況
    const hours = localDate.getHours()
    const daysToAdd = Math.floor(hours / 24)
    localDate.setDate(localDate.getDate() + daysToAdd)

    const formattedDate = localDate.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const formattedTime = localDate.toLocaleTimeString('zh-TW', {
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
