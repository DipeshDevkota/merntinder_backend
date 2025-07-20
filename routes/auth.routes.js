const express = require("express");
const User = require("../models/user")
const authroute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userAuth}= require("../middlewares/auth")
const crypto= require('crypto')
const {validateSignUpData}= require("../utils/validate");
const sendMail = require("../services/sendmail");
const {loginRateLimiter} = require('../middlewares/ratelimit')
authroute.post("/signup", async (req, res) => {
    try {
        // Validate data
        const validationErrors = validateSignUpData(req);
        if (validationErrors) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // const otp = crypto.randomInt(100000, 999999).toString();
        // console.log("Generated OTP is:",otp)
        // const otpExpiry = new Date(Date.now() + 50 * 60 * 1000); // OTP valid for 10 minutes

        // Creating a new instance of the User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            // otp,
            // otpExpiry,
            // isVerified: false,
        });

        // Save the user in the database
        await user.save();

        // Send the email with OTP
        // await sendMail({
        //     emailId, 
        //     subject:"Verify your email", 
        //     text:`Your OTP is ${otp}`, 
        //     html:`<b>Your OTP is ${otp}</b>`});

        // Send success response after user creation and email send
        return res.status(200).json({
            // message: 'OTP sent to your email. Please verify your account.',
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error while adding user",
            error: error.message,
        });
    }
});

  

authroute.post('/login',loginRateLimiter,async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId }); // Use findOne to get a single user

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            //generation of token

         console.log(token)
         //add the token to cookie and send the reponse back to the user

         res.cookie("",,{
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict",
         })
            res.send({user,token});
        } else {
            return res.status(400).json({ message: "Password is not correct" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error while logging in", error: error.message });
    }
});



authroute.post('/logout', userAuth, async (req, res) => {
    // const userId = req.user._id; // Get the user ID from the request object
    // console.log(`LOgging out UserId:${userId}`)
    
//   disconnectUserSocket(userId)
    res.cookie("", null, {
        expires: new Date(Date.now()), 
    });
    res.status(200).send("User logged out successfully!"); 
});



authroute.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users); 
    } catch (error) {
        res.status(500).json({ message: "Server error while retrieving users", error: error.message }); 
    }
});


authroute.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ['photoUrl', "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            return res.status(400).json({ message: "Update not allowed" }); 
        }

        const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ message: "User not found to update" }); 
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); 
    }
});


authroute.delete('/userdelete/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" }); 
        }

        res.status(200).json({ message: 'User deleted successfully', user }); 
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting user", error: error.message }); 
    }
});

authroute.post('/user/verifyOtp', async (req, res) => {
    const { emailId, otp } = req.body;
    if (!emailId || !otp) {
        return res.status(400).json({
            message: "Please provide email and OTP",
        });
    }
    console.log({ emailId, otp });

    const user = await User.findOne({ otp });

    console.log('Found user:', user); 
    if (!user) {
        return res.status(400).json({
            message: 'Invalid OTP or email',
        });
    }
    if (user.otpExpiry < new Date()) {
        return res.status(400).json({
            message: "OTP expired",
        });
    }
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpiry = undefined; 
    try {
        await user.save(); 
        return res.status(200).json({
            message: "User verified and registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId,
            },
        });
    } catch (error) {
        console.error('Error saving user:', error); 
        return res.status(500).json({
            message: "Server error while verifying OTP",
            error: error.message,
        });
    }
});

authroute.post('/user/resendOtp', async (req, res) => {
    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({
            message: "Please provide your email",
        });
    }
    const user = await User.findOne({ emailId });
    if (!user) {
        return res.status(404).json({
            message: "User not found with this email",
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            message: "User is already verified",
        });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); 
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    try {
        await user.save();
    } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({
            message: "Server error while saving user",
            error: error.message,
        });
    }

    try {
        await sendMail({
            emailId: user.emailId,
            subject: "Resend OTP - Verify your email",
            text: `Your new OTP is ${otp}. It is valid for the next 10 minutes.`,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            message: "Failed to send OTP email",
            error: error.message,
        });
    }

    return res.status(200).json({
        message: "New OTP sent to your email. Please verify your account.",
    });
});



authroute.post('/user/forgotpw', async (req, res) => {
    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({
            message: "Please enter email"
        });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
        return res.status(404).json({
            message: "User not found with this email",
        });
    }

    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpiry = new Date(Date.now() + 50 * 60 * 1000); // 50 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    console.log('Email ID:', user.emailId);
    console.log('Sending OTP:', otp);

    try {
        await sendMail({
            emailId: user.emailId, // Ensure this is valid
            subject: "Reset Password - Verify Your Email",
            text: `Your new OTP is ${otp}. It is valid for the next 50 minutes.`,
            html: `<b>Your new OTP is ${otp}. It is valid for the next 50 minutes.</b>`, // Added HTML for better formatting
        });
    } catch (error) {
        console.error('Error sending email:', error); // Log the error for debugging
        return res.status(500).json({
            message: "Failed to send OTP. Please try again later.",
        });
    }

    return res.status(200).json({
        message: "New OTP sent to your email. Please reset your password.",
        emailId,
    });
});




authroute.post('/user/changepw',async(req,res)=>{
    const {password,confirmpw}= req.body;
    const {emailId}= req.body;
    const user = await User.findOne({emailId});
    if(!user)
    {
        return res.status(404).json({
            message:"User not found with this email",
        });
    }
    if(password!== confirmpw)
    {
        return res.status(400).json({
            message:"Passwords do not match",

        });
    }
      
    user.password= bcrypt.hashSync(password,8);
    console.log("New password is",user.password)
    await user.save();
    return res.status(200).json({
        message:"Password changed successfully!",
    })
})

module.exports = authroute;
