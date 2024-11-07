const prisma = require('../config/prisma');

module.exports.createWishlist = async (req, res, next) => {
    try {
      const { productId } = req.body; 
      const userId = req.user.id;
  
      const existingWishlist = await prisma.wishlist.findFirst({
        where: { userId, productId },
      });
  
      if (existingWishlist) {
        return res.status(400).json({ message: "Product is already in the wishlist" });
      }
  
      const newWishlist = await prisma.wishlist.create({
        data: { userId, productId },
      });
  
      res.status(201).json(newWishlist);
    } catch (err) {
      next(err);
    }
};

module.exports.deleteWishlist = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.productId); // แปลง productId เป็นจำนวนเต็ม
      const userId = req.user.id; 
  
      const wishlistItem = await prisma.wishlist.findFirst({
        where: { userId, productId },
      });
  
      if (!wishlistItem) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
  
      await prisma.wishlist.delete({
        where: { id: wishlistItem.id },
      });
  
      res.status(200).json({ message: "Product removed from wishlist successfully" });
    } catch (err) {
      next(err);
    }
  };
  

module.exports.getWishlist = async (req, res, next) => {
    const userId = req.user.id; // ใช้ userId จาก token
    try {
      const wishlistItems = await prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              ProductImages: true,
            },
          },
        },
      });
  
      if (!wishlistItems.length) {
        return res.status(404).json({ message: "No items in wishlist" });
      }
  
      res.status(200).json(wishlistItems);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
