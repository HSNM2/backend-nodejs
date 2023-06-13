const calculateTotalPrice = (courseData) => {
  let totalPrice = 0
  if (!courseData) return totalPrice

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
  calculateTotalPrice
}
