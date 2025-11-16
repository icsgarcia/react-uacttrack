import mongoose from "mongoose";
import config from "./config";

async function connectDB() {
    try {
        await mongoose.connect(config.mongodb_uri);
        await mongoose.connection.db?.admin().command({ ping: 1 });
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectDB;
