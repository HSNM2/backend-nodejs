const { db } = require('../config/db')

console.log(`=== Users_Course_Associations Model Create ===`)

let UserCourseAssociation = db.define('user_course_associations', {})

module.exports = {
  UserCourseAssociation
}
