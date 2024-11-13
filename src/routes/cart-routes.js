const express = require('express')
const cartRouter = express.Router()
const cartController = require('../controllers/cart-controller')
const authenticate = require('../middlewares/authenticate')
cartRouter.post('/',authenticate.auth,cartController.createCart)
cartRouter.put("/:cartItemId",authenticate.auth,cartController.updateCartItem)
cartRouter.get("/get-cart/:userId",authenticate.auth,cartController.getCart)
cartRouter.delete("/:cartItemId",authenticate.auth,cartController.deleteCartItem)
cartRouter.post("/add", authenticate.auth, cartController.addToCart);
cartRouter.patch("/applyCoupon",authenticate.auth,cartController.applyCoupon)

module.exports = cartRouter