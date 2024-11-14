const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user-controller')
const authenticate = require('../middlewares/authenticate')


userRouter.post("/create-order", authenticate.auth, userController.createOrder)
userRouter.get("/get-orders", authenticate.auth, userController.getOrderByUserId)

userRouter.post("/address", authenticate.auth, userController.addAddress)
userRouter.get("/all-address", authenticate.auth, userController.getAllAddress)
userRouter.patch("/address/:addressId", authenticate.auth, userController.updateAddress)
userRouter.delete("/address/:addressId", authenticate.auth, userController.deleteAddress)


module.exports = userRouter