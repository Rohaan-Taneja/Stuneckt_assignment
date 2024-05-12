import { Post } from "../Models/Post.Model.js"
import User from "../Models/User.Model.js"



// function to cretae a new post 
const CreatePost = async (req, res)=>{

    // what will we do ?
    // 1) create post using data 
    // 2) store the post id in the user schema for reference (userPost's)

    const {uid , title , content } = req.body

    const newPost = await Post.create({
        PostCreator : uid , 
        title : title,
        PostContent : content

    })

    const updated_user =  await User.updateOne(
        { _id: uid },
        {
          $push: {
            UsersPost: newPost._id,
          },
          $currentDate: { lastUpdated: true },
        }
    )

    const u_user = await User.findById(uid)

    res.status(200).json({
        message : "done ",
        userpost : newPost,
        usernewpost : u_user
    })


}

// function to get all the psot creted by user 
const GetUserAllsPosts = async(req,res)=>{
    // what we are doing?
    // 1)got user of the user , we will get arrayof post creted by the user first
    // 2)then retrieve the data of those post from post model and send it

    const userid = req.body.uid

    console.log("userid = " , userid , req.body );

    // getting user 
    const userr = await User.findById(userid)

    // getting posts array of user 
    const UserCreatedPosts= userr.UsersPost

    console.log("this is the list of post creted by user" , UserCreatedPosts);


    // fetching and storing all the details of post present in the array 
    const posts = await Post.find({ _id: { $in: UserCreatedPosts } });

    res.status(200).json({
        message :"sbb changa hai", 
        userposts : posts

    })



}


// thsi function will get all the post created till date 
const AllExistingPost = async (req, res)=>{
    
    // here we getting all the posts 

    const AllPosts = await Post.find()

    res.status(200).json({
        message :"allthe posts" , 
        allposts : AllPosts
    })


}


export {CreatePost ,GetUserAllsPosts , AllExistingPost}