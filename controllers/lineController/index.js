const { errorTemplateFun } = require('src/utils/template')

exports.webhook = {
  post: async (req, res) => {
    try {
      console.log(`events: `, req.body.events)
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
