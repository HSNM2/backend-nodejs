const express = require('express')
const router = express.Router()
const commonController = require('controllers/commonController')

router.post('/checkout', commonController.checkout.post)

module.exports = router
