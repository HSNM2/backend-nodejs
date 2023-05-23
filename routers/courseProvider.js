const express = require('express')
const router = express.Router()
const courseProviderController = require('controllers/courseProviderController')
const chapter = require('controllers/courseProviderController/chapter')
const { authJwt, verifyCourseProvide } = require('middleware')

const API_PREFIX = '/course'

router.get(`${API_PREFIX}s`, [authJwt.verifyToken], courseProviderController.courses.get)

router.get(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken, verifyCourseProvide.checkIsOwned],
  courseProviderController.course.get
)
router.post(`${API_PREFIX}`, [authJwt.verifyToken], courseProviderController.course.post)
router.patch(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken],
  courseProviderController.course.patch
)
router.delete(
  `${API_PREFIX}/:courseid`,
  [authJwt.verifyToken],
  courseProviderController.course.delete
)
router.get(
  `${API_PREFIX}/:courseid/chapter`,
  [authJwt.verifyToken, verifyCourseProvide.checkIsOwned],
  chapter.get
)
router.post(
  `${API_PREFIX}/:courseid/chapter`,
  [authJwt.verifyToken, verifyCourseProvide.checkIsOwned],
  chapter.post
)
router.patch(
  `${API_PREFIX}/:courseid/chapter/:chapterid`,
  [authJwt.verifyToken, verifyCourseProvide.checkIsOwned],
  chapter.patch
)
router.delete(
  `${API_PREFIX}/:courseid/chapter/:chapterid`,
  [authJwt.verifyToken, verifyCourseProvide.checkIsOwned],
  chapter.delete
)

module.exports = router
