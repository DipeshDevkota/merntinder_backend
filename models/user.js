const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt')
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50,
    },

    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase:true,
        trim:true,
        unique: true, // Optional: to ensure no duplicate email IDs
        required: true ,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email address',value)
            }
        }


    },
    password: {
        type: String,
        required: true,
        validate(value)
        {
            if(!validator.isStrongPassword)
            {
                throw new Error("Is not a strong password",value)
            }
        }
    },
    age: {
        type: Number,
        min: 18 ,
    //     validate(value){
    //         if(!['Male','Female','Others'].includes(value)){
    //             throw new Error("Gender data is not valid")
    //         }
    //         return value;

    // }
},
    gender: {
        type: String,
        enum:{
            values:["Male","Female","Others"],
            message:`{VALUE} is not a valid gender type`,
        }

    },
    
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Invalid Photo URL:",value)
            }
        },
    },
    about:{
        type:String,
        default:"This is a default section of the user!",
        
    },
    skills:{
        type:[String],
        validate:{
            validator:function(value)
            {
                return value.length <=10;
            },
            message:'You can only have a maximum of 10 skills'
        }
    },
    otp:{
        type: Number,
    },
    otpExpiry:{
        type : Date
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    confirmpw:
    {
        type:String,
    }
},
{timestamps:true
});

// userSchema.methods.getJWT= async function(){
//     const user= this;
//    const token =await jwt.sign({_id:user.id},"Dipesh78$",{expiresIn:'1d'});
//    return token;
// }


// userSchema.methods.validatePassword= async function(passwordInputByUser)
// {
//     const user= this;
//     const passwordHash= user.password;


//     const isPasswordValid= await bcrypt.compare(
//         passwordInputByUser,
//          passwordHash
//     );
//     return isPasswordValid;
// }
const User = mongoose.model('User', userSchema);

module.exports = User;
