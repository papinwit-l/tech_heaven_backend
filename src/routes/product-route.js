const express = require('express')
const router = express.Router()

// Controllers
const { createProductCPU, listProducts, updateProduct, removeProduct, listByProduct, searchFiltersProduct } = require('../controllers/product-controller')

// @ENDPOINT http://localhost:3000/product

router.post("/product", createProductCPU)
router.get("/products/:count", listProducts)
router.put("/product/:id", updateProduct)
router.delete("/product/:id", removeProduct)
router.post("/productby", listByProduct)
router.post("/search/filters", searchFiltersProduct)

module.exports = router