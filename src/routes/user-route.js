const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user-controller')
const authenticate = require('../middlewares/authenticate')


userRouter.post("/create-order", authenticate.auth, userController.createOrder)
userRouter.get("/get-orders", authenticate.auth, userController.getOrderByUserId)


module.exports = userRouter