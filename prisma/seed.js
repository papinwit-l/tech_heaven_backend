<<<<<<< Updated upstream
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
=======
// Import
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Seed Categories
const categories = [
  { name: "Laptops", description: "All kinds of laptops" },
  { name: "Mouse", description: "Various types of computer mice" },
  { name: "Keyboards", description: "Mechanical and non-mechanical keyboards" },
];

console.log("Seeding categories...");

// Seed Products
const products = [
  {
    name: "Gaming Laptop",
    description: "High performance gaming laptop with latest GPU and CPU.",
    price: 1500.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/1/400/400" },
      { imageUrl: "https://picsum.photos/id/2/400/400" },
      { imageUrl: "https://picsum.photos/id/3/400/400" },
      { imageUrl: "https://picsum.photos/id/4/400/400" },
    ],
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with customizable buttons.",
    price: 50.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/5/400/400" },
      { imageUrl: "https://picsum.photos/id/6/400/400" },
      { imageUrl: "https://picsum.photos/id/7/400/400" },
      { imageUrl: "https://picsum.photos/id/8/400/400" },
    ],
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with customizable switches.",
    price: 120.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/9/400/400" },
      { imageUrl: "https://picsum.photos/id/10/400/400" },
      { imageUrl: "https://picsum.photos/id/11/400/400" },
      { imageUrl: "https://picsum.photos/id/12/400/400" },
    ],
  },
  {
    name: "Business Laptop",
    description: "Lightweight laptop optimized for productivity and long battery life.",
    price: 900.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/13/400/400" },
      { imageUrl: "https://picsum.photos/id/14/400/400" },
      { imageUrl: "https://picsum.photos/id/15/400/400" },
      { imageUrl: "https://picsum.photos/id/16/400/400" },
    ],
  },
  {
    name: "Silent Click Mouse",
    description: "Mouse with silent clicks, perfect for quiet environments.",
    price: 30.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/17/400/400" },
      { imageUrl: "https://picsum.photos/id/18/400/400" },
      { imageUrl: "https://picsum.photos/id/19/400/400" },
      { imageUrl: "https://picsum.photos/id/20/400/400" },
    ],
  },
  {
    name: "Compact Keyboard",
    description: "Compact keyboard with minimal design and efficient layout.",
    price: 70.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/21/400/400" },
      { imageUrl: "https://picsum.photos/id/22/400/400" },
      { imageUrl: "https://picsum.photos/id/23/400/400" },
      { imageUrl: "https://picsum.photos/id/24/400/400" },
    ],
  },
  {
    name: "2-in-1 Laptop",
    description: "Versatile 2-in-1 laptop with touchscreen and stylus support.",
    price: 1100.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/25/400/400" },
      { imageUrl: "https://picsum.photos/id/26/400/400" },
      { imageUrl: "https://picsum.photos/id/27/400/400" },
      { imageUrl: "https://picsum.photos/id/28/400/400" },
    ],
  },
  {
    name: "Gaming Mouse",
    description: "High-DPI gaming mouse with RGB lighting.",
    price: 80.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/29/400/400" },
      { imageUrl: "https://picsum.photos/id/30/400/400" },
      { imageUrl: "https://picsum.photos/id/31/400/400" },
      { imageUrl: "https://picsum.photos/id/32/400/400" },
    ],
  },
  {
    name: "Wireless Mechanical Keyboard",
    description: "Wireless mechanical keyboard with long-lasting battery.",
    price: 150.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/33/400/400" },
      { imageUrl: "https://picsum.photos/id/34/400/400" },
      { imageUrl: "https://picsum.photos/id/35/400/400" },
      { imageUrl: "https://picsum.photos/id/36/400/400" },
    ],
  },
  {
    name: "Ultrabook",
    description: "Sleek and slim ultrabook with excellent performance.",
    price: 1300.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/37/400/400" },
      { imageUrl: "https://picsum.photos/id/38/400/400" },
      { imageUrl: "https://picsum.photos/id/39/400/400" },
      { imageUrl: "https://picsum.photos/id/40/400/400" },
    ],
  },
  {
    name: "Vertical Ergonomic Mouse",
    description: "Mouse designed for ergonomic comfort and wrist support.",
    price: 45.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/41/400/400" },
      { imageUrl: "https://picsum.photos/id/42/400/400" },
      { imageUrl: "https://picsum.photos/id/43/400/400" },
      { imageUrl: "https://picsum.photos/id/44/400/400" },
    ],
  },
  {
    name: "Full-Size Keyboard",
    description: "Full-size keyboard with dedicated number pad.",
    price: 100.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/45/400/400" },
      { imageUrl: "https://picsum.photos/id/46/400/400" },
      { imageUrl: "https://picsum.photos/id/47/400/400" },
      { imageUrl: "https://picsum.photos/id/48/400/400" },
    ],
  },
  {
    name: "Budget Laptop",
    description: "Affordable laptop suitable for everyday tasks.",
    price: 400.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/49/400/400" },
      { imageUrl: "https://picsum.photos/id/50/400/400" },
      { imageUrl: "https://picsum.photos/id/51/400/400" },
      { imageUrl: "https://picsum.photos/id/52/400/400" },
    ],
  },
  {
    name: "Trackball Mouse",
    description: "Mouse with trackball for easy navigation and precision.",
    price: 70.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/53/400/400" },
      { imageUrl: "https://picsum.photos/id/54/400/400" },
      { imageUrl: "https://picsum.photos/id/55/400/400" },
      { imageUrl: "https://picsum.photos/id/56/400/400" },
    ],
  },
  {
    name: "Tenkeyless Keyboard",
    description: "Compact tenkeyless keyboard for gamers and professionals.",
    price: 85.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/57/400/400" },
      { imageUrl: "https://picsum.photos/id/58/400/400" },
      { imageUrl: "https://picsum.photos/id/59/400/400" },
      { imageUrl: "https://picsum.photos/id/60/400/400" },
    ],
  },
  {
    name: "Performance Laptop",
    description: "Laptop designed for heavy-duty tasks like video editing.",
    price: 2000.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/61/400/400" },
      { imageUrl: "https://picsum.photos/id/62/400/400" },
      { imageUrl: "https://picsum.photos/id/63/400/400" },
      { imageUrl: "https://picsum.photos/id/64/400/400" },
    ],
  },
  {
    name: "Bluetooth Mouse",
    description: "Bluetooth mouse with long battery life and sleek design.",
    price: 60.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/65/400/400" },
      { imageUrl: "https://picsum.photos/id/66/400/400" },
      { imageUrl: "https://picsum.photos/id/67/400/400" },
      { imageUrl: "https://picsum.photos/id/68/400/400" },
    ],
  },
  {
    name: "Programmable Keyboard",
    description: "Keyboard with fully programmable keys and macro support.",
    price: 140.0,
    categoryId: 3,
    images: [
      { imageUrl: "https://picsum.photos/id/69/400/400" },
      { imageUrl: "https://picsum.photos/id/70/400/400" },
      { imageUrl: "https://picsum.photos/id/71/400/400" },
      { imageUrl: "https://picsum.photos/id/72/400/400" },
    ],
  },
  {
    name: "Student Laptop",
    description: "Laptop with features tailored for students.",
    price: 600.0,
    categoryId: 1,
    images: [
      { imageUrl: "https://picsum.photos/id/73/400/400" },
      { imageUrl: "https://picsum.photos/id/74/400/400" },
      { imageUrl: "https://picsum.photos/id/75/400/400" },
      { imageUrl: "https://picsum.photos/id/76/400/400" },
    ],
  },
  {
    name: "Gaming Mousepad",
    description: "Large mousepad optimized for gaming.",
    price: 25.0,
    categoryId: 2,
    images: [
      { imageUrl: "https://picsum.photos/id/77/400/400" },
      { imageUrl: "https://picsum.photos/id/78/400/400" },
      { imageUrl: "https://picsum.photos/id/79/400/400" },
      { imageUrl: "https://picsum.photos/id/80/400/400" },
    ],
  },
];

console.log("Seeding products...");

// Function for seeding categories
async function seedCategories() {
  for (const category of categories) {
    await prisma.productCategory.create({
      data: category,
    });
  }
}

// Function for seeding products
async function seedProducts() {
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        ProductImages: {
          create: product.images,
        },
      },
    });
    console.log(`Created product: ${createdProduct.name}`);
  }
}

// Run the seeding functions
async function run() {
  try {
    await seedCategories();
    await seedProducts();
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();


// Command
// node prisma/seed.js
>>>>>>> Stashed changes
