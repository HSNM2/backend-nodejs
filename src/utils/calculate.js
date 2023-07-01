const calculateTotalPrice = (courseData) => {
  let totalPrice = 0
  if (!courseData) return totalPrice

  courseData.forEach((course) => {
    totalPrice += course.price
  })

  return totalPrice
}

module.exports = {
  calculateTotalPrice
}
