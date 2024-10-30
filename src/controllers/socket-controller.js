const prisma = require("../config/prisma");

module.exports.disconnect = (socket) => async (data) => {
  socket.disconnect();
  console.log("User disconnected");
};

module.exports.identify = (socket, io) => async (data) => {
  const userId = data.userId;
  if (!userId) {
    socket.emit("error", { message: "User ID is required" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
  });
  if (!user) {
    socket.emit("error", { message: "User not found" });
    return;
  }
  const chatMembers = await prisma.chatMember.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!chatMembers) {
    socket.emit("error", { message: "User not found" });
    return;
  }
  const chat = await prisma.chat.findUnique({
    where: {
      id: +chatMembers.chatId,
    },
  });
  if (!chat) {
    socket.emit("error", { message: "Chat not found" });
    return;
  }
  socket.join(chat.id);

  io.to(chat.id).emit("user_joined-" + userId, { message: "User joined" });
};
