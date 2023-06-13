const { Course } = require('models/courses')

const getAllCourseByArray = async (courseIds, attributes, messages) => {
  const intCourseIds = courseIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))

  if (!Array.isArray(intCourseIds)) {
    return {
      status: 400,
      message: messages.invalid,
      courseData: []
    }
  }

  if (intCourseIds.length === 0) {
    return {
      status: 200,
      message: messages.empty,
      courseData: []
    }
  }

  const courseData = await Course.findAll({
    where: {
      id: intCourseIds
    },
    attributes
  })

  if (courseData.length !== intCourseIds.length) {
    return {
      status: 400,
      message: messages.invalid,
      courseData: []
    }
  }

  courseData.reverse()

  return {
    status: 200,
    message: '查詢課程成功',
    courseData
  }
}

module.exports = {
  getAllCourseByArray
}
