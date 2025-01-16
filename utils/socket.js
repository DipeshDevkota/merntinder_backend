const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin:" http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //now you can perform different events
    socket.on("joinChat", ({userId,targetUserId}) => {
        console.log("UserId is",userId)
        console.log("TargetUserId is",targetUserId)

         const roomId= [userId,targetUserId].join("_")
         console.log("RoomId is ",roomId);
         socket.join(roomId)


    });

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
