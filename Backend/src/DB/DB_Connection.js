import mongoose from "mongoose";

// this is basically  afuction which will try to connect our server to databse
const DB_Connection_function = async () => {

  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("databse connected to the server");

  } catch (error) {
    console.log("some problem is comming in connecting db to the server = ", error );
  }
};

// we are exporting it and we will call/run in indexe.js file 
export default DB_Connection_function;
