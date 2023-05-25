const express = require('express')
const router = express.Router()
const cartController = require('controllers/cartController')

const { verifySignUp, authJwt } = require('middleware')

router.get('/', cartController.cartList.get)

module.exports = router
