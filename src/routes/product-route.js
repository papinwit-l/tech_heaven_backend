const express = require('express')
const router = express.Router()

// Controllers
const { createProductCPU, listProducts, updateProduct, removeProduct, listByProduct, searchFiltersProduct, createProductMonitor, createProductCPUCooler, createProductPowerSupply, createProductCase, createProductGPU, createProductMemory, createProductMotherboard, createProductDrive } = require('../controllers/product-controller')

// @ENDPOINT http://localhost:3000/product

router.get("/products/:count", listProducts)
router.put("/product/:id", updateProduct)
router.delete("/product/:id", removeProduct)
router.post("/productby", listByProduct)
router.post("/search/filters", searchFiltersProduct)


router.post("/product/cpu", createProductCPU)
router.post("/product/monitor", createProductMonitor)
router.post("/product/cpucooler", createProductCPUCooler)
router.post("/product/powersupply", createProductPowerSupply)
router.post("/product/case", createProductCase)
router.post("/product/gpu", createProductGPU)
router.post("/product/memory", createProductMemory)
router.post("/product/motherboard", createProductMotherboard)
router.post("/product/drive", createProductDrive)

module.exports = router