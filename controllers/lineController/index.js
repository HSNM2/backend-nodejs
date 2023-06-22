const crypto = require('crypto')
const { errorTemplateFun } = require('src/utils/template')

exports.webhook = {
  post: async (req, res) => {
    console.log(`[API] api/line/webhook / x-Line-Signature: `, req.header('x-Line-Signature'))
    let signKey = ''
    try {
      signKey = crypto
        .createHmac('sha256', process.env.LINE_CHANNEL_SECRET)
        .update(Buffer.from(JSON.stringify(req.body)), 'utf8')
        .digest('base64')
    } catch (error) {
      console.error(error)
      res.status(500).json(errorTemplateFun(error))
    }

    if (signKey !== req.header('x-Line-Signature')) {
      return res.json({
        status: false,
        data: {
          message: 'Signature not match.'
        }
      })
    }

    console.log(`Message: `, req.body.events[0])

    return res.json({
      status: 200,
      data: {
        message: 'Line Webhook'
      }
    })
  }
}
