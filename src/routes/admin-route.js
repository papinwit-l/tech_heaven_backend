const express = require('express')
const router = express.Router()

// controllers
const { getOrderAdmin, changeOrderStatus, deleteOrder } = require('../controllers/admin-controller')


router.get("/admin/orders", getOrderAdmin)
router.patch("/admin/order-status/:orderId", changeOrderStatus)
router.delete("/admin/delete-order/:orderId", deleteOrder)


module.exports = router