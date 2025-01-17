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

    socket.on("sendMessage", ({id,firstName,newMessage,userId}) => {
      console.log("Socketonsendmessagecalled")
      console.log("Message that is sent to the cliens id ",id)
      console.log("Loggedin Users Id",userId)
      console.log("Loggedin Users firstName",firstName)
      console.log("Message while sending the message",newMessage)

      const roomId= [userId,id].sort().join("_");
         console.log("RoomId is ",roomId);
      
         io.to(roomId).emit("messageReceived",{firstName,text})
      

    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
