const multer = require('multer')
const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3, s3Delete3 } = require('../../src/js/s3Service')
const { User } = require('models/users')
const { USER_AVATAR_FOLDER_PREFIX } = require('src/js/url')
const { checkUserExist } = require('../../src/utils/template')

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

      const file = req.file
      const { fileName } = await s3Uploadv3(file, 'avatar')

      const originAvatarImagePath = user.avatarImagePath
      if (originAvatarImagePath) {
        await s3Delete3('avatar', user.avatarImagePath)
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
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 100000000 }
  })
}
