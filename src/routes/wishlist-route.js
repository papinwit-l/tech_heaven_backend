const express = require('express')
const wishlistRouter = express.Router()
const wishlistController = require('../controllers/wishlist-controller')
const authenticate = require('../middlewares/authenticate')
wishlistRouter.post("/",authenticate.auth,wishlistController.createWishlist)
wishlistRouter.delete("/:productId", authenticate.auth, wishlistController.deleteWishlist);
wishlistRouter.get("/",authenticate.auth,wishlistController.getWishlist)

module.exports = wishlistRouter