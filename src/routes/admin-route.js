const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
// controllers
const { getOrderAdmin, changeOrderStatus, deleteOrder,getUser, updateUser, deleteUser, createCoupon, getCoupon, deleteCoupon, editCoupon } = require('../controllers/admin-controller')


router.get("/admin/orders", getOrderAdmin)
router.patch("/admin/order-status/:orderId", changeOrderStatus)
router.delete("/admin/delete-order/:orderId", deleteOrder)
router.get("/admin/getUser",authenticate.auth,getUser)
router.put("/admin/user/:userId",authenticate.auth,updateUser)
router.delete("/admin/user/:userId",authenticate.auth,deleteUser)
router.post("/admin/createCoupon",authenticate.auth,createCoupon)
router.get("/admin/getCoupon",authenticate.auth,getCoupon)
router.delete("/admin/deleteCoupon/:couponId",authenticate.auth,deleteCoupon)
router.put("/admin/editCoupon/:couponId",authenticate.auth,editCoupon)

module.exports = router