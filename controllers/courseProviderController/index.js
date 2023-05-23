const { Course } = require('models/courses')
const { User } = require('models/users')
const { checkUserExist } = require('src/utils/template')
const { errorTemplateFun } = require('src/utils/template')

exports.courses = {
  get: async () => {}
}

exports.course = {
  get: async (req, res) => {
    try {
      res.json({
        status: true,
        data: {
          id: `course get! course ID: ${req.params.courseid}`
        }
      })
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
      res.json({
        status: true,
        data: {
          id: 'course patch!'
        }
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  delete: async (req, res) => {
    try {
      res.json({
        status: true,
        data: {
          id: 'course delete!'
        }
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
