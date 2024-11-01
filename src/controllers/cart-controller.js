const prisma = require('../config/prisma')
const createError = require('../utils/createError')

exports.createCart = async (req, res, next) => {
    const {userId} = req.body
    try{
        const existCart = await prisma.cart.findFirst({
            where : { userId}
        })
        if(existCart){
        return createError(400,'Cart already Exist')
        }
        const newCart = await prisma.cart.create({
            data : {
                
            }
        })
    }catch(err){
        next(err)
    }
}
