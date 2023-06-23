const crypto = require('crypto')
const line = require('@line/bot-sdk')
const { errorTemplateFun } = require('src/utils/template')

const client = new line.Client({
  channelID: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
})

function handleEvent(event) {
  console.log(`handleEvent / e: `, event)

  if (event.message.emojis) {
    console.log(`emojis: `, event.message.emojis)
  }

  let reply = {
    type: 'text',
    text: `你剛才說了「${event.message.text}」`
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    reply.text = `發過來訊息的種類為「${event.type}」，我看不懂`
  }

  const userId = event.source.userId
  client.getProfile(userId).then((profile) => {
    console.log('User profile: ', profile.displayName, profile.pictureUrl)
  })

  return client.replyMessage(event.replyToken, reply)
}

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

    console.log(`All events: `, req.body.events)

    return res.json(handleEvent(req.body.events[0]))
  }
}
