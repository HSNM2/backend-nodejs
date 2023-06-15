const { User } = require('models/users')
const { Course } = require('models/courses')
const { Chapter } = require('models/chapters')
const { Lesson } = require('models/lessons')
const { UserFavorite } = require('models/user_favorites')
const { RatingSummary } = require('models/rating_summarys')
const { RatingPersonal } = require('models/rating_personals')
const { errorTemplateFun } = require('src/utils/template')
const { CONVERT } = require('src/utils/format')

let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
const { generateUserId } = require('src/js/generate')
const { identityValidate } = require('src/js/validate')
const { IDENTITY } = require('src/constants/identityMapping')
const { USER_AVATAR_FOLDER_PREFIX, COURSE_PROVIDER_VIDEO_FOLDER_PREFIX } = require('src/js/url')
const { getAllCourseByArray } = require('src/utils/courseUtils')

const { Op } = require('sequelize')
const isTeacher = identityValidate(IDENTITY.Teacher)

const favoriteMessages = {
  empty: '您的課程收藏是空的，前往探索吧！',
  invalid: '課程收藏中有無效的課程ID'
}

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

exports.course = {
  get: async (req, res) => {
    try {
      const { courseid } = req.params
      const { userId } = req

      const user = await User.findByPk(userId)
      const courses = await user.getCourses()
      const course = courses[0]

      // 取得該課程的章節資訊
      const chapters = await Chapter.findAll({
        where: { courseId: courseid },
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            where: { isPublish: true },
            attributes: ['id', 'title', 'videoPath']
          }
        ]
      })

      const VIDEO_PREFIX =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:${process.env.PORT || 3002}/static/video/`
          : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${COURSE_PROVIDER_VIDEO_FOLDER_PREFIX}/`

      chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          lesson.videoPath = `${VIDEO_PREFIX}${lesson.videoPath}`
        })
      })

      return res.json({
        status: true,
        data: [
          {
            id: courseid,
            title: course.title,
            chapters
          }
        ]
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

        const updatedFavoriteCourses = favoriteCourses ? `${favoriteCourses},${courseId}` : courseId

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

      if (!userFavorite.favorite) {
        return res.json({
          status: false,
          message: '尚未有任何收藏課程'
        })
      }

      return res.json({
        status: true,
        message: '取得收藏成功',
        data: userFavorite.favorite
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.favoriteCourse = {
  get: async (req, res) => {
    try {
      const userId = req.userId

      const userFavorite = await UserFavorite.findOne({
        where: { userId },
        attributes: ['favorite']
      })

      if (!userFavorite.favorite) {
        return res.json({
          status: false,
          message: '尚未有任何收藏課程'
        })
      }

      const courseIds = userFavorite.favorite.split(',').map(Number)

      const attributes = [
        'id',
        'title',
        'price',
        'originPrice',
        'image_path',
        'link',
        'provider',
        'buyers',
        'totalTime'
      ]

      const { status, message, courseData } = await getAllCourseByArray(
        courseIds,
        attributes,
        favoriteMessages
      )

      const ratings = await RatingSummary.findAll({
        where: {
          courseId: {
            [Op.in]: courseIds
          }
        },
        attributes: ['courseId', 'avgRating', 'countRating']
      })

      const mergedData = courseData.map((course) => {
        const rating = ratings.find((r) => r.courseId === course.id)
        return {
          ...course.dataValues,
          avgRating: rating ? rating.avgRating : 0,
          countRating: rating ? rating.countRating : 0
        }
      })

      return res.json({
        status,
        message,
        data: mergedData
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

exports.rating = {
  post: async (req, res) => {
    try {
      const { userId } = req
      const courseId = req.params.courseid
      const { content, score } = req.body

      if (score === undefined || isNaN(score)) {
        return res.json({
          status: 400,
          message: '評分資料有誤'
        })
      }

      if (!userId || !courseId) {
        return res.json({
          status: 400,
          message: '資料有誤'
        })
      }

      let summary = await RatingSummary.findOne({
        where: {
          courseId: courseId
        },
        attributes: ['id', 'avgRating', 'countRating']
      })

      // 如果評價摘要不存在，則創建一個新的評價摘要並與課程關聯起來
      if (!summary) {
        summary = await RatingSummary.create({
          courseId,
          avgRating: 0,
          countRating: 0
        })
      }

      // 判別是否已評分過
      const existingRating = await RatingPersonal.findOne({
        where: {
          summaryId: summary.id,
          userId: userId
        }
      })

      if (existingRating) {
        return res.json({
          status: 400,
          message: '您已對該課程進行評價'
        })
      }

      const ratingPersonal = await RatingPersonal.create({
        content,
        score,
        summaryId: summary.id,
        userId
      })

      // 計算新的平均評分和更新評價總人數
      const ratings = await RatingPersonal.findAll({
        where: {
          summaryId: summary.id
        },
        attributes: ['score']
      })

      const totalRatings = ratings.length
      const totalScores = ratings.reduce((sum, rating) => sum + parseFloat(rating.score), 0)
      const avgRating = totalScores / totalRatings

      // 更新 RatingSummary 的資料
      summary.avgRating = avgRating
      summary.countRating = totalRatings
      await summary.save()

      return res.json({
        status: 200,
        message: '評價成功'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  get: async (req, res) => {
    try {
      const { userId } = req
      const courseId = req.params.courseid
      if (!userId || !courseId) {
        return res.json({
          status: 400,
          message: '資料有誤'
        })
      }

      const ratingSummary = await RatingSummary.findOne({
        where: {
          courseId: courseId
        }
      })

      if (!ratingSummary) {
        res.json({
          status: 400,
          message: '資料不存在'
        })
      }
      const summaryId = ratingSummary.id
      let rating = await RatingPersonal.findOne({
        where: {
          summaryId: summaryId,
          userId: userId
        },
        attributes: ['content', 'score', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['name', 'nickName', 'avatarImagePath']
          }
        ]
      })

      if (!rating) {
        return res.json({
          status: 200,
          message: '使用者尚未評價該課程'
        })
      }

      res.json({
        rating: {
          name: rating.user.name,
          score: rating.score,
          nickName: rating.user.nickName || '',
          imagePath:
            process.env.NODE_ENV === 'development'
              ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${
                  rating.user.avatarImagePath
                }`
              : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${rating.user.avatarImagePath}`,
          date: CONVERT.formatDate(rating.createdAt),
          content: rating.content || ''
        }
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}

exports.ratingList = {
  get: async (req, res) => {
    try {
      const { userId } = req
      const courseId = req.params.courseid
      if (!userId || !courseId) {
        return res.json({
          status: 400,
          message: '資料有誤'
        })
      }

      // 取得課程的評價摘要
      let rating = await RatingSummary.findOne({
        where: {
          courseId: courseId
        },
        attributes: ['avgRating', 'countRating'],
        include: [
          {
            model: RatingPersonal,
            attributes: ['content', 'score', 'createdAt'],
            include: [
              {
                model: User,
                attributes: ['name', 'nickName', 'avatarImagePath']
              }
            ]
          }
        ]
      })

      // 如果評價摘要不存在，則創建一個新的評價摘要並與課程關聯起來
      if (!rating) {
        rating = await RatingSummary.create({
          courseId,
          avgRating: 0,
          countRating: 0
        })
      }

      res.json({
        avgRating: rating ? rating.avgRating : 0,
        countRating: rating ? rating.countRating : 0,
        ratings: rating
          ? rating.rating_personals.map((item) => ({
              name: item.user.name,
              score: item.score,
              nickName: item.user.nickName || '',
              imagePath:
                process.env.NODE_ENV === 'development'
                  ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${
                      item.user.avatarImagePath
                    }`
                  : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${item.user.avatarImagePath}`,
              date: CONVERT.formatDate(item.createdAt),
              content: item.content || ''
            }))
          : []
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
