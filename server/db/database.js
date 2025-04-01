import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database is connected`);
        
    } catch (error) {
        console.log(`Error in database connection`,error);
        
    }
}

export default connectDB;