const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/register', userController.register.post)
router.post('/login', userController.login.post)
router.post('/logout', userController.logout.post)
router.post('/forgetPassword', userController.forgetPassword.post)

module.exports = router
