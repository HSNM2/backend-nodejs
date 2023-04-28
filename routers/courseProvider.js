const express = require('express')
const router = express.Router()
const courseProviderController = require('../controllers/courseProviderController')
const API_PREFIX = '/course'

router.get(`${API_PREFIX}s`, courseProviderController.courses.get)

router.get(`${API_PREFIX}/:courseid`, courseProviderController.course.get)
router.post(`${API_PREFIX}`, courseProviderController.course.post)
router.patch(`${API_PREFIX}/:courseid`, courseProviderController.course.patch)
router.delete(`${API_PREFIX}/:courseid`, courseProviderController.course.delete)

module.exports = router
