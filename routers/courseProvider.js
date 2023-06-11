const express = require('express')
const router = express.Router()
const courseProviderController = require('controllers/courseProviderController')
const chapter = require('controllers/courseProviderController/chapter')
const lesson = require('controllers/courseProviderController/lesson')
const faq = require('controllers/courseProviderController/faq')
const question = require('controllers/courseProviderController/question')
const { authJwt, verifyCourseProvide } = require('middleware')

const API_PREFIX = '/course'

router.get(`${API_PREFIX}s`, [authJwt.verifyToken], courseProviderController.courses.get)

// course
router.get(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.get
)
router.post(`${API_PREFIX}`, [authJwt.verifyToken], courseProviderController.course.post)
router.patch(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.patch
)
router.delete(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.delete
)
router.post(
  `${API_PREFIX}/:courseid/inStack`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.inStack
)
router.post(
  `${API_PREFIX}/:courseid/offStack`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.offStack
)

// chapter
router.get(
  `${API_PREFIX}/:courseid/chapter`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  chapter.get
)
router.post(
  `${API_PREFIX}/:courseid/chapter`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  chapter.post
)
router.patch(
  `${API_PREFIX}/:courseid/chapter/:chapterid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse
  ],
  chapter.patch
)
router.delete(
  `${API_PREFIX}/:courseid/chapter/:chapterid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse
  ],
  chapter.delete
)

// lesson
router.get(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson/:lessonid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    verifyCourseProvide.checkLessonInChapter
  ],
  lesson.get
)
router.post(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    lesson.uploadMiddleware.single('video')
  ],
  lesson.post
)
router.post(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson/:lessonid/inStack`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    verifyCourseProvide.checkLessonInChapter
  ],
  lesson.inStack
)
router.post(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson/:lessonid/offStack`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    verifyCourseProvide.checkLessonInChapter
  ],
  lesson.offStack
)
router.patch(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson/:lessonid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    verifyCourseProvide.checkLessonInChapter
  ],
  lesson.patch
)
router.delete(
  `${API_PREFIX}/:courseid/chapter/:chapterid/lesson/:lessonid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkChapterInCourse,
    verifyCourseProvide.checkLessonInChapter
  ],
  lesson.delete
)

// faq
router.get(
  `${API_PREFIX}/:courseid/faq`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  faq.get
)
router.post(
  `${API_PREFIX}/:courseid/faq`,
  [authJwt.verifyToken, verifyCourseProvide.checkCourseExist, verifyCourseProvide.checkIsOwned],
  faq.post
)
router.patch(
  `${API_PREFIX}/:courseid/faq/:faqid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse
  ],
  faq.patch
)
router.delete(
  `${API_PREFIX}/:courseid/faq/:faqid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse
  ],
  faq.delete
)

// question
router.get(
  `${API_PREFIX}/:courseid/faq/:faqid/question/:questionid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse,
    verifyCourseProvide.checkQuestionInFaq
  ],
  question.get
)
router.post(
  `${API_PREFIX}/:courseid/faq/:faqid/question`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse
  ],
  question.post
)
router.post(
  `${API_PREFIX}/:courseid/faq/:faqid/question/:questionid/inStack`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse,
    verifyCourseProvide.checkQuestionInFaq
  ],
  question.inStack
)
router.post(
  `${API_PREFIX}/:courseid/faq/:faqid/question/:questionid/offStack`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse,
    verifyCourseProvide.checkQuestionInFaq
  ],
  question.offStack
)
router.patch(
  `${API_PREFIX}/:courseid/faq/:faqid/question/:questionid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse,
    verifyCourseProvide.checkQuestionInFaq
  ],
  question.patch
)
router.delete(
  `${API_PREFIX}/:courseid/faq/:faqid/question/:questionid`,
  [
    authJwt.verifyToken,
    verifyCourseProvide.checkCourseExist,
    verifyCourseProvide.checkIsOwned,
    verifyCourseProvide.checkFaqInCourse,
    verifyCourseProvide.checkQuestionInFaq
  ],
  question.delete
)

module.exports = router
