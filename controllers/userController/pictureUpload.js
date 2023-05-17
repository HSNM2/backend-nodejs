const { errorTemplateFun } = require('src/utils/template')

module.exports = {
  post: async (req, res) => {
    try {
      return res.json({
        success: true,
        data: 'upload'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
