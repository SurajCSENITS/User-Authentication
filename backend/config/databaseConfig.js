const mongoose= require("mongoose");
const MONGODB_URL= process.env.MONGODB_URL;

const databaseconnect= async () => {
    try{
        const connectionInstance= await mongoose.connect(MONGODB_URL);
        console.log(`\n MongoDB connected!! DB HOST : ${connectionInstance.connection.host}`);
    } catch(error){
        console.log("MongoDB connection FAILED ", error);
        process.exit(1);
    }
}

module.exports= databaseconnect;