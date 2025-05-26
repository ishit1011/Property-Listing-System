// Setting mongoose connection to DB
import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL environment variable is not defined");
        }
        await mongoose.connect(mongoUrl);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;