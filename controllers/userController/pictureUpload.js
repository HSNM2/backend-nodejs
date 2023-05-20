const multer = require('multer')
const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3 } = require('../../src/js/s3Service')
const { User } = require('models/users')
const { USER_AVATAR_FOLDER_PREFIX } = require('src/js/url')

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
  }
}

module.exports = {
  post: async (req, res) => {
    try {
      const { userId } = req

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      const file = req.file
      const { fileName } = await s3Uploadv3(file)

      const result = await User.update(
        {
          avatarImagePath: fileName
        },
        {
          where: {
            id: userId
          }
        }
      )

      if (result) {
        return res.json({
          success: true,
          data: {
            message: '上傳大頭貼成功',
            imagePath: `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${fileName}`
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
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  uploadMiddleware: multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 100000000 }
  })
}
