const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

const { verifySignUp, authJwt } = require('../middleware')

router.post('/register', [verifySignUp.checkDuplicateEmail], userController.register.post)
router.post('/login', userController.login.post)
router.post('/logout', [authJwt.verifyToken], userController.logout.post)
router.post('/forgetPassword', userController.forgetPassword.post)
router.get('/courses', userController.courses.get)
router.get('/profile', [authJwt.verifyToken], userController.profile.get)
router.patch('/profile', [authJwt.verifyToken], userController.profile.patch)
router.post('/tag/:courseId', [authJwt.verifyToken], userController.tag.post)
router.delete('/tag/:courseId', [authJwt.verifyToken], userController.tag.delete)
router.post('/identity', [authJwt.verifyToken], userController.identity.post)

module.exports = router
