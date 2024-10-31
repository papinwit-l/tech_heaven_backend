exports.createCategory = async(req, res) => {
    try {
        // code
        res.send("Hello createCategory")
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}

exports.listCategory = async(req, res) => {
    try {
        // code
        res.send("Hello listCategory")
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}

exports.removeCategory = async(req, res) => {
    try {
        // code
        console.log(req.params.id)
        res.send("Hello removeCategory")
    } catch (err) {
        console.log(err)
        res.status(500).json({ message : "Server error"})
    }
}