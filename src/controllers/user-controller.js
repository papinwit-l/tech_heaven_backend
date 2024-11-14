const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const tryCatch = require("../utils/try-catch");

const { Decimal } = require("@prisma/client");

exports.createOrder = tryCatch(async (req, res) => {
  const { id, amount, currency, status, payment_method_types } = req.body.paymentIntent;
  console.log({ id, amount, currency });

  if (!req.user || !req.user.id) {
    console.log("User not authenticated:", req.user);
    return res.status(401).send("User not authenticated");
  }

  const userId = +req.user.id;

  let cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      CartItems: true,
    },
  });

  console.log("Fetched Cart:", cart);
  console.log("Cart Items:", cart?.CartItems);

  if (!cart || cart.CartItems.length === 0) {
    return res.status(400).send("Cart is empty or not found.");
  }

  const amountTHB = amount / 100;

  const transaction = await prisma.$transaction(async (prisma) => {
    const createOrder = await prisma.order.create({
      data: {
        OrderItems: {
          create: cart.CartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        userId: userId,
        status: status,
        paymentMethod: payment_method_types[0],
        paymentId: id,
        amount: amountTHB.toString(),
        currency: currency,
      },
    });

    console.log("Created Order:", createOrder);

    const deletedCart = await prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    console.log("Deleted Cart Result:", deletedCart);

    return createOrder;
  }).catch((error) => {
    console.error("Error in transaction:", error);
    throw new Error("Failed to create order and delete cart");
  });

  res.status(200).json({
    success: true,
    message: "Order created and cart deleted successfully",
  });
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

exports.addAddress = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const { address } = req.body;
  await prisma.userAddress.create({
    data: {
      userId: userId,
      address: address,
    },
  });
  res.send("Address added successfully");
})

exports.getAllAddress = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  const address = await prisma.userAddress.findMany({
    where: {
      userId: userId,
    }
  })
  console.log(address)
  res.send(address)
})

exports.updateAddress = tryCatch(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;
  const { address } = req.body;

  await prisma.userAddress.update({
    where: {
      id: +addressId,
      userId: userId
    },
    data: {
      address: address
    },
  });

  res.send("Address updated successfully");
});

exports.deleteAddress = tryCatch(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;
  await prisma.userAddress.delete({
    where: {
      id: +addressId,
      userId: userId
    },
  });
  res.send("Address deleted successfully");
});