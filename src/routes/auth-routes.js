const express = require('express')
const authRouter = express.Router()
const authController =require('../controllers/auth-controllers')
const {registerValidator} = require('../middlewares/validators')
authRouter.post('/register',registerValidator,authController.register)
authRouter.post('/login',()=>{})
authRouter.post('/login/google',()=>{})
module.exports = authRouter