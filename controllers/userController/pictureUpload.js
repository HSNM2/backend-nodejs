const { errorTemplateFun } = require('src/utils/template')
const { s3Uploadv3 } = require('../../src/js/s3Service')

module.exports = {
  post: async (req, res) => {
    try {
      const file = req.file
      const result = await s3Uploadv3(file)

      return res.json({
        success: true,
        data: result
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
