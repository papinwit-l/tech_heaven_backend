const express = require('express')
const cartRouter = express.Router()
const cartController = require('../controllers/cart-controller')
const authenticate = require('../middlewares/authenticate')
cartRouter.post('/',authenticate.auth,cartController.createCart)
cartRouter.put("/:cartItemId",authenticate.auth,cartController.updateCartItem)
cartRouter.get("/:userId",authenticate.auth,cartController.getCart)
cartRouter.delete("/:cartItemId",authenticate.auth,cartController.deleteCartItem)
cartRouter.post("/add", authenticate.auth, cartController.addToCart);

module.exports = cartRouter