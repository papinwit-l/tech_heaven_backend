const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User data
const userData = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "securepassword",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "anothersecurepassword",
  },
  // Add additional users as needed...
];

// Product data
const productData = [
  {
    name: "Gaming Laptop",
    description: "High performance gaming laptop with latest GPU and CPU.",
    price: 1500.0,
    categoryId: 1,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/1/400/400" },
        { imageUrl: "https://picsum.photos/id/2/400/400" },
      ],
    },
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with customizable buttons.",
    price: 50.0,
    categoryId: 2,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/5/400/400" },
        { imageUrl: "https://picsum.photos/id/6/400/400" },
      ],
    },
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with customizable lighting.",
    price: 120.0,
    categoryId: 2,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/10/400/400" },
        { imageUrl: "https://picsum.photos/id/11/400/400" },
      ],
    },
  },
  {
    name: "4K Gaming Monitor",
    description: "Ultra HD gaming monitor with fast refresh rate.",
    price: 700.0,
    categoryId: 3,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/15/400/400" },
        { imageUrl: "https://picsum.photos/id/16/400/400" },
      ],
    },
  },
  {
    name: "Gaming Headset",
    description: "Surround sound gaming headset with noise cancellation.",
    price: 80.0,
    categoryId: 2,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/20/400/400" },
        { imageUrl: "https://picsum.photos/id/21/400/400" },
      ],
    },
  },
  {
    name: "Solid State Drive (SSD)",
    description: "1TB SSD for faster load times and performance.",
    price: 150.0,
    categoryId: 4,
    images: {
      create: [
        { imageUrl: "https://picsum.photos/id/25/400/400" },
        { imageUrl: "https://picsum.photos/id/26/400/400" },
      ],
    },
  },
];

// Function to add users
async function addUsers() {
  try {
    await prisma.user.createMany({
      data: userData,
      skipDuplicates: true, // Skip duplicates if they exist
    });
    console.log("Users added successfully.");
  } catch (error) {
    console.error("Error adding users:", error);
  }
}

// Function to add products
async function addProducts() {
  try {
    await prisma.product.createMany({
      data: productData,
      skipDuplicates: true, // Optional: skip products that already exist
    });
    console.log("Products added successfully.");
  } catch (error) {
    console.error("Error adding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute functions
async function run() {
  await addUsers();
  await addProducts();
}

run();
