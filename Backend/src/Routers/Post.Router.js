import router from "express";
import { AllExistingPost, CreatePost, GetUserAllsPosts } from "../Controllers/Post.Controller.js";

const PostRouter = router();


PostRouter.route("/createPost").post(CreatePost)

PostRouter.route("/getAllUserPost").post(GetUserAllsPosts)

PostRouter.route("/getAllPosts").get(AllExistingPost)


export default PostRouter;