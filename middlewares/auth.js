const jwt = require('jsonwebtoken')
const User = require('../models/user');

const userAuth = async(req,res,next)=>{
    try {
        const cookies= req.cookies;
        if (!cookies || !cookies.token) {
            return res.status(401).json({ message: "You are not loggedin!" });
        }
        const {token}= cookies;

        if(!token)
        {
            return res.status(401).json({message:"You are not loggedin!!!"});
        }

        const decodedMessage=  jwt.verify(token,"Dipesh78$");

        const {_id}= decodedMessage;
        const user = await User.findById(_id);
        if(!user)
        {
            return res.status(400).json({message:"User is not found!!!"});

        }
        req.user= user;
        // initializeSocket(user._id)

        next()
    } catch (error) {
    return res.status(500).json({message:'Server error while user is forgetting password',error:error.message})
       
        
    }
}

module.exports={userAuth}