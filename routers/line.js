const express = require('express')
const line = require('@line/bot-sdk')
const router = express.Router()
const lineController = require('controllers/lineController')

const config = {
  channelID: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
}

router.post('/webhook', line.middleware(config), lineController.webhook.post)

module.exports = router
