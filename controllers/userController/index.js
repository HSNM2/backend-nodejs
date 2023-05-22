const { User } = require('models/users')
const { Course } = require('models/courses')
const { UserFavorite } = require('models/user_favorites')
const { errorTemplateFun } = require('src/utils/template')

let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
const { generateUserId } = require('src/js/generate')
const { identityValidate } = require('src/js/validate')
const { IDENTITY } = require('src/constants/identityMapping')
const { USER_AVATAR_FOLDER_PREFIX } = require('src/js/url')

const isTeacher = identityValidate(IDENTITY.Teacher)

exports.register = {
  post: async (req, res) => {
    const { email, password } = req.body
    try {
      const id = generateUserId()
      const user = await User.create({
        id,
        name: `custom-${id}`,
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
          address: user.address,
          identity: user.identity,
          avatarImagePath: user.avatarImagePath
            ? process.env.NODE_ENV === 'development'
              ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${user.avatarImagePath}`
              : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${user.avatarImagePath}`
            : null
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

exports.favorite = {
  post: async (req, res) => {
    try {
      const { courseId } = req.params
      const userId = req.userId

      const userFavorite = await UserFavorite.findOne({
        where: {
          userId
        }
      })

      if (userFavorite) {
        const favoriteCourses = userFavorite.favorite || ''
        if (favoriteCourses.includes(courseId)) {
          return res.json({
            status: false,
            message: '已將該課程加入收藏'
          })
        }

        const updatedFavoriteCourses = favoriteCourses + ',' + courseId

        await userFavorite.update({
          favorite: updatedFavoriteCourses
        })

        return res.json({
          status: true,
          message: '收藏新增成功'
        })
      }

      const favoriteData = courseId.toString()
      await UserFavorite.create({
        favorite: favoriteData,
        userId
      })

      res.json({
        status: true,
        message: '收藏新增成功'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      const { courseId } = req.params
      const userId = req.userId

      const userFavorite = await UserFavorite.findOne({
        where: {
          userId
        }
      })

      if (userFavorite) {
        let favoriteCourses = userFavorite.favorite || ''

        if (!favoriteCourses.includes(courseId)) {
          return res.json({
            status: false,
            message: '該課程未在收藏中'
          })
        }

        favoriteCourses = favoriteCourses
          .split(',')
          .filter((id) => id !== courseId)
          .join(',')

        await userFavorite.update({
          favorite: favoriteCourses
        })

        return res.json({
          status: true,
          message: '已從收藏中刪除該課程'
        })
      }

      return res.json({
        status: false,
        message: '刪除失敗'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.getFavorite = {
  get: async (req, res) => {
    try {
      const userId = req.userId

      const userFavorite = await UserFavorite.findOne({
        where: { userId },
        attributes: ['favorite']
      })

      return res.json({
        status: true,
        message: '取得收藏成功',
        data: userFavorite.favorite || ''
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

exports.ownedCourse = {
  post: async (req, res) => {
    try {
      const { userId } = req
      const courseId = req.body.id

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Course,
            where: { id: courseId },
            required: true
          }
        ]
      })

      if (user) {
        return res.json({
          status: true,
          message: '擁有此課程',
          isOwned: true
        })
      } else {
        return res.json({
          statue: true,
          message: '尚未擁有此課程',
          isOwned: false
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
