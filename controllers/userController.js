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
          status: true,
          message: '註冊成功'
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
          status: false,
          message: '查無此使用者'
        })
      }

      let passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        return res.status(401).json({
          status: false,
          message: '密碼錯誤'
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
          status: true,
          message: '登入成功'
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
        status: true,
        message: '登出成功'
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
        status: true,
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

exports.profile = {
  patch: async (req, res) => {
    const { name, nickName, gender } = req.body

    try {
      const { userId } = req
      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      const result = await User.update(
        {
          name,
          nickName,
          gender
        },
        {
          where: {
            id: userId
          }
        }
      )

      if (result) {
        res.json({
          status: true,
          message: '使用者資料更新成功'
        })
      }
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
        status: true,
        data: { ...result.dataValues }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.tag = {
  post: async (req, res) => {
    try {
      const { courseID, tag } = req.body

      res.json({
        status: true,
        data: '收藏新增成功'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      const { courseID, tag } = req.body

      res.json({
        status: true,
        data: '收藏刪除成功'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
