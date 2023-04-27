const { errorTemplateFun } = require('../src/utils/template')

exports.courses = {
  get: async () => {}
}

exports.course = {
  get: async (req, res) => {
    try {
      res.json({
        success: true,
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
      res.json({
        success: true,
        data: {
          id: 'course post!'
        }
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  },
  patch: async (req, res) => {
    try {
      res.json({
        success: true,
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
        success: true,
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
