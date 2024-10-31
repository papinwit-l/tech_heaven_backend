const express = require('express')
const router = express.Router()

// Controllers
const { createCategory, listCategory, removeCategory } = require('../controllers/category-controller')

router.post("/category", createCategory)
router.get("/category", listCategory)
router.delete("/category/:id", removeCategory)

module.exports = router