const socketControler = require("../controllers/socket-controller");

const socketRoute = (io) => (socket) => {
  console.log(`User connected: ${socket.id}`);
  // socket.on("TEST", (data) => {
  //   console.log(data);
  // });

  socket.on("identify", socketControler.identify(socket, io));
  socket.on("disconnect", socketControler.disconnect(socket));
  socket.on("user-send-message", socketControler.userSendMessage(socket, io));
  socket.on("admin-send-message", socketControler.adminSendMessage(socket, io));
  socket.on("join-chat", socketControler.joinChat(socket, io));
  socket.on("update-chat-notify", socketControler.updateChatNotify(socket, io));
};
module.exports = socketRoute;
