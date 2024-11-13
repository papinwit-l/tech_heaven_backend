const prisma = require("../config/prisma");

exports.getDashBoardData = async (req, res, next) => {
  try {
    const userCount = await prisma.user.count({
      where: {
        isActive: true,
      },
    });
    console.log("User Count:", userCount); // เช็คค่า userCount

    const newUserCount = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)), // ผู้ใช้ที่ลงทะเบียนใน 7 วันที่ผ่านมา
          },
        },
      });
      console.log('newUserCount', newUserCount)

    const activePromotions = await prisma.promotion.count({
      where: {
        startDate: {
          lte: new Date(),
        },
        expirationDate: {
          gte: new Date(),
        },
      },
    });
    console.log("Active Promotions:", activePromotions); // เช็คค่า activePromotions

    const orders = await prisma.order.findMany({
      select: { amount: true },
    });

    // แปลง `amount` เป็นตัวเลขแล้วรวมค่าทั้งหมด
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.amount || "0"),
      0
    );
    const totalOrders = orders.length;
    console.log("Total Revenue:", totalRevenue);
    console.log("Total Orders:", totalOrders);

    const pendingOrders = await prisma.order.count({
        where: {
          status: "PENDING", // คำสั่งซื้อที่ยังไม่ชำระเงิน
        },
      });

    const pcBuildCount = await prisma.pCBuild.count();

    const dashboardData = {
      userCount,
      newUserCount,
      activePromotions,
      totalOrders,
      totalRevenue,
      pendingOrders,
      pcBuildCount,
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
