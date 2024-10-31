const jwt = require("jsonwebtoken")
const createError = require('../utils/createError');
const prisma = require('../config/prisma');


module.exports.auth = (async(req,res,next)=>{
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
          createError({
            message: 'unauthenticated',
            statusCode: 401
          });
        }
        const accessToken = authorization.split(' ')[1];
        if(accessToken === null){
            createError({
                message: 'unauthenticated',
                statusCode: 401
              });
              return
        }
        // console.log("object",accessToken)
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        // console.log(payload,'111111111111111111111111111111')
        const user = await prisma.user.findUnique({ where: { id: payload.user.id } });
        if (!user) {
          createError({
            message: 'user was not found',
            statusCode: 400
          });
        }
        delete user.password;
        req.user = user;
        next();
   
})