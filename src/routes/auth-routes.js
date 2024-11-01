const express = require('express')
const authRouter = express.Router()
const authController =require('../controllers/auth-controllers')
const {registerValidator, loginValidator} = require('../middlewares/validators')
const authenticate = require('../middlewares/authenticate')

// Import upload pic/img
const uploadAvatar = require("../middlewares/cloudinary-upload")

authRouter.post('/register',registerValidator,authController.register)
authRouter.post('/login',loginValidator,authController.login)
authRouter.post('/register-google',authController.loginGoogle)
authRouter.get('/getme',authenticate.auth,authController.getMe)
authRouter.post('/forgotPassword',authController.forgotPassword)
authRouter.put('/resetPassword/',authController.resetPassword)
authRouter.patch("/updateme", authenticate.auth, uploadAvatar.single("profileImage"), authController.updateUser)

module.exports = authRouter