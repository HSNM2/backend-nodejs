const express = require('express')
const router = express.Router()
const courseController = require('controllers/courseController')

const { verifySignUp, authJwt } = require('middleware')

router.get('/:courseid', courseController.course.get)
router.post('/:courseid/preClassInquiry', [authJwt.verifyToken], courseController.inquiryAsk.post)
router.post(
  '/:courseid/preClassInquiry/:inquiryid',
  [authJwt.verifyToken],
  courseController.inquiryAnswer.post
)

module.exports = router
