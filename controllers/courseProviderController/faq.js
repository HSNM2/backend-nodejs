const { Course } = require('models/courses')

module.exports = {
  get: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '獲取問題列表資訊'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    try {
      const { courseid } = req.params
      const { title } = req.body

      const course = await Course.findByPk(courseid)
      const result = await course.createClass_faq({
        title
      })

      if (result) {
        return res.json({
          success: true,
          message: '新增問題類別'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '修改問題類別'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '刪除問題類別'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
