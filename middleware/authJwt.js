const jwt = require('jsonwebtoken')
const { User } = require('../models/users')

const verifyToken = async (req, res, next) => {
  const token = req.cookies['access_token']

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token not found'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      })
    }

    req.userId = decoded.id
    req.email = decoded.email
    next()
  })
}

module.exports = {
  verifyToken
}
