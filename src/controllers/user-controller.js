const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const tryCatch = require("../utils/try-catch");

const { Decimal } = require("@prisma/client");

exports.createOrder = tryCatch(async (req, res) => {
  // const { paymentMethod, status } = req.body;
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
      CartItems: true
    },
  });

  const amountTHB = amount / 100;
  console.log(cart)

  // console.log("Cart Items:", cartItems);

//   if (cartItems.length === 0) return res.status(400).send("Cart is empty");

  const createOrder = await prisma.order.create({
    data: {
      OrderItems: {
        create: cart.CartItems.map((item) => ({
          productId: item.id,
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

  // if (!cart) {
  //     const total = new Decimal(0);
  //     cart = await prisma.cart.create({
  //         data: {
  //             userId,
  //             status: "PENDING",
  //             total,
  //         },
  //     });
  //     console.log("New cart created:", cart);
  // } else {
  //     console.log("Existing cart found:", cart);
  // }

  // const cartItems = await prisma.cartItem.findMany({
  //     where: { cartId: cart.id },
  //     include: { product: true },
  // });

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.product.price * item.quantity,
//     0
//   );

//   const transaction = await prisma.$transaction(async (prisma) => {
//     try {
//       const order = await prisma.order.create({
//         data: {
//           userId: userId,
//           status: status || "PENDING",
//           paymentMethod: paymentMethod || "PAYPAL",
//           paymentId: id,
//           amount: amount.toString(),
//           currency: currency,
//         },
//       });

//       const orderItems = cartItems.map((item) => ({
//         orderId: order.id,
//         productId: item.productId,
//         quantity: item.quantity,
//       }));

//       await prisma.orderItem.createMany({
//         data: orderItems,
//       });

//       await prisma.cart.update({
//         where: { id: cart.id },
//         data: {
//           status: "SUCCESS",
//           total: new Decimal(totalPrice),
//         },
//       });

//       await prisma.cartItem.deleteMany({
//         where: { cartId: cart.id },
//       });

//       await prisma.cart.delete({
//         where: { id: cart.id },
//       });

//       res.send(order);
//     } catch (error) {
//       console.error("Error during order creation transaction:", error);
//       throw new Error("Transaction failed");
//     }
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Order created successfully",
//     order: transaction.order,
//   });
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
