const socketControler = require("../controllers/socket-controller");

const socketRoute = (io) => (socket) => {
  console.log(`User connected: ${socket.id}`);
  // socket.on("TEST", (data) => {
  //   console.log(data);
  // });

  socket.on("identify", socketControler.identify(socket, io));
  socket.on("disconnect", socketControler.disconnect(socket));
  socket.on("send_message", socketControler.sendMessage(socket, io));
  socket.on("new_chat", socketControler.newChat(socket, io));
  socket.on("join_chat", socketControler.joinChat(socket, io));
};
module.exports = socketRoute;
