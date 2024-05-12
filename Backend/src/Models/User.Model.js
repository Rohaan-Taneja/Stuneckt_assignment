import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



const UserSchema = new mongoose.Schema({

    Username :{
        type:String,
        require : true ,
        unique : true ,
        lowercase :true ,
        trim : true
    },

    Password : {
        type :String,
        require :true , 
        trim : true
    },
    UsersPost: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        
        }
    ],
    Followers:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    Followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    
    RefreshToken :{
        type:String,
        default :null
    }
} ,{timestamps :true})


// is this fuction , we are just saying that before saving the data in the db , just encrypt the passwrd 
UserSchema.pre("save", async function (next){

    // if passwrd is not modified 
    if( !this.isModified("Password")) return next();

    this.Password = await bcrypt.hash(this.Password , 10) 
    next();

})

//helps while logging in
// we are adding a method in userschema , that  checks if the input password by user is correct or not 
UserSchema.methods.isPasswordCorrect = async function (Password){

    return bcrypt.compare(Password , this.Password)
}


// creating method to generate access token 
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
  }
  
  // creating method to generate refresh token 
  UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
  }


const User = mongoose.model("User" , UserSchema)

export default User ;