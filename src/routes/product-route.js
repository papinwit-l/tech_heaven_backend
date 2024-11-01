const express = require('express')
const router = express.Router()
const Authenticate = require("../middlewares/authenticate")

// Controllers
const { createProductCPU, listProducts, updateProduct, removeProduct, listByProduct, searchFiltersProduct, createProductMonitor, createProductCPUCooler, createProductPowerSupply, createProductCase, createProductGPU, createProductMemory, createProductMotherboard, createProductDrive, readProduct } = require('../controllers/product-controller')

// @ENDPOINT http://localhost:3000/product

router.get("/products/:count", listProducts)
router.get("/product/:id", readProduct)
router.put("/product/:id", Authenticate.auth, updateProduct)
router.delete("/product/:id", Authenticate.auth, removeProduct)
router.post("/productby", Authenticate.auth, listByProduct)
router.post("/search/filters", Authenticate.auth, searchFiltersProduct)


router.post("/product/cpu", Authenticate.auth, createProductCPU)
router.post("/product/monitor", Authenticate.auth, createProductMonitor)
router.post("/product/cpucooler", Authenticate.auth, createProductCPUCooler)
router.post("/product/powersupply", Authenticate.auth, createProductPowerSupply)
router.post("/product/case", Authenticate.auth, createProductCase)
router.post("/product/gpu", Authenticate.auth, createProductGPU)
router.post("/product/memory", Authenticate.auth, createProductMemory)
router.post("/product/motherboard", Authenticate.auth, createProductMotherboard)
router.post("/product/drive", Authenticate.auth, createProductDrive)

module.exports = router