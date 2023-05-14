const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { Chapter } = require('../models/chapters')
const { Lesson } = require('../models/lessons')
const { UserCourseAssociation } = require('../models/user_course_associations')

User.belongsToMany(Course, { through: UserCourseAssociation })
Course.belongsToMany(User, { through: UserCourseAssociation })

// foreignKey 是 migrations 的key
Course.hasOne(Chapter, { foreignKey: 'courseId' })
Chapter.belongsTo(Course, { foreignKey: 'courseId' })

Chapter.hasMany(Lesson, { foreignKey: 'chapterId' })
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId' })

// 查看是否關聯
// const hasChapterLessonAssociation = Course.hasOne(Chapter)
// const hasLessonChapterAssociation = Chapter.belongsTo(Course)

// console.log(hasChapterLessonAssociation)
// console.log(hasLessonChapterAssociation)

console.log(`=== DB Table init flow. ===`)
