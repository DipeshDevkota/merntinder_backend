const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Make sure this is correct
    },
  });

  io.on("connection", (socket) => {
    // Handling the joinChat event
    socket.on("joinChat", ({ id, firstName, userId }) => {
      console.log("UserId is", userId);
      console.log("TargetUserId is", id);
2
      const roomId = [userId, id].sort().join("_");
      console.log("RoomId is ", roomId);
      socket.join(roomId);
      console.log(firstName + " joined room", userId);
    });

    // Handling the sendMessage event
    socket.on("sendMessage", ({ id, firstName, text, userId }) => {
      console.log("Socket on sendMessage called");
      const roomId = [userId, id].sort().join("_");
      console.log("RoomId is ", roomId);

      // Emit the message to the room
      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    socket.on("disconnect", () => {
      // Handle disconnections if needed
    });
  });
};

module.exports = initializeSocket;
