const { PrismaClientExtends } = require("@prisma/client/extension");
const prisma = require("../config/prisma");

//==== DISCONNECT ====
module.exports.disconnect = (socket) => async (data) => {
  socket.disconnect();
  console.log("User disconnected");
};

//==== IDENTIFY ====
module.exports.identify = (socket, io) => async (data) => {
  console.log(data);
  const userId = data.user.id;
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
  if (user.role === "USER") {
    const member = await prisma.chatMember.findUnique({
      where: {
        userId: +userId,
      },
    });
    if (!member) {
      socket.emit("error", { message: "Member User not found" });
      // create chat
      const newChat = await prisma.chat.create({
        data: {
          name: "New Chat",
        },
      });
      const newMember = await prisma.chatMember.create({
        data: {
          userId: +userId,
          chatId: newChat.id,
        },
      });
      socket.join(newChat.id);
    }
    const chat = await prisma.chat.findUnique({
      where: {
        id: +member.chatId,
      },
    });
    socket.join(chat.id);
    return;
  }
  if (user.role === "ADMIN") {
    const allUserChats = await prisma.chatMember.findMany({
      where: {
        userId: +userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
    socket.emit("test", {
      chats: allUserChats,
    });
  }
};

//==== SEND MESSAGE ====//
module.exports.sendMessage = (socket, io) => async (data) => {
  const userId = data.userId;
  const chatId = data.chatId;
  const message = data.message;
  if (!userId) {
    socket.emit("error", { message: "User ID is required" });
    return;
  }
  if (!chatId) {
    socket.emit("error", { message: "Chat ID is required" });
    return;
  }
  if (!message) {
    socket.emit("error", { message: "Message is required" });
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
  const chat = await prisma.chat.findUnique({
    where: {
      id: +chatId,
    },
  });
  if (!chat) {
    socket.emit("error", { message: "Chat not found" });
    return;
  }
  const chatMember = await prisma.chatMember.findFirst({
    where: {
      userId: user.id,
      chatId: chat.id,
    },
  });
  if (!chatMember) {
    socket.emit("error", { message: "User not found" });
    return;
  }
  const newMessage = await prisma.message.create({
    data: {
      userId: user,
      chatId: chat.id,
      message: message,
    },
  });
  io.to(chat.id).emit("new_message", {
    message: newMessage,
    user: user,
    chatId: chat.id,
  });
  socket.emit("notify-" + chatId, {
    message: newMessage,
    chatId: chat.id,
    user: user,
  });
};

//==== New Chat ====
module.exports.newChat = (socket, io) => async (data) => {
  const userId = data.userId;
  const newChat = await prisma.chat.create({
    data: {
      name: data.name,
    },
  });

  const chatMembers = await prisma.chatMember.create({
    data: {
      userId: userId,
      chatId: newChat.id,
    },
  });

  // user join chat
  socket.join(newChat.id);

  // force all admin to join chat
  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  admins.map((admin) => {
    socket.emit("to_join-" + admin.id, {
      chatId: newChat.id,
    });
  });

  io.to(newChat.id).emit("new_chat", {
    chat: newChat,
  });
};

//==== Join Chat ====
module.exports.joinChat = (socket, io) => async (data) => {
  const userId = data.userId;
  const chatId = data.chatId;
  socket.join(chatId);
  io.to(chatId).emit("user_joined-" + userId, { message: "User joined" });
};
