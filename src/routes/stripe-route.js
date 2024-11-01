const express = require('express')
const stripeRouter = express.Router()
const authenticate = require('../middlewares/authenticate')
const stripeController = require('../controllers/stripe-controller')

stripeRouter.post("/create-payment", authenticate.auth, stripeController.createPayment)

module.exports = stripeRouter