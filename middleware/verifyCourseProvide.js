const { Course } = require('models/courses')

const checkIsOwned = async (req, res, next) => {
  const { courseid } = req.params
  const { userId } = req
  const course = await Course.findByPk(courseid)

  if (course.teacherId !== userId) {
    return res.status(403).json({ status: false, message: '你沒有權限獲取此課程資料' })
  }

  next()
}

module.exports = {
  checkIsOwned
}
