const prisma = require("../config/prisma")

exports.getOrderAdmin = async(req, res) => {
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
        res.status(500).json({ message: "Server error"})
    }

}

exports.changeOrderStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "RETURNED", "EXCHANGED", "COMPLETED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        // ตรวจสอบว่ามี orderId นี้ในระบบหรือไม่
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const orderUpdate = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status
            }
        });

        res.json({ message: "Order status updated successfully", order: orderUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteOrder = async(req, res) => {
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
        res.status(500).json({ message: "Server error" });
    }
}