const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { errorTemplateFun } = require('../src/utils/template')

var bcrypt = require('bcryptjs')

exports.register = {
  post: async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await User.create({
        email: email,
        password: bcrypt.hashSync(password, 10)
      })

      if (user) {
        res.json({
          success: true,
          data: {
            type: 'user register!'
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json(errorTemplateFun(error))
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

exports.courses = {
  get: async (req, res) => {
    try {
      const { userID } = req.body

      const result = await User.findByPk(userID, {
        include: [
          {
            model: Course
          }
        ]
      })

      res.json({
        success: true,
        data: { ...result.dataValues }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
