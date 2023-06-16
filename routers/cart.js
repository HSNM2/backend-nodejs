const express = require('express')
const router = express.Router()
const cartController = require('controllers/cartController')

const { verifySignUp, authJwt } = require('middleware')

router.post('/', cartController.cartList.post)
router.post('/order', [authJwt.verifyToken], cartController.order.post)
router.post('/createOrder', [authJwt.verifyToken], cartController.createOrder.post)
router.post('/spgatewayNotify', cartController.notify.post)
router.post('/orderReceipt', cartController.orderReceipt.post)

module.exports = router
