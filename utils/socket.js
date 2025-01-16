const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin:" http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //now you can perform different events
    socket.on("joinChat", ({id,firstName,userId}) => {
        console.log("UserId is",userId)
        console.log("TargetUserId is",id)

         const roomId= [userId,id].sort().join("_")
         console.log("RoomId is ",roomId);
         socket.join(roomId)
        console.log(firstName+"joined room",userId)



    });

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
