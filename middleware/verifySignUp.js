const { User } = require('../models/users')

const checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    return res.status(400).send({
      success: false,
      message: 'Email already exists'
    })
  }
  next()
}

module.exports = {
  checkDuplicateEmail
}
