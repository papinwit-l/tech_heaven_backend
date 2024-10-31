const express = require('express')
const router = express.Router()

// controllers
const { getOrderAdmin, changeOrderStatus } = require('../controllers/admin-controller')


router.get("/admin/orders", getOrderAdmin)
router.put("/admin/order-status", changeOrderStatus)


module.exports = router