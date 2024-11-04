const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const tryCatch = require("../utils/try-catch");

exports.createOrder = tryCatch(async (req, res) => {
    const { paymentMethod } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).send("User not authenticated");
    }

    const userId = +req.user.id;

    const cart = await prisma.cart.findFirst({
        where: {
            userId: userId,
            status: "PENDING",
        },
    });
    if (!cart) return res.status(400).send("Cart not found");

    const cartItems = await prisma.cartItem.findMany({
        where: {
            cartId: cart.id,
        },
        include: {
            product: true,
        },
    });
    console.log("Cart Items:", cartItems);

    if (cartItems.length === 0) return res.status(400).send("Cart is empty");

    console.log("Cart ID:", cart.id);
    console.log("Cart Items IDs:", cartItems.map(item => item.id));

    // Validate payment method
    const validPaymentMethods = Object.values(PaymentMethod);
    if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).send("Invalid payment method");
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId: userId,
                status: "PROCESSING",
                paymentMethod: paymentMethod,
            },
        });

        for (const item of cartItems) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                },
            });
        }

        await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                status: "SUCCESS",
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });

        res.send(order); // Return the created order
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Internal server error");
    }
});

  

exports.getOrderByUserId = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      user: true,
      OrderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(orders);
});
