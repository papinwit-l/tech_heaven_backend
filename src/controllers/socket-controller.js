module.exports.disconnect = (socket) => async (data) => {
  socket.disconnect();
  console.log("User disconnected");
};

module.exports.identify = (socket, io) => async (data) => {};
