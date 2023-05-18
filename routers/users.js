const multer = require('multer')
const express = require('express')
const router = express.Router()
const userController = require('controllers/userController')
const pictureUpload = require('controllers/userController/pictureUpload')

const { verifySignUp, authJwt } = require('middleware')

router.post('/register', [verifySignUp.checkDuplicateEmail], userController.register.post)
router.post('/login', userController.login.post)
router.post('/logout', [authJwt.verifyToken], userController.logout.post)
router.post('/forgetPassword', userController.forgetPassword.post)
router.get('/courses', userController.courses.get)
router.get('/profile', [authJwt.verifyToken], userController.profile.get)
router.patch('/profile', [authJwt.verifyToken], userController.profile.patch)

const uploadMiddleware = multer({ dest: 'uploads/' })
router.post(
  '/profile/pic/upload',
  [authJwt.verifyToken, uploadMiddleware.single('file')],
  pictureUpload.post
)

router.post('/tag/:courseId', [authJwt.verifyToken], userController.tag.post)
router.delete('/tag/:courseId', [authJwt.verifyToken], userController.tag.delete)
router.get('/identity', [authJwt.verifyToken], userController.identity.get)
router.post('/identity', [authJwt.verifyToken], userController.identity.post)

module.exports = router
