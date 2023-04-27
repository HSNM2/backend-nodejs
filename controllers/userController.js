const { User } = require('../models/users')
const { errorTemplateFun } = require('../src/utils/template')

exports.register = {
  post: async (req, res) => {
    const { name, nickName, gender, birthday, phone, email, address } = req.body

    try {
      const result = await User.create({
        name,
        nickName,
        gender,
        birthday,
        phone,
        email,
        address
      })
      res.json({
        success: true,
        data: {
          id: result.id
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.login = {
  post: async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          type: 'user login!'
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.logout = {
  post: async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          type: 'user logout!'
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.forgetPassword = {
  post: async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          type: 'user forgetPassword!'
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
