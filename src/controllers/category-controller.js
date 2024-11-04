const prisma = require("../config/prisma")

module.exports.createCategory = async(req, res, next) => {
    try {
        // code
        const { name, description } = req.body
        const role =  req.user.role
        if(role !== "ADMIN") {
          return createError(403, "forbidden")
        }
        const category = await prisma.productCategory.create({
            data: {
                name: name,
                description : description,
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports.listCategory = async(req, res, next) => {
    try {
        // code
        const category = await prisma.productCategory.findMany()
        res.send(category)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports.updateCategory = async(req, res, next) => {
    try {
        // code
        const role =  req.user.role
        if(role !== "ADMIN") {
          return createError(403, "forbidden")
        }
        const { id } = req.params; 
        const { name, description } = req.body; 
        const category = await prisma.productCategory.update({
            where: { 
                id: Number(id) 
            },
            data: {
                name,
                description
            }
        });
        res.send(category)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports.removeCategory = async(req, res, next) => {
    try {
        // code
        const { id } = req.params
        const role =  req.user.role
        if(role !== "ADMIN") {
          return createError(403, "forbidden")
        }
        const category = await prisma.productCategory.delete({
            where: {
                id: Number(id)
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        next(err)
    }
}