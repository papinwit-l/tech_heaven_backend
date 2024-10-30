const createError = require("../utils/createError")
const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');


module.exports.register = (async (req,res,next) => {
    const {email,password,firstName,lastName,dateOfBirth} = req.input
    try {
        const {SignupMethod} = req.body
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(user){
            return createError(400,"Email already exist")
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data : {
                email,
                password : hashedPassword,
                firstName,
                lastName,
                dateOfBirth
            },
            select : {
                email : true,
                firstName : true,
                lastName : true,
                dateOfBirth : true
            }
        })
        res.status(201).json({newUser})
    } catch (err) {
        next(err)
        console.log(err)
    }
})
module.exports.login = (async(req,res,next) =>{
    const {email,password} = req.body
    try {
        const user= await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(!user){
            return createError(400, "Email is not Valid")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return createError(400,"Wrong Password")
        }
        const PayloadToken = {
            user : {
                id : user.id,
                email : user.email,
            }
        }
        const token = jwt.sign(PayloadToken,process.env.JWT_SECRET, {
            expiresIn : "30d"
        })
        res.status(200).json({ user :PayloadToken, token : token} )
    } catch (err) {
        next(err)
        console.log(err)
    }
})
