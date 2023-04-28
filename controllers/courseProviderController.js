const { Course } = require('../models/courses')
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
      const { price, originPrice, name, tag, image_path, link, subTitle, description } = req.body

      const tagData = tag.join()

      const result = await Course.create({
        price,
        originPrice,
        name,
        tag: tagData,
        image_path,
        link,
        subTitle,
        description
      })

      res.json({
        success: true,
        data: {
          id: result.id
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
