// const express = require('express');
// const { userAuth } = require('../middlewares/auth');
// const Message = require('../models/chat');
// const { getIO, getConnectedUsers } = require('../socket/socket.server');
// const User = require('../models/user');
// const mongoose = require('mongoose'); // Ensure mongoose is imported
// const chatroute = express.Router();

// chatroute.post('/sendmessage/:toUserId', userAuth, async (req, res) => {
//     try {
//         const sender = req.user._id;
//         const receiver = req.params.toUserId;

//         console.log("Sender id is", sender);
//         console.log("Receiver id is", receiver);

//         const { content } = req.body;

//         // Validate the receiver ID
//         if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
//             return res.status(400).json({ error: 'Invalid or missing receiver ID.' });
//         }
    
//         const newMessage = await Message.create({
//             sender,
//             receiver,
//             content,
//         });

//         const io = getIO();
//         const connectedUsers = getConnectedUsers();
//         const receiverSocketId = connectedUsers.get(receiver);

//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", {
//                 message: newMessage
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: newMessage,
//         });
//     } catch (error) {
//         console.error("Error in sendMessage:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });

// chatroute.get('/view/:toUserId', userAuth, async (req, res) => {
//     try {
//         const sender = req.user._id;
//         const receiver = req.params.toUserId;

//         // Validate the receiver ID
//         if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
//             return res.status(400).json({ error: 'Invalid or missing receiver ID.' });
//         }

//         // Fetch the receiver's profile by ID
//         const receiverProfile = await User.findById(receiver, 'firstName lastName photoUrl');
        
//         if (!receiverProfile) {
//             return res.status(404).json({ message: "User doesn't exist" });
//         }

//         // Return the receiver's profile with name and photo
//         res.status(200).json({
//             success: true,
//             data: {
//                 firstName: receiverProfile.firstName,
//                 lastName: receiverProfile.lastName,
//                 photoUrl: receiverProfile.photoUrl
//             }
//         });
//     } catch (error) {
//         console.error("Error in retrieving receiver's profile:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });

// chatroute.get('/viewmessages/:fromUserId', userAuth, async (req, res) => {
//     try {
//         const receiverId = req.user._id; // Receiver (the current logged-in user)
//         const senderId = req.params.fromUserId; // Sender (the user initiating the conversation)

//         // Validate the sender ID
//         if (!mongoose.Types.ObjectId.isValid(senderId)) {
//             return res.status(400).json({ error: 'Invalid sender ID.' });
//         }

//         // Find messages exchanged between sender and receiver
//         const messages = await Message.find({
//             $or: [
//                 { sender: senderId, receiver: receiverId },
//                 { sender: receiverId, receiver: senderId },
//             ],
//         }).sort({ createdAt: 1 }); // Sort by creation time (earliest first)

//         res.status(200).json({
//             success: true,
//             messages,
//         });
//     } catch (error) {
//         console.error("Error in viewMessages:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });

// module.exports = chatroute;
