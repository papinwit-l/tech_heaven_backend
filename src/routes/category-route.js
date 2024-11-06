const express = require('express')
const router = express.Router()
const Authenticate = require("../middlewares/authenticate")
// Controllers
const { createCategory, listCategory, removeCategory, updateCategory } = require('../controllers/category-controller')

router.post("/",Authenticate.auth, createCategory)
router.get("/",Authenticate.auth, listCategory)
router.put("/:id", Authenticate.auth, updateCategory)
router.delete("/:id",Authenticate.auth, removeCategory)

module.exports = router