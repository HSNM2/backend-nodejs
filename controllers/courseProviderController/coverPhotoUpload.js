const multer = require('multer')
const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3, s3Delete3 } = require('../../src/js/s3Service')
const { Course } = require('models/courses')
const { URL_PREFIX, COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX } = require('src/js/url')
const { checkCourseExist } = require('../../src/utils/template')
const fs = require('fs')
const path = require('path')
const rootDir = require('src/utils/path')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
  }
}

const FOLDER_PREFIX = COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX

module.exports = {
  post: async (req, res) => {
    try {
      let result = false
      const { courseId } = req.body

      const course = await Course.findByPk(courseId)
      checkCourseExist(course)

      let fileName = ''
      const file = req.file
      const originImagePath = course.image_path

      if (process.env.NODE_ENV === 'production') {
        const s3UploadResult = await s3Uploadv3(file, FOLDER_PREFIX)
        fileName = s3UploadResult.fileName

        if (originImagePath) {
          await s3Delete3(FOLDER_PREFIX, originImagePath)
        }
      } else {
        if (originImagePath) {
          const filePath = path.join(rootDir, `uploads/${FOLDER_PREFIX}`, originImagePath)
          await unlinkAsync(filePath)
        }
        fileName = file.filename
      }

      result = await Course.update(
        {
          image_path: fileName
        },
        {
          where: {
            id: courseId
          }
        }
      )

      if (result) {
        return res.json({
          success: true,
          data: {
            message: '課程封面照上傳成功',
            imagePath: `${URL_PREFIX}/${FOLDER_PREFIX}/${fileName}`
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      const { courseId } = req.body

      const course = await Course.findByPk(courseId)
      checkCourseExist(course)

      const originImagePath = course.image_path

      if (process.env.NODE_ENV === 'production') {
        await s3Delete3(FOLDER_PREFIX, course.image_path)
      } else {
        const filePath = path.join(rootDir, `uploads/${FOLDER_PREFIX}`, originImagePath)
        await unlinkAsync(filePath)
      }

      const result = await Course.update(
        {
          image_path: null
        },
        {
          where: { id: courseId }
        }
      )

      if (result) {
        return res.json({
          success: true,
          data: {
            message: '移除課程封面照成功'
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  uploadMiddleware: multer({
    storage:
      process.env.NODE_ENV === 'development'
        ? multer.diskStorage({
            destination: `uploads/${FOLDER_PREFIX}`,
            filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
              cb(
                null,
                file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()
              )
            }
          })
        : multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 100000000 }
  })
}
