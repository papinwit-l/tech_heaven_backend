const express = require('express')
const authRouter = express.Router()
const authController =require('../controllers/auth-controllers')
const {registerValidator, loginValidator} = require('../middlewares/validators')
authRouter.post('/register',registerValidator,authController.register)
authRouter.post('/login',loginValidator,authController.login)

module.exports = authRouter