import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`);
        // console.log("Connection Instance ::: ", connectionInstance);
    } catch (error) {
        console.log("MongoDB connection Failed ", error);
        process.exit(1);
    }
};

export default connectDB;