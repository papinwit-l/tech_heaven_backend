const { PrismaClientExtends } = require("@prisma/client/extension");
const prisma = require("../config/prisma");
const { all } = require("../routes/cart-routes");

//==== DISCONNECT ====
module.exports.disconnect = (socket) => async (data) => {
  socket.disconnect();
  console.log("User disconnected");
};

//==== IDENTIFY ====
module.exports.identify = (socket, io) => async (data) => {
  const socketUser = data.user;
  if (!socketUser) {
    socket.emit("error", { message: "No Socket User" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: +socketUser.id,
    },
  });
  if (!user) {
    socket.emit("error", { message: "User not found" });
    return;
  }
  if (user.role === "USER") {
    const member = await prisma.chatMember.findFirst({
      where: {
        userId: +user.id,
      },
    });
    if (!member) {
      socket.emit("error", { message: "Member User not found" });
      // create chat
      const newChat = await prisma.chat.create({
        data: {
          name: user.firstName + " " + user.lastName,
        },
      });
      const newMember = await prisma.chatMember.create({
        data: {
          userId: +user.id,
          chatId: newChat.id,
        },
      });
      const newNotify = await prisma.chatNotification.create({
        data: {
          chatId: newChat.id,
          isRead: true,
          isAdminRead: true,
        },
      });
      socket.join(newChat.id);
      socket.emit("receive-identify", {
        chatId: newChat.id,
      });
      console.log(`user ${user.id} join chat: ${newChat.id}`);
      notifyAdminToJoinChat(io, newChat.id);
    } else {
      const chat = await prisma.chat.findUnique({
        where: {
          id: +member.chatId,
        },
      });
      socket.join(chat.id);
      socket.emit("receive-identify", {
        chatId: chat.id,
      });
      console.log(`user ${user.id} join chat: ${chat.id}`);
      //notify admin to join chat
      notifyAdminToJoinChat(io, chat.id);
    }

    return;
  }
  if (user.role === "ADMIN") {
    //find all user chat that role is user
    const allChats = await prisma.chatMember.findMany({
      include: {
        user: true,
      },
    });
    const allUserChats = allChats.filter((chat) => chat.user.role === "USER");
    //force all admin to join chat
    allUserChats.forEach((chat) => {
      socket.join(chat.chatId);
      console.log(`user ${user.id} join chat: ${chat.chatId}`);
    });
    // socket.emit("test", {
    //   chats: allUserChats,
    // });
  }
};

//Notify Admin to join chat
const notifyAdminToJoinChat = async (io, chatId) => {
  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });
  admins.map((admin) => {
    io.emit("admin-join-chat-" + admin.id, {
      chatId: chatId,
    });
  });
};

//==== JOIN CHAT ====
module.exports.joinChat = (socket, io) => async (data) => {
  const userId = data.userId;
  const chatId = data.chatId;
  socket.join(chatId);
  console.log(`user ${userId} join chat: ${chatId}`);
};

//==== USER SEND MESSAGE ====//
module.exports.userSendMessage = (socket, io) => async (data) => {
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
    socket.emit("error", { message: "User Member not found" });
    return;
  }
  const newMessage = await prisma.message.create({
    data: {
      userId: +user.id,
      chatId: +chat.id,
      message: message,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          role: true,
        },
      },
    },
  });
  io.to(chat.id).emit("receive_message", {
    message: newMessage,
    chatId: chat.id,
  });
  io.to(chat.id).emit("admin_receive_message", {
    message: newMessage,
    chatId: chat.id,
  });
  chatNotify(io, chat.id, newMessage, user.role);
};

//==== ADMIN SEND MESSAGE ====//
module.exports.adminSendMessage = (socket, io) => async (data) => {
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
  if (user.role !== "ADMIN") {
    socket.emit("error", { message: "User not admin" });
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
  const newMessage = await prisma.message.create({
    data: {
      userId: +user.id,
      chatId: +chat.id,
      message: message,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          role: true,
        },
      },
    },
  });
  io.to(chat.id).emit("receive_message", {
    message: newMessage,
    chatId: chat.id,
  });
  io.to(chat.id).emit("admin_receive_message", {
    message: newMessage,
    chatId: chat.id,
  });
  //notify user
  chatNotify(io, chat.id, newMessage, user.role);
};

//==== Chat Notify ====//
const chatNotify = async (io, chatId, message, senderRole) => {
  try {
    console.log("call ChatNotify");
    //check notify exist
    const notify = await prisma.chatNotification.findFirst({
      where: {
        chatId: chatId,
      },
    });
    const chatMember = await prisma.chatMember.findFirst({
      where: {
        chatId: chatId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            role: true,
          },
        },
      },
    });
    // ==== if not exist create new notify ====
    if (!notify) {
      //if sender role is admin isAdminRead is true but if sender role is user isRead is true
      const newNotify = await prisma.chatNotification.create({
        data: {
          chatId: chatId,
          isRead: senderRole === "ADMIN" ? false : true,
          isAdminRead: senderRole === "ADMIN" ? true : false,
          messageId: message.id,
        },
        include: {
          message: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      });
      io.to(chatId).emit("chatNotify", {
        notify: newNotify,
        chatId: chatId,
        chat: chatMember,
      });
      return;
    }
    // ==== if exist update notify ====
    //if sender role is admin isAdminRead is true but if sender role is user isRead is true
    const updateNotify = await prisma.chatNotification.update({
      where: {
        id: notify.id,
      },
      data: {
        isRead: senderRole === "ADMIN" ? false : true,
        isAdminRead: senderRole === "ADMIN" ? true : false,
        messageId: message.id,
      },
      include: {
        message: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
    io.to(chatId).emit("chatNotify", {
      notify: updateNotify,
      chatId: chatId,
      chat: chatMember,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports.updateChatNotify = (socket, io) => async (data) => {
  // console.log("call updateChatNotify");
  const userId = data.userId;
  const chatId = data.chatId;
  if (!userId) {
    socket.emit("error", { message: "User ID is required" });
    return;
  }
  if (!chatId) {
    socket.emit("error", { message: "Chat ID is required" });
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
  const chatNotify = await prisma.chatNotification.findFirst({
    where: {
      chatId: chatId,
    },
  });

  if (user.role === "ADMIN") {
    const updateNotify = await prisma.chatNotification.update({
      where: {
        id: chatNotify.id,
      },
      data: {
        isAdminRead: true,
      },
    });
    //notify other admin
    io.to(chatId).emit("updateAdminChatNotify", {
      notify: updateNotify,
      chatId: chatId,
    });
  } else {
    const updateNotify = await prisma.chatNotification.update({
      where: {
        id: chatNotify.id,
      },
      data: {
        isRead: true,
      },
    });
  }
};
