import app from "./app.js";
import DB_Connection_function from "./DB/DB_Connection.js";


DB_Connection_function()
.then(()=>{

    app.listen(process.env.PORT , ()=>{
        console.log("server running on PORT ", process.env.PORT);
    })

})
.catch((error)=>{
    console.log("error is comming in connection to db in index.js file" , error);

})

