const { errorTemplateFun } = require('src/utils/template')

exports.webhook = {
  post: async (res, req) => {
    try {
      console.log(`res: `, res)
      console.log(`req: `, req)
    } catch (error) {
      console.error(error)
      res.status(500).json(errorTemplateFun(error))
    }
  }
}
