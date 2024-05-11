import  router from "express";
import {LoginUser, RegisterUser} from "../Controllers/User.Controller.js";

const UserRouter = router();


UserRouter.route("/register").post(RegisterUser);

UserRouter.route("/login").post( LoginUser );


export default UserRouter
