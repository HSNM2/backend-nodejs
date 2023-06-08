const { Course } = require('models/courses')

const getCourseData = async (courseIds, attributes) => {
  const intCourseIds = courseIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))

  if (!Array.isArray(intCourseIds)) {
    return {
      status: 400,
      message: '課程ID無效'
    }
  }

  if (intCourseIds.length === 0) {
    return {
      status: 200,
      message: '您的購物車是空的，前往探索吧！'
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
      message: '課程ID無效'
    }
  }

  courseData.reverse()

  return {
    status: 200,
    courseData
  }
}

const calculateTotalPrice = (courseData) => {
  let totalPrice = 0

  courseData.forEach((course) => {
    if (course.price < course.originPrice) {
      totalPrice += course.price
    } else {
      totalPrice += course.originPrice
    }
  })

  return totalPrice
}

module.exports = {
  getCourseData,
  calculateTotalPrice
}
