require("dotenv").config()
const prisma = require("../src/config/prisma")

async function run(){
    await prisma.$executeRawUnsafe("DROP DATABASE TechHeaven")
    await prisma.$executeRawUnsafe("CREATE DATABASE TechHeaven")

}
console.log("Reset DB...")
run()
