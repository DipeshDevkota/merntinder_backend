const socket = require("socket.io");
const crypto = require("crypto");
const ChatModel = require("../models/chat");
const connectionRequestModel = require("../models/connectionRequest.model");
const { containsOffensiveWords, censorMessage } = require("../utils/contentFilter");  // Import content filter

const getSecretRoomId = (userId, id) => {
  return crypto
    .createHash("sha256")
    .update([userId, id].sort().join("$"))
    .digest("hex");
};

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

      const roomId = getSecretRoomId(id, userId);
      console.log("RoomId:", roomId);

      if (!socket.rooms.has(roomId)) {
        socket.join(roomId);
        console.log(`${firstName} joined room ${roomId}`);
      } else {
        console.log(`${firstName} already in room ${roomId}`);
      }
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ id, firstName, text, userId }) => {
      console.log("Socket ID:", socket.id);
      console.log("Message Details:", { id, firstName, text, userId });

      const roomId = getSecretRoomId(id, userId);
      console.log(firstName + " " + text);

      // Check if userId and id are friends
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId: userId, toUserId: id, status: "accepted" },
          { fromUserId: id, toUserId: userId, status: "accepted" },
        ],
      });

      if (!existingConnectionRequest) {
        return socket.emit("messageError", {
          message:
            "You are not friends or the connection request is not accepted.",
        });
      }

      // Content Filtering - Check for offensive words
      if (containsOffensiveWords(text)) {
        return socket.emit("messageError", {
          message: "Your message contains offensive words.",
        });
      }

      // Censor offensive words if needed
      const censoredMessage = censorMessage(text);

      // Handle chat message saving
      let chat = await ChatModel.findOne({
        participants: {
          $all: [id, userId],
        },
      });

      if (!chat) {
        chat = new ChatModel({
          participants: [id, userId],
          messages: [],
        });
      }

      chat.messages.push({
        senderId: userId,
        text: censoredMessage, // Save the censored message
      });

      await chat.save();

      // Emit the censored message to the room
      io.to(roomId).emit("messageReceived", { firstName, text: censoredMessage });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
