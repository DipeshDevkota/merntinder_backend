const express = require('express')
const profileroute= express.Router();
const {userAuth}= require("../middlewares/auth");
const {validateEditProfileData}= require('../utils/validate')
const User= require('../models/user')
profileroute.get('/profile/view',userAuth,async(req,res)=>{
    try {
         const user= req.user;
        res.send(user);

    } catch (err) {

        return res.status(500).json({ message: "Server error while logging in", error: err.message });

        
    }
});

profileroute.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request");
    }

    const loggedinUser= req.user;
    console.log(loggedinUser);

    Object.keys(req.body).forEach((field)=>(loggedinUser[field]=req.body[field]));
    await loggedinUser.save()
    res.json({
      message:`${loggedinUser.firstName},your profile is updated successfully!!`,
      data:loggedinUser,
    })


  } catch (error) {
    return res.status(500).json({message:"Server error while updating user",error:error.message})
    
  }
})


//forgotpw api
// profileroute.post("/profile/forgotpw",userAuth,async(req,res)=>{

//   try {
            

//     console.log("Forgotpw is working")
//      const userExists= req.user
//      if(!userExists)
//      {
//       throw new Error("User Authentication Error!!!")
//      }

     

    
//   } catch (error) {
//     return res.status(500).json({message:'Server error while user is forgetting password',error:error.message})
    
//   }
// })



module.exports=profileroute;