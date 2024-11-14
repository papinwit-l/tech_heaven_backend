const prisma = require("../config/prisma");

exports.getDashBoardData = async (req, res, next) => {
  try {
    // นับจำนวนผู้ใช้งานที่ isActive เป็น true
    const userCount = await prisma.user.count({
      where: {
        isActive: true,
      },
    });
    console.log("User Count:", userCount);

    // นับจำนวนผู้ใช้ใหม่ที่ลงทะเบียนภายใน 7 วันที่ผ่านมา
    const newUserCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });
    console.log("New User Count:", newUserCount);

    // นับจำนวนโปรโมชั่นที่ยัง active อยู่ในปัจจุบัน
    const activePromotions = await prisma.coupon.count({
      where: {
        startDate: {
          lte: new Date(),
        },
        expiry: {
          gte: new Date(),
        },
      },
    });
    console.log("Active Promotions:", activePromotions);

    // ดึงรายการ order และคำนวณรายได้รวม
    const orders = await prisma.order.findMany({
      select: { amount: true },
    });

    // คำนวณรายได้รวมจาก field amount
    const totalRevenue = +(orders.reduce(
      (sum, order) => sum + (parseFloat(order.amount) || 0),
      0
    ));
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    console.log("Total Revenue:", totalRevenue);
    console.log("Total Orders:", totalOrders);
    console.log('averageOrderValue', averageOrderValue)

    // นับจำนวนคำสั่งซื้อที่ยังอยู่ในสถานะ "PENDING"
    const pendingOrders = await prisma.order.count({
      where: {
        status: "PENDING",
      },
    });

    // นับจำนวน PCBuild ทั้งหมด
    const pcBuildCount = await prisma.pCBuild.count();

    // นับจำนวนคูปองที่ถูกใช้
    const couponUsedCount = await prisma.coupon.count({
      where: {
        couponused: {
          some: {} // คูปองที่ถูกใช้ในคำสั่งซื้อ
        }
      }
    })

    // แสดงข้อมูลคำสั่งซื้อแยกตามสถานะ
    const orderStatusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      }
    })

    // ส่งข้อมูล dashboard เป็น JSON
    const dashboardData = {
      userCount,
      newUserCount,
      activePromotions,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      pcBuildCount,
      couponUsedCount,
      orderStatusCounts,
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

