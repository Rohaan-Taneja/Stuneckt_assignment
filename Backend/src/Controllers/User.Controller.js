import mongoose from "mongoose";
import User from "../Models/User.Model.js"
import { isUserUnique } from "../Utils/UserVerificationMethods.js"


// function to generate tokens 
const generateRefreshAccessToken = async (userid)=>{

    try {

           // searching the user or we can say we are getting user 
           const Userr = await User.findById(userid)

           console.log("i am in token generating funct");
   
   
       // generating token using our defined moethods in the userschema/usermodel 
       const AccessToken = Userr.generateAccessToken()
       const RefreshToken = Userr.generateAccessToken()
   
       // setting refresh token in the user databse 
       await User.updateOne(
           { _id: Userr._id },
           {
             $set: {
               RefreshToken: RefreshToken,
             },
             $currentDate: { lastUpdated: true },
           }
       )
       console.log("accestoken , refreshtoken done", AccessToken,RefreshToken);
   
       return {RefreshToken,AccessToken}
        
    } catch (error) {

        console.log("error is coming up in genrating access and refresh token", error);
        return 
        
    }
}

// controller for registering user 
const RegisterUser =  async (req, res)=>{

    // 1) get user data form body 
    // 2) check if user alredy existed
    // 3) data base me data ko daal denge
    // 4) then return okay and userid to the frontend

    const {username , password} =req.body


    // if user is alredy regiser before , we willl return this else will move forward
    if( await isUserUnique(username)){
        console.log("this is running , because user exist and no point in registering user");
        return res.json({
            message : "user alredy registed , please try to login"
        })
    }


    // we aree saving/registering the user , passwrod will be first encrypted then stored in the db
    const newUser = await User.create({
        Username : username,
        Password: password
    });


   res.status(200).json({
    message: "registered user succesfully",
    userid : `${newUser._id}`

   })

}



const LoginUser = async (req, res)=>{

    // whatt we are doing 
    //1) geting input data 
    //2) checking if user exist by username in the backend or not , 
    //3) if we do not found any input username ,then we will send messagee user not registered
    //4) if we found the username , then we check user password
    //5) if password id wrong then send wrong password message to frontend,
    //6) if it is correct then generate tokens and save it and save cookies also

    const {username , password} = req.body


    const LoggedInUser = await User.findOne({Username : username})

    // if input user does not exist , we will return no user exist to frontend
    if(!LoggedInUser){
        return res.status(401).json({
            message : "user does not exist"
        })
    }


    // true/false => checking if user wrote the correct password 
    const isUserCorrect = await LoggedInUser.isPasswordCorrect(password)

    // if paswword is wrong we will return wrong password message to frontend
    if(!isUserCorrect){
        return res.status(301).json({
            message : "wrong password"
        })
    }

     // creating and setting AccessToken , refresh ttoken in the db 
     const {AccessToken , RefreshToken}= await generateRefreshAccessToken(LoggedInUser._id)

     // setting the user cookies option , to keep it secure , only server can edit it 
     const options = 
     {
       httpOnly: true,
    //    secure:true
     }
 
      // aftter succesfull login , then we send ok message , userid and cookies
    //   we are setting two cookies acces token and refresh token 
     res.status(200)
     .cookie("accessToken" , AccessToken ,options)
     .cookie("refrehToken" , RefreshToken ,options)
     .json({
           message : "user logged inn",
         Userid : `${LoggedInUser._id}`,
     })


}


const getuserdetails = async (req , res )=>{

    const uid = req.params.userid

    const userr= await User.findById(uid)



    res.status(200).json({

        Message : "all okay", 
        username : userr.Username,
        followers : "11",
        following : "10"    
    })

}


const UpdateUserDetails = async(req , res)=>{

    console.log(req.body);
    const updated_name = req.body.u_name

    const findd_user_with_this_name = await User.findOne({Username : updated_name})

    if(findd_user_with_this_name){
       return res.status(300).json({
            message : "user with this name alredy exist"
        })
    }

    await User.updateOne(
        {_id : req.body.u_id },
        {
            $set: {
                Username : updated_name
            },
            $currentDate: { lastUpdated: true }
        }
        )
        const userrrr = await User.findById(req.body.u_id)

        console.log("this is the undated user",userrrr);
        res.status(200).json({
            message :"updated",
            username : userrrr.Username
        })

}

// function to increase followers and following
const FollowerFollowingIncrease =async (req, res)=>{

            // user1 follows user2 
    const {user1ID , user2ID} = req.body

    console.log(user1ID , user2ID);


    // user1 follows user2 , therefore , user1 followings list increased by 1 
    await User.updateOne(
        {_id : user1ID},
        {$push : {
            Followings: user2ID
        },
        $currentDate : {lastUpdated :true},

        })
    
    // user1 follows user2 , therefore user2 followers list increased by 1
    await User.updateOne(
        {_id : user2ID},
        {$push : {
            Followers : user1ID

        },
        $currentDate :  {lastUpdated :true}}
    )


    const u1 = await User.findById(user1ID)
    const u2 = await User.findById(user2ID)
    console.log("user1" ,  u1 , "user2" , u2);

    res.status(200).json({
        message : "all okay",
        user1following: u1.Followings , 
        user2follwers : u2.Followers
    }
       
    )

}

//fucntion when user1 , unfollows user2
const FollowerFollowingDecrease =async (req,res) =>{

              // user1 unfollows user2 
              const {user1ID , user2ID} = req.body

          
              // user1 unfollows user2 , therefore , user1 followings list decrease by 1 
              await User.updateOne(
                  {_id : user1ID},
                  {$pull : {
                      Followings: user2ID
                  },
                  $currentDate : {lastUpdated :true},
          
                  })
              
              // user1 unfollows user2 , therefore user2 followers list decrease by 1
              await User.updateOne(
                  {_id : user2ID},
                  {$pull : {
                      Followers : user1ID
          
                  },
                  $currentDate :  {lastUpdated :true}}
              )
          
          
              const u1 = await User.findById(user1ID)
              const u2 = await User.findById(user2ID)
              console.log("user1" ,  u1 , "user2" , u2);
          
              res.status(200).json({
                  message : "all okay",
                  user1following: u1.Followings , 
                  user2follwers : u2.Followers
              }
                 
              )


}



// FUNCTION TO GET FOLLOWERS LIST OF A USER 
const getAllMyFollowers = async (req, res) =>{
    const {MyUserID} = req.body

    const user = await User.findById(MyUserID)

    const followersIDlist = user.Followers

    const AllUsers = await User.find(
        { _id: { $in: followersIDlist } }, 
        { Username: 1, _id: 1 } 
    );

    res.status(200).json({
        message : "all followers",
        allfollwers : AllUsers

    })
    console.log(MyUserID);

}

// function to get list of all followings
const getAllMyFollowings = async (req, res) =>{
    const {MyUserID} = req.body

    const user = await User.findById(MyUserID)

    const follwingIDlist = user.Followings

    const AllUsers = await User.find(
        { _id: { $in: follwingIDlist } }, 
        { Username: 1, _id: 1 } 
    );

    res.status(200).json({
        message : "all followers",
        allfollowings : AllUsers

    })
    console.log(MyUserID);

}


export {RegisterUser , LoginUser , getuserdetails ,UpdateUserDetails ,FollowerFollowingIncrease ,
    FollowerFollowingDecrease , getAllMyFollowers ,getAllMyFollowings , NoOfFollowers}