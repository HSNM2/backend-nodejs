const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { errorTemplateFun } = require('../src/utils/template')

let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
const { generateUserId } = require('../src/js/generate')

exports.register = {
  post: async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await User.create({
        id: generateUserId(),
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
    const { email, password } = req.body

    try {
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User Not Found.'
        })
      }

      let passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Password!'
        })
      }

      let token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 86400 // 24 hours
      })

      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
        .json({
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
      res.clearCookie('access_token').json({
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
