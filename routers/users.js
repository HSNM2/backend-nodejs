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

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
  }
}
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 100000000 }
})
router.post(
  '/profile/pic/upload',
  [authJwt.verifyToken, uploadMiddleware.single('file')],
  pictureUpload.post
)

router.post('/tag/:courseId', [authJwt.verifyToken], userController.favorite.post)
router.delete('/tag/:courseId', [authJwt.verifyToken], userController.favorite.delete)
router.get('/identity', [authJwt.verifyToken], userController.identity.get)
router.post('/identity', [authJwt.verifyToken], userController.identity.post)

module.exports = router
