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



export {RegisterUser , LoginUser}