import User from "../Models/User.Model.js"




// if already register user is registering gain , then we send false 
// and if its a new user , we will send false 
const isUserUnique = async (person) =>{
    console.log("this is the incoming person" , person);
    
    try {
        const user = await User.findOne({ Username: person });
        console.log("Retrieved user from the db:", user);
        
        if (user) {
            console.log("User exists:", user.Username);
            return true;
        } else {
            console.log("User does not exist.");
            return false;
        }
    } catch (error) {
        console.error("Error while checking user uniqueness:", error);
        throw error; // Throw the error to handle it in the caller function
    }
    
}



export {isUserUnique}