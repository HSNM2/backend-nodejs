const { Course } = require('models/courses')
const { User } = require('models/users')
const { checkUserExist } = require('src/utils/template')
const { errorTemplateFun } = require('src/utils/template')
const { URL_PREFIX, COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX } = require('src/js/url')

exports.courses = {
  get: async (req, res) => {
    try {
      const { userId } = req
      const user = await User.findOne({
        where: {
          id: userId
        }
      })
      checkUserExist(user)

      const courses = await Course.findAll({
        where: {
          teacherId: user.id
        }
      })

      const resultCourse = courses.map((course) => ({
        id: course.id,
        title: course.title,
        image_path: course.image_path
          ? `${URL_PREFIX}/${COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX}/${course.image_path}`
          : null,
        isPublish: course.isPublish
      }))

      return res.json({
        status: true,
        data: {
          course: resultCourse
        }
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.course = {
  get: async (req, res) => {
    try {
      const course = await Course.findOne({
        where: {
          id: req.params.courseid
        }
      })

      if (course) {
        res.json({
          status: true,
          data: {
            id: course.id,
            price: course.price,
            originPrice: course.originPrice,
            title: course.title,
            tag: course.tag,
            image_path: course.image_path
              ? `${URL_PREFIX}/${COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX}/${course.image_path}`
              : null,
            link: course.link,
            subTitle: course.subTitle,
            description: course.description,
            courseStatus: course.courseStatus,
            type: course.type,
            category: course.category
          }
        })
      }
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  post: async (req, res) => {
    try {
      const { userId } = req
      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      checkUserExist(user)

      const { title, type } = req.body

      const course = await Course.create({ title, type, provider: user.name, teacherId: user.id })

      if (course) {
        return res.json({
          status: true,
          message: '課程建立成功'
        })
      }
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  patch: async (req, res) => {
    try {
      const { courseid } = req.params
      const {
        title,
        subTitle,
        price,
        originPrice,
        tag,
        image_path,
        link,
        description,
        courseStatus,
        type,
        category
      } = req.body

      if (!title) {
        return res.status(400).json({
          status: false,
          message: '標題未填'
        })
      }

      if (!originPrice) {
        return res.status(400).json({
          status: false,
          message: '原價未填'
        })
      }

      if (!description) {
        return res.status(400).json({
          status: false,
          message: '課程簡介未填'
        })
      }

      if (!category) {
        return res.status(400).json({
          status: false,
          message: '課程類型未填'
        })
      }
      if (!type) {
        return res.status(400).json({
          status: false,
          message: '細節種類未填'
        })
      }

      if (!link) {
        return res.status(400).json({
          status: false,
          message: '影片連結未填'
        })
      }

      if (!tag) {
        return res.status(400).json({
          status: false,
          message: '標籤最少填寫一個'
        })
      }

      if (!courseStatus) {
        return res.status(400).json({
          status: false,
          message: '課程公開模式未填'
        })
      }

      const course = await Course.findByPk(courseid)

      const result = await course.update({
        title,
        subTitle,
        price,
        originPrice,
        tag: tag.reduce(
          (acc, cur, index, array) => `${acc}${cur}${index === array.length - 1 ? '' : ','}`,
          ''
        ),
        image_path,
        link,
        description,
        courseStatus,
        type,
        category
      })

      if (result) {
        res.json({
          status: true,
          message: '修改課程成功'
        })
      }
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  delete: async (req, res) => {
    try {
      const { courseid } = req.params
      const course = await Course.findByPk(courseid)

      const result = await course.destroy()

      if (!result) {
        throw new Error('請求失敗')
      }

      res.json({
        status: true,
        message: '課程刪除成功'
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  inStack: async (req, res) => {
    try {
      const { courseid } = req.params

      const course = await Course.findByPk(courseid)

      const fieldNames = {
        originPrice: '原價',
        title: '課程名稱',
        tag: '標籤',
        image_path: '封面圖片',
        link: '介紹影片',
        subTitle: '課程副標題',
        description: '課程簡介',
        courseStatus: '課程分類',
        type: '課程類型',
        category: '細節種類'
      }

      const emptyFields = []
      for (const field of Object.keys(fieldNames)) {
        if (!course[field]) {
          emptyFields.push(fieldNames[field])
        }
      }

      if (emptyFields.length === 0) {
        const result = await course.update({
          isPublish: true
        })

        if (result) {
          res.json({
            status: true,
            message: '課程上架成功'
          })
        }
      } else {
        const fieldNamesString = emptyFields.join('、')
        return res.status(400).json({
          status: 400,
          message: `課程資訊不得空白，尚有 ${fieldNamesString} 等未填。`
        })
      }
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  offStack: async (req, res) => {
    try {
      const { courseid } = req.params

      const course = await Course.findByPk(courseid)

      const result = await course.update({
        isPublish: false
      })

      if (result) {
        res.json({
          status: true,
          message: '課程下架成功'
        })
      }
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
