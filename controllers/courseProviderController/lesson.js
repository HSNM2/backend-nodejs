const { Chapter } = require('models/chapters')
const { Lesson } = require('models/lessons')
const multer = require('multer')

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'video') {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
  }
}

module.exports = {
  get: async (req, res) => {
    try {
      const { lessonid } = req.params

      const lesson = await Lesson.findByPk(lessonid, {
        attributes: ['id', 'title', 'videoPath', 'isPublish']
      })

      if (lesson) {
        res.json({
          status: true,
          data: {
            id: lesson.id,
            title: lesson.title,
            videoPath:
              process.env.NODE_ENV === 'development'
                ? `http://localhost:${process.env.PORT || 3002}/static/video/${lesson.videoPath}`
                : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${COURSE_PROVIDER_VIDEO_FOLDER_PREFIX}/${lesson.videoPath}`,
            isPublish: lesson.isPublish
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    try {
      const { chapterid } = req.params
      const { title } = req.body
      const chapter = await Chapter.findByPk(chapterid)

      let fileName = ''
      const file = req.file

      if (process.env.NODE_ENV === 'production') {
        const s3UploadResult = await s3Uploadv3(file, 'video')
        fileName = s3UploadResult.fileName
      } else {
        fileName = file.filename
      }

      const result = await chapter.createLesson({
        title,
        videoPath: fileName
      })

      if (result) {
        res.json({
          status: true,
          data: {
            id: result.id,
            message: '新增單元成功',
            videoPath:
              process.env.NODE_ENV === 'development'
                ? `http://localhost:${process.env.PORT || 3002}/static/video/${result.videoPath}`
                : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${COURSE_PROVIDER_VIDEO_FOLDER_PREFIX}/${result.videoPath}`
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    try {
      const { lessonid } = req.params
      const { title } = req.body

      const result = await Lesson.update(
        {
          title
        },
        {
          where: {
            id: lessonid
          }
        }
      )

      if (result) {
        res.json({
          status: true,
          data: {
            message: '修改單元成功'
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
      const { chapterid, lessonid } = req.params

      const result = await Lesson.destroy({
        where: {
          id: lessonid,
          chapterId: chapterid
        }
      })

      if (result) {
        res.json({
          status: true,
          data: {
            message: '刪除單元成功'
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  inStack: async (req, res) => {
    try {
      const { lessonid } = req.params
      const lesson = await Lesson.findByPk(lessonid)

      const result = await lesson.update({
        isPublish: true
      })

      if (result) {
        res.json({
          status: true,
          message: '發布單元成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  offStack: async (req, res) => {
    try {
      const { lessonid } = req.params
      const lesson = await Lesson.findByPk(lessonid)

      const result = lesson.update({
        isPublish: false
      })

      if (result) {
        res.json({
          status: true,
          message: '下架單元成功'
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
            destination: 'uploads/video',
            filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
              cb(
                null,
                file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()
              )
            }
          })
        : multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 100000000 }
  })
}
