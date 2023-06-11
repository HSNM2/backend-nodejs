const crypto = require('crypto')

const generateUserId = () => {
  const randomStr = crypto.randomBytes(3).toString('hex')
  const timestamp = new Date().getTime()
  const userId = `${randomStr}${timestamp}`
  return userId
}

module.exports = {
  generateUserId
}
