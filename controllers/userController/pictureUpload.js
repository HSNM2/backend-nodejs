const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3 } = require('../../src/js/s3Service')
const { User } = require('models/users')

module.exports = {
  post: async (req, res) => {
    try {
      const { userId } = req

      const file = req.file
      const { pictureUrl } = await s3Uploadv3(file)

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: false,
          message: '查無此使用者'
        })
      }

      const result = await User.update(
        {
          avatarImagePath: pictureUrl
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
          data: '上傳大頭貼成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
