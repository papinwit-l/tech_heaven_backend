const socketControler = require("../controllers/socket-controller");

const socketRoute = (io) => (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("identify", socketControler.identify(socket, io));
  socket.on("disconnect", socketControler.disconnect(socket));
};
module.exports = socketRoute;
