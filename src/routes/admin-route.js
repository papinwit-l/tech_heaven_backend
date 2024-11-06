const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
// controllers
const { getOrderAdmin, changeOrderStatus, deleteOrder,getUser, updateUser, deleteUser } = require('../controllers/admin-controller')


router.get("/admin/orders", getOrderAdmin)
router.patch("/admin/order-status", changeOrderStatus)
router.delete("/admin/delete-order/:orderId", deleteOrder)
router.get("/admin/getUser",authenticate.auth,getUser)
router.put("/admin/user/:userId",authenticate.auth,updateUser)
router.delete("/admin/user/:userId",authenticate.auth,deleteUser)

module.exports = router