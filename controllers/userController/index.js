const { User } = require('models/users')
const { Course } = require('models/courses')
const { errorTemplateFun } = require('src/utils/template')

let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
const { generateUserId } = require('src/js/generate')
const { identityValidate } = require('src/js/validate')
const { IDENTITY } = require('src/constants/identityMapping')

const isTeacher = identityValidate(IDENTITY.Teacher)

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
          origin: process.env['ORIGIN'],
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
  get: async (req, res) => {
    try {
      const { userId } = req
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      res.json({
        status: true,
        data: {
          name: user.name,
          nickName: user.nickName,
          gender: user.gender,
          phone: user.phone,
          birthday: new Date(user.birthday).getTime(),
          email: user.email,
          address: user.address
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    const { name, nickName, gender, phone, birthday, address } = req.body

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
          gender,
          phone,
          birthday: new Date(birthday),
          address
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
      const { courseId } = req.params

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
      const { courseId } = req.params

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

exports.identity = {
  get: async (req, res) => {
    try {
      const { userId } = req
      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      return res.json({
        status: true,
        data: JSON.parse(user.identity)
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    const { identityType } = req.body
    try {
      const { userId } = req
      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      let identity = []
      if (user.identity) {
        identity = JSON.parse(user.identity)

        for (let i = 0; i < identity.length; i++) {
          if (isTeacher(identity[i])) {
            return res.json({
              status: false,
              data: '你已經是老師了！'
            })
          }
        }
      }

      identity.push(identityType)

      const result = await User.update(
        {
          identity: JSON.stringify(identity)
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
          data: '註冊老師成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
