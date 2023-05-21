const multer = require('multer')
const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3, s3Delete3 } = require('../../src/js/s3Service')
const { User } = require('models/users')
const { USER_AVATAR_FOLDER_PREFIX } = require('src/js/url')
const { checkUserExist } = require('../../src/utils/template')
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

module.exports = {
  post: async (req, res) => {
    try {
      const { userId } = req

      const user = await User.findByPk(userId)
      checkUserExist(user)

      let fileName = ''
      const file = req.file

      if (process.env.NODE_ENV === 'production') {
        const s3UploadResult = await s3Uploadv3(file, 'avatar')
        fileName = s3UploadResult.fileName

        const originAvatarImagePath = user.avatarImagePath
        if (originAvatarImagePath) {
          await s3Delete3('avatar', user.avatarImagePath)
        }
      } else {
        const originAvatarImagePath = user.avatarImagePath
        if (originAvatarImagePath) {
          const filePath = path.join(rootDir, 'uploads', originAvatarImagePath)
          await unlinkAsync(filePath)
        }
        fileName = file.filename
      }

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
            imagePath:
              process.env.NODE_ENV === 'development'
                ? `http://localhost:${process.env.PORT || 3002}/static/${fileName}`
                : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${fileName}`
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
      const { userId } = req

      const user = await User.findByPk(userId)
      checkUserExist(user)

      await s3Delete3('avatar', user.avatarImagePath)

      const result = await User.update(
        {
          avatarImagePath: null
        },
        {
          where: { id: userId }
        }
      )

      if (result) {
        return res.json({
          success: true,
          data: {
            message: '刪除大頭臉成功'
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  uploadMiddleware: multer({
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
      }
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 100000000 }
  })
}
