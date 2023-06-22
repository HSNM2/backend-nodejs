const express = require('express')
const router = express.Router()
const lineController = require('controllers/lineController')

router.post('/webhook', lineController.webhook.post)

module.exports = router
