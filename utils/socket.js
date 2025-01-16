const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin:" http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //now you can perform different events
    socket.on("joinChat", ({id,userId}) => {
        console.log("UserId is",userId)
        console.log("TargetUserId is",id)

         const roomId= [userId,id].join("_")
         console.log("RoomId is ",roomId);
         socket.join(roomId)


    });

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
