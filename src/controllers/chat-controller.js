const prisma = require("../models/prisma");
const createError = require("../utils/createError");

module.exports.getAllChats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });
    if (!user) {
      return createError(400, "User not found");
    }
    if (user.role !== "ADMIN") {
      return createError(400, "User not admin");
    }
    const chatMembers = await prisma.chatMember.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });
    const chatList = chatMembers.filter(
      (chatMember) => chatMember.user.role === "USER"
    );
    res.json(chatList);
  } catch (error) {
    console.log;
    next(error);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });
    if (!user) {
      return createError(400, "User not found");
    }
    const chatMembers = await prisma.chatMember.findFirst({
      where: {
        userId: +userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });
    const chatMessage = await prisma.message.findMany({
      where: { chatId: +chatMembers.chatId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });
    res.json(chatMessage);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getChatById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const chatId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });
    if (!user) {
      return createError(400, "User not found");
    }
    if (user.role !== "ADMIN") {
      return createError(401, "User not admin");
    }
    const chatMessage = await prisma.message.findMany({
      where: { chatId: +chatId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });
    res.json(chatMessage);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
