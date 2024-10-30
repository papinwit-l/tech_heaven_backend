const createError = require("../utils/createError")
const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')
module.exports.register = (async (req,res,next) => {
    try {
        const {email,password,firstName,lastName,dateOfBirth} = req.input
        const {SignupMethod} = req.body
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(user){
            createError(400,"Email already exist")
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