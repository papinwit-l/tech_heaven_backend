const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      googleId: "1234567890",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      dateOfBirth: new Date("1990-01-01"),
      profileImage: "https://example.com/profile1.jpg",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.doe@example.com",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: new Date("1995-06-15"),
      role: "USER",
    },
  });

  // Seed Product Categories
  const category1 = await prisma.productCategory.create({
    data: {
      name: "Electronics",
      description: "Gadgets and devices",
    },
  });

  const category2 = await prisma.productCategory.create({
    data: {
      name: "PC Components",
      description: "Parts for custom PC builds",
    },
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      name: "Gaming Laptop",
      description: "High performance laptop for gaming",
      price: 1500.0,
      categoryId: category1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Graphics Card",
      description: "High-end GPU for gaming",
      price: 500.0,
      categoryId: category2.id,
    },
  });

  // Seed Promotions
  const promotion1 = await prisma.promotion.create({
    data: {
      title: "New User Discount",
      description: "10% off for new users",
      imageUrl: "https://example.com/promo1.jpg",
      promotionDiscount: 10.0,
      discountType: "PERCENTAGE",
      startDate: new Date("2024-01-01"),
      expirationDate: new Date("2024-12-31"),
      promotionType: "NEW_USER",
      promotionCode: "WELCOME10",
    },
  });

  // Seed User Promotions
  await prisma.userPromotion.create({
    data: {
      userId: user1.id,
      promotionId: promotion1.id,
      redeemedAt: new Date("2024-01-15"),
    },
  });

  // Seed Carts and CartItems
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
      status: "PENDING",
      total: 2000.0,
      CartItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 1500.0,
            total: 1500.0,
          },
          {
            productId: product2.id,
            quantity: 1,
            price: 500.0,
            total: 500.0,
          },
        ],
      },
    },
  });

  // Seed Orders and OrderItems
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      status: "PENDING",
      paymentMethod: "CREDIT_CARD",
      OrderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Seed Chat, Chat Members, and Messages
  const chat1 = await prisma.chat.create({
    data: {
      name: "General Chat",
      ChatMembers: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
      Messages: {
        create: [
          {
            userId: user1.id,
            message: "Hello, welcome to the chat!",
          },
          {
            userId: user2.id,
            message: "Thanks! Happy to be here.",
          },
        ],
      },
    },
  });

  console.log("Data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
