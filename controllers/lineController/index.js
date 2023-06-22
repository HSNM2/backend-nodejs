const { errorTemplateFun } = require('src/utils/template')

exports.webhook = {
  post: async (req, res) => {
    try {
      console.log(`res: `, res)
      console.log(`req: `, req)

      return res.json({
        status: 200,
        data: {
          message: 'Line Webhook'
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json(errorTemplateFun(error))
    }
  }
}
