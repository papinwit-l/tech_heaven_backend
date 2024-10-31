const prisma = require("../config/prisma")

exports.createCategory = async(req, res) => {
    try {
        // code
        const { name, description } = req.body
        const category = await prisma.productCategory.create({
            data: {
                name: name,
                description : description,
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}

exports.listCategory = async(req, res) => {
    try {
        // code
        const category = await prisma.productCategory.findMany()
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}

exports.removeCategory = async(req, res) => {
    try {
        // code
        const { id } = req.params
        const category = await prisma.category.delete({
            where: {
                id: Number(id)
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}