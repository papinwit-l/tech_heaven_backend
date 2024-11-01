const express = require('express')
const cartRouter = express.Router()
const cartController = require('../controllers/cart-controller')
cartRouter.post('/cart',cartController.createCart)


module.exports = cartRouter