const prisma = require("../config/prisma");
const createError = require("../utils/createError");

module.exports.createCart = async (req, res, next) => {
    console.log("Show Item", req.body);
    const { item } = req.body;
    const { id } = req.user;
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
    res.send(newCart);
  } catch (err) {
    console.log(err)
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
