import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    PostCreator:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        require : true,
        trim : true
    },

    PostContent :{
        type :String,
        require :true,
        trim : true
    }
} , {timestamps :true})


export const Post = mongoose.model("Post" , PostSchema);