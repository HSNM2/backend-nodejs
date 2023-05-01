const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { UserCourseAssociation } = require('../models/user_course_associations')

User.belongsToMany(Course, { through: UserCourseAssociation })
Course.belongsToMany(User, { through: UserCourseAssociation })

console.log(`=== DB Table init flow. ===`)
