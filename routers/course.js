const express = require('express')
const router = express.Router()
const courseController = require('controllers/courseController')

const { verifySignUp, authJwt } = require('middleware')

router.get('/:courseid', courseController.course.get)
router.get('/:courseid/chapter', courseController.courseChapter.get)
router.get('/:courseid/inquiry', courseController.courseInquiry.get)
router.get('/:courseid/faq', courseController.courseFaq.get)
router.get('/:courseid/rating', courseController.courseRating.get)
router.post('/:courseid/preClassInquiry', [authJwt.verifyToken], courseController.inquiryAsk.post)
router.post(
  '/:courseid/preClassInquiry/:inquiryid',
  [authJwt.verifyToken],
  courseController.inquiryAnswer.post
)
router.post('/courseIsExist', courseController.isExist.post)

module.exports = router
