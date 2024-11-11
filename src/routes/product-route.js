const express = require('express')
const router = express.Router()
const Authenticate = require("../middlewares/authenticate")

// Controllers
const { createProductCPU, listProducts, updateProduct, removeProduct, listByProduct, searchFiltersProduct, createProductMonitor, createProductCPUCooler, createProductPowerSupply, createProductCase, createProductGPU, createProductMemory, createProductMotherboard, createProductDrive, readProduct, createImages, removeImage, createProductAccessory, deleteProductImage } = require('../controllers/product-controller')

// @ENDPOINT http://localhost:8000/product

router.get("/products/:count", listProducts)
router.get("/product/:id", readProduct)
router.put("/product/:id", Authenticate.auth, updateProduct)
router.delete("/product/:id", Authenticate.auth, removeProduct)
router.post("/productby", Authenticate.auth, listByProduct)
router.post("/search/filters", Authenticate.auth, searchFiltersProduct)

// images
router.post("/images", Authenticate.auth, createImages)
router.post("/removeimages", Authenticate.auth, removeImage)
router.post("/remove-product-image", Authenticate.auth, deleteProductImage)


router.post("/product/cpu", Authenticate.auth, createProductCPU)
router.post("/product/monitor", Authenticate.auth, createProductMonitor)
router.post("/product/cpucooler", Authenticate.auth, createProductCPUCooler)
router.post("/product/powersupply", Authenticate.auth, createProductPowerSupply)
router.post("/product/case", Authenticate.auth, createProductCase)
router.post("/product/gpu", Authenticate.auth, createProductGPU)
router.post("/product/memory", Authenticate.auth, createProductMemory)
router.post("/product/motherboard", Authenticate.auth, createProductMotherboard)
router.post("/product/drive", Authenticate.auth, createProductDrive)
router.post("/product/accessory", Authenticate.auth, createProductAccessory)

module.exports = router