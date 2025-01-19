const ChatModel = require('../models/chat')
const express = require('express');
const chatRouter = express.Router();
const {userAuth}= require("../middlewares/auth");
const { default: mongoose } = require('mongoose');

chatRouter.get('/chatmessage/:id',userAuth,async(req,res)=>{

    const userId=  req.user._id;
    console.log("Senderid is:",userId)
    const {id}=  req.params;

    //validate if the ids are valid objectIds
    if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId))
    {
        return res.status(400).json({message:"Invalid userId or id format"})
    }
    
    console.log("Chatroute is called")
   try {
     let chat = await ChatModel.findOne({
        participants:{$all:[id,userId]}
     }).populate({
        path:"messages.senderId",
        select:"firstName lastName"
     });
     
     if(!chat)
     {
          

        chat= new ChatModel({
            participants:[id,userId],
            messages:[],
        });

        await chat.save();
    }
    res.json(chat)
    console.log("Chat is ",chat)
    
   } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Internal server error" });  
   }
})


module.exports= chatRouter;