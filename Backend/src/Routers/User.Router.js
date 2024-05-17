import  router from "express";
import {FollowerFollowingDecrease, FollowerFollowingIncrease, getAllMyFollowers, getAllMyFollowings, getuserdetails, LoginUser, RegisterUser, UpdateUserDetails} from "../Controllers/User.Controller.js";

const UserRouter = router();


UserRouter.route("/register").post(RegisterUser);

UserRouter.route("/login").post( LoginUser );

UserRouter.route("/getuserdetails/:userid").get( getuserdetails)

UserRouter.route("/Update_userdetails").post(UpdateUserDetails)

// followeer/following route handling 

UserRouter.route("/following_thisUser").post(FollowerFollowingIncrease)

UserRouter.route("/Unfollowing_thisUser").post(FollowerFollowingDecrease)


UserRouter.route("/getAllMyFollowers").post(getAllMyFollowers)

UserRouter.route("/getAllMyFollowings").post(getAllMyFollowings)


export default UserRouter
