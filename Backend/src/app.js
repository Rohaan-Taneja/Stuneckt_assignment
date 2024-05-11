import dotenv from "dotenv";
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

dotenv.config();

const port = process.env.PORT

const app = express()


// allowing cross orgin request , that is api call from frontend to backend 
app.use(cors());



app.get('/', (req, res) => {
  res.send('Hello World!')
})

// middleware which will parse inncoming data , if daata type = json 
app.use(express.json({limit : "10kb"}))


//middleware which will parse incoming data , if data is coming through URL
app.use(express.urlencoded({extended :true}))

app.use(cookieparser())


// middleware , in which we telling , if any static file like photo ,video etc Comes,
//  then store it in the public folder 
app.use(express.static("public"));


// allowing cross orgin request , that is api call from frontend to backend 
app.use(cors());



// routers

import UserRouter from "./Routers/User.Router.js";

app.use("/api/user" , UserRouter);





export default app ;