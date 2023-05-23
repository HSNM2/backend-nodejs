const express = require('express')
const router = express.Router()
const courseProviderController = require('controllers/courseProviderController')
const { authJwt } = require('middleware')

const API_PREFIX = '/course'

router.get(`${API_PREFIX}s`, [authJwt.verifyToken], courseProviderController.courses.get)

router.get(`${API_PREFIX}/:courseid`, [authJwt.verifyToken], courseProviderController.course.get)
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

module.exports = router
