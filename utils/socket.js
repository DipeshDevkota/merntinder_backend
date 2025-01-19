const socket = require("socket.io");
const crypto = require("crypto");
const ChatModel = require("../models/chat");

const getSecretRoomId =(userId,id)=>{
  return crypto
  .createHash("sha256")
  .update([userId,id].sort().join("$"))
  .digest("hex")


}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // User joins a chat room
    socket.on("joinChat", ({ id, firstName, userId }) => {
      console.log("UserId:", userId, "TargetUserId:", id);

      const roomId = getSecretRoomId(id,userId);
      console.log("RoomId:", roomId);

      if (!socket.rooms.has(roomId)) {
        socket.join(roomId);
        console.log(`${firstName} joined room ${roomId}`);
      } else {
        console.log(`${firstName} already in room ${roomId}`);
      }
    });

    // Handle sending messages
    socket.on("sendMessage", async({ id, firstName, text, userId }) => {
      console.log("Socket ID:", socket.id);
      console.log("Message Details:", { id, firstName, text, userId });

      const roomId = getSecretRoomId(id,userId);
      console.log(firstName+""+ text);

  //  Check if the sender and the receiver id exists in the db or not//

      let chat = await ChatModel.findOne({
        participants:{
        $all:[id,userId]}
      });


      if(!chat)
      {
      chat=  new ChatModel({
          participants:[id,userId],
          messages:[]

        })
      }

      chat.messages.push({
        senderId:userId,
        text,
      })



      await chat.save();

      // Emit message to the room
      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
