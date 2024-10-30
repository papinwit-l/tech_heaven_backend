const notFound = (req,res,next) => {
    res.status(404).json({message : 'Internal Server Error'})
}

module.exports = notFound