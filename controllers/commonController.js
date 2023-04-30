const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { errorTemplateFun } = require('../src/utils/template')

exports.checkout = {
  post: async (req, res) => {
    try {
      const { userID, courseID } = req.body
      const user = await User.findOne({ where: { id: userID } })
      const course = await Course.findOne({ where: { id: courseID } })

      const result = await user.addCourse(course)

      if (result) {
        return res.json({
          success: true,
          data: {
            message: 'course bought successfully'
          }
        })
      } else {
        return res.json({
          success: false
        })
      }
    } catch (error) {
      console.log(error)
      return res.json(errorTemplateFun(error, res))
    }
  }
}
