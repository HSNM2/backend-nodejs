const express = require('express')
const line = require('@line/bot-sdk')
const router = express.Router()
const lineController = require('controllers/lineController')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

router.post('/webhook', line.middleware(config), lineController.webhook.post)

module.exports = router
