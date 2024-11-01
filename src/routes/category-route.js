const express = require('express')
const router = express.Router()
const Authenticate = require("../middlewares/authenticate")
// Controllers
const { createCategory, listCategory, removeCategory } = require('../controllers/category-controller')

router.post("/category",Authenticate.auth, createCategory)
router.get("/category", listCategory)
router.delete("/category/:id",Authenticate.auth, removeCategory)

module.exports = router