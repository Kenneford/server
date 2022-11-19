const serverChat = (sSocket) => {
  //   console.log("a user connected!");
  sSocket.on("connection", (socket) => {
    socket.on("join", ({ name }) => {
      console.log(`${name} has joined!`);
      // callback();
      //THIS EMIT FUNCTION WILL SEND BACK NOTIFICATION MEANT FOR OTHER USER
      //   sSocket.emit("joined user", `${name} has joined!`);

      //INSTEAD WE USE dot-BROADCAST-dot-EMIT
      socket.broadcast.emit("joined user", `${name} has joined!`);
    });

    //RECEIVING MESSAGE FROM CLIENT
    socket.on("message", (message) => {
      console.log(message);
      //AFTER RECEIVING, SEND IT TO OTHER USERS
      sSocket.emit("message", message);
    });

    socket.on("disconnected", () => {
      console.log("user disconnected!");
    });
  });
};
module.exports = { serverChat };
