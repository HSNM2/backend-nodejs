const { User } = require('../models/users')
const { Course } = require('../models/courses')
const { Chapter } = require('../models/chapters')
const { Lesson } = require('../models/lessons')
const { PreClassInquiry } = require('../models/pre_class_inquiries')
const { PreClassInquiryRes } = require('../models/pre_class_inquiries_responses')
const { ClassFaq } = require('../models/class_faqs')
const { ClassFaqQuestion } = require('../models/class_faq_questions')
const { RatingSummary } = require('../models/rating_summarys')
const { RatingPersonal } = require('../models/rating_personals')
const { UserCourseAssociation } = require('../models/user_course_associations')
const { UserFavorite } = require('../models/user_favorites')

User.belongsToMany(Course, { through: UserCourseAssociation })
Course.belongsToMany(User, { through: UserCourseAssociation })
User.hasMany(UserFavorite, { foreignKey: 'userId' })
UserFavorite.belongsTo(User, { foreignKey: 'userId' })

// foreignKey 是 migrations 的key
// 與課程資訊關聯
Course.hasOne(Chapter, { foreignKey: 'courseId' })
Chapter.belongsTo(Course, { foreignKey: 'courseId' })
Course.hasOne(PreClassInquiry, { foreignKey: 'courseId' })
PreClassInquiry.belongsTo(Course, { foreignKey: 'courseId' })
Course.hasOne(ClassFaq, { foreignKey: 'courseId' })
ClassFaq.belongsTo(Course, { foreignKey: 'courseId' })
Course.hasOne(RatingSummary, { foreignKey: 'courseId' })
RatingSummary.belongsTo(Course, { foreignKey: 'courseId' })

// 課程資訊大綱
Chapter.hasMany(Lesson, { foreignKey: 'chapterId' })
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId' })

// 課程資訊課前提問
PreClassInquiry.hasMany(PreClassInquiryRes, { foreignKey: 'inquiriesId' })
PreClassInquiryRes.belongsTo(PreClassInquiry, { foreignKey: 'inquiriesId' })

// 課程資訊常見問題
ClassFaq.hasMany(ClassFaqQuestion, { foreignKey: 'faqId' })
ClassFaqQuestion.belongsTo(ClassFaq, { foreignKey: 'faqId' })

// 課程資訊平均分數
RatingSummary.hasMany(RatingPersonal, { foreignKey: 'summaryId' })
RatingPersonal.belongsTo(RatingSummary, { foreignKey: 'summaryId' })

// 查看是否關聯
// const hasChapterLessonAssociation = Course.hasOne(Chapter)
// const hasLessonChapterAssociation = Chapter.belongsTo(Course)

// console.log(hasChapterLessonAssociation)
// console.log(hasLessonChapterAssociation)

console.log(`=== DB Table init flow. ===`)
