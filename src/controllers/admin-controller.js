const prisma = require("../config/prisma")

exports.getOrderAdmin = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true, // ดึงข้อมูลของผู้ใช้ที่ทำการสั่งซื้อ
                OrderItems: {
                    include: {
                        product: true // ดึงข้อมูลของสินค้าที่รวมในคำสั่งซื้อแต่ละรายการ
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' // เรียงลำดับจากใหม่ไปเก่า
            }
        })
        // res.send("getOrderAdmin")
        // console.log("hihi")
        res.send(orders)
    } catch (err) {
        console.log(err)
        next(err)
        // res.status(500).json({ message: "Server error"})
    }

}

exports.changeOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "RETURNED", "EXCHANGED", "COMPLETED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        // ตรวจสอบว่ามี orderId นี้ในระบบหรือไม่
        const order = await prisma.order.findUnique({
            where: {
                id: Number(orderId)
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const orderUpdate = await prisma.order.update({
            where: {
                id: Number(orderId)
            },
            data: {
                status
            }
        });

        res.json({ message: "Order status updated successfully", order: orderUpdate });
    } catch (err) {
        console.error(err);
        // res.status(500).json({ message: "Server error" });
        next(err)
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.delete({
            where: {
                id: orderId
            }
        });
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error(err);
        // res.status(500).json({ message: "Server error" });
        next(err)
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const member = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                profileImage: true,
                dateOfBirth: true,
                firstName: true,
                lastName: true,
                updatedAt: true,
                createdAt: true,
                isActive: true
            }
        })
        res.status(200).json(member)
    } catch (err) {
        console.log(err)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { role, isActive } = req.body
        const user = await prisma.user.update({
            where: {
                id: +userId
            },
            data: {
                isActive: isActive,
                role: role
            }
        })
        res.status(200).json(user)
    } catch (err) {

        console.log(err)
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    const { userId } = req.params
    try {
        const member = await prisma.user.delete({
            where: {
                id: +userId
            }
        })
    } catch (err) {
        console.log(err)
    }
    // res.status(200).json("Delete Successfully")
    next(err)
}


module.exports.createCoupon = async (req, res, next) => {
    const { name, expiry, discount, amount,startDate } = req.body
    const expiryConvert = new Date(req.body.expiry)
    const startDateConvert = new Date(req.body.startDate)
    console.log(req.body)
    try {
        const coupon = await prisma.coupon.create({
            data: {
                name,
                expiry : expiryConvert,
                startDate : startDateConvert,
                discount : +discount,
                amount : +amount
            }
        })
        res.status(200).json(coupon)
    } catch (err) {
        next(err)
        console.log(err)
    }
}

module.exports.getCoupon = async (req,res,next) => {
    try {
        const result = await prisma.coupon.findMany()
        res.status(200).json(result)
    } catch (err) {
        next(err)
        console.log(err)
    }
}

module.exports.deleteCoupon = async(req,res,next) => {
    try {
        const {couponId} = req.params
        const deleteCoupon = await prisma.coupon.delete({
            where : {
                id : +couponId
            }
        })
        res.status(200).json("Successfully deleted")
    } catch (err) {
        next(err)
        console.log(err)
    }
}

module.exports.editCoupon = async (req, res, next) => {
    try {
        const { couponId } = req.params;
        const { discount, startDate, expiry, amount } = req.body;
        const expiryConvert = new Date(req.body.expiry)
    const startDateConvert = new Date(req.body.startDate)

        // Validate the incoming data
        if (!discount || !startDateConvert || !expiryConvert || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: { id: +couponId },
        });

        if (!existingCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        // Perform the update
        const updatedCoupon = await prisma.coupon.update({
            where: { id: +couponId },
            data: { discount : +discount, startDate : startDateConvert, expiry : expiryConvert, amount : +amount },
        });

        // Verify the updated coupon
        const coupon = await prisma.coupon.findUnique({
            where: { id: +couponId },
        });

        console.log("Updated Coupon:", coupon); 
        res.status(200).json(coupon); 
    } catch (err) {
        next(err);
        console.log(err);
    }
};
