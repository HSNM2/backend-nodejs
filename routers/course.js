const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

router.get('/:courseid', courseController.course.get)

module.exports = router
