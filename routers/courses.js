const express = require('express')
const router = express.Router()
const coursesController = require('controllers/coursesController')

const { verifySignUp, authJwt } = require('middleware')

router.get('/', coursesController.courses.get)

module.exports = router
