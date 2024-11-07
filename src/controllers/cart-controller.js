const prisma = require("../config/prisma");
const createError = require("../utils/createError");

module.exports.createCart = async (req, res, next) => {
  const { item } = req.body;
  const { id } = req.user;
  console.log("Show Item", item);
  // console.log(req.body)
  try {
    const existCart = await prisma.cart.findFirst({
      where: { userId: id },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: id,
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });

    let products = item.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));
    console.log("Products", products);

    let total = products.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    console.log("Total", total);

    const newCart = await prisma.cart.create({
        data: {
            CartItems: {
                create: products,
            },
            total: total,
            userId: id,
            status: "PENDING",
        }
    })
    // if (existCart) {
    //   // ถ้ามี Cart ของผู้ใช้อยู่แล้ว ให้เพิ่มรายการใหม่หรือตรวจสอบรายการซ้ำ
    //   if (item && item.length > 0) {
    //     const cartItems = await Promise.all(
    //       item.map(async (item) => {
    //         const existingCartItem = await prisma.cartItem.findFirst({
    //           where: {
    //             cartId: existCart.id,
    //             productId: item.productId,
    //           },
    //         });

    //         if (existingCartItem) {
    //           // ถ้ารายการนี้มีอยู่แล้ว ให้เพิ่ม quantity
    //           return await prisma.cartItem.update({
    //             where: { id: existingCartItem.id },
    //             data: { quantity: existingCartItem.quantity + item.quantity },
    //           });
    //         } else {
    //           // ถ้าไม่มีรายการนี้อยู่ใน cart ให้สร้างรายการใหม่
    //           console.log(item, "total");

    //           return await prisma.cartItem.create({
    //             data: {
    //               cartId: existCart.id,
    //               productId: item.productId,
    //               quantity: item.quantity,
    //               price: item.price,
    //               total: total,
    //             },
    //           });
    //         }
    //       })
    //     );

    //     res.status(200).json({ cart: existCart, cartItems });
    //   } else {
    //     // ถ้าไม่มี item ให้ส่งข้อมูล Cart กลับไปเฉพาะ
    //     res.status(200).json({ cart: existCart });
    //   }
    // } else {
    //   // ถ้า Cart ยังไม่มี ให้สร้าง Cart ใหม่
    //   const newCart = await prisma.cart.create({
    //     data: {
    //       userId: +id,
    //       status: "PENDING",
    //       total: 0,
    //     },
    //   });

    //   if (item && item.length > 0) {
    //     const cartItems = await Promise.all(
    //       item.map(async (item) => {
    //         return await prisma.cartItem.create({
    //           data: {
    //             cartId: newCart.id,
    //             productId: item.productId,
    //             quantity: item.quantity,
    //           },
    //         });
    //       })
    //     );

    //     res.status(201).json({ cart: newCart, cartItems });
    //   } else {
    //     res.status(201).json({ cart: newCart });
    //   }
    // }
  } catch (err) {
    next(err);
  }
};

module.exports.updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quantity, price } = req.body;

    const total = quantity * price;
    console.log(total, "total");
    const updateCartItem = await prisma.cartItem.update({
      where: {
        id: +cartItemId,
      },
      data: {
        quantity: quantity,
        total: total,
      },
    });
    const { cartId } = updateCartItem;
    const { _sum } = await prisma.cartItem.aggregate({
      _sum: {
        total: true,
      },
      where: {
        cartId: cartId,
      },
    });

    await prisma.cart.update({
      where: { id: cartId },
      data: { total: _sum.total || 0 },
    });

    res.json({ message: "cart item updated successfully", updateCartItem });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

module.exports.getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId, "userId");
    const cart = await prisma.cart.findFirst({
      where: {
        userId: +userId,
        status: "PENDING",
      },
      include: {
        CartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

module.exports.deleteCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: +cartItemId,
      },
    });
    if (!cartItem) {
      return createError(404, "Cart Item not Found");
    }
    const cartId = cartItem.cartId;
    await prisma.cartItem.delete({
      where: {
        id: +cartItemId,
      },
    });

    const { _sum } = await prisma.cartItem.aggregate({
      _sum: {
        total: true,
      },
      where: {
        cartId: cartId,
      },
    });
    await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        total: _sum.total || 0,
      },
    });
    res.status(200).json({ message: `deleteItem ${cartItemId} success` });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
