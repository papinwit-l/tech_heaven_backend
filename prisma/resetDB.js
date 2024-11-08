
// Import
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Data
async function run() {
  try {
    // Drop and recreate the database
    await prisma.$executeRawUnsafe('DROP DATABASE `cc18-tech-heaven`');
    await prisma.$executeRawUnsafe('CREATE DATABASE `cc18-tech-heaven`');
    console.log("Database reset successfully!");
  } catch (error) {
    console.error("Error resetting the database:", error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

console.log("Resetting DB...");
run();



// Command 
// node prisma/resetDB.js > npx prisma db push > node prisma/seed.js  
