const express = require('express')
const router = express.Router()
const userController = require('controllers/userController')
const pictureUpload = require('controllers/userController/pictureUpload')
const { verifySignUp, authJwt } = require('middleware')

router.post('/register', [verifySignUp.checkDuplicateEmail], userController.register.post)
router.post('/login', userController.login.post)
router.post('/logout', [authJwt.verifyToken], userController.logout.post)
router.post('/forgetPassword', userController.forgetPassword.post)
router.get('/course/:courseid', [authJwt.verifyToken], userController.course.get)
router.get('/courses', [authJwt.verifyToken], userController.courses.get)
router.get('/profile', [authJwt.verifyToken], userController.profile.get)
router.patch('/profile', [authJwt.verifyToken], userController.profile.patch)
router.post(
  '/profile/pic/upload',
  [authJwt.verifyToken, pictureUpload.uploadMiddleware.single('avatar')],
  pictureUpload.post
),
  router.delete('/profile/pic/upload', [authJwt.verifyToken], pictureUpload.delete)
router.post('/tag/:courseId', [authJwt.verifyToken], userController.favorite.post)
router.delete('/tag/:courseId', [authJwt.verifyToken], userController.favorite.delete)
router.get('/tag/userFavorite', [authJwt.verifyToken], userController.getFavorite.get)
router.get('/tag', [authJwt.verifyToken], userController.favoriteCourse.get)
router.get('/identity', [authJwt.verifyToken], userController.identity.get)
router.post('/identity', [authJwt.verifyToken], userController.identity.post)
router.post('/ownedCourse/check', [authJwt.verifyToken], userController.ownedCourse.post)
router.get('/course/:courseid/ratings', userController.ratingList.get)
router.post('/course/:courseid/rating', [authJwt.verifyToken], userController.rating.post)
router.get('/course/:courseid/rating', [authJwt.verifyToken], userController.rating.get)
router.patch('/course/:courseid/rating', [authJwt.verifyToken], userController.rating.patch)

module.exports = router
