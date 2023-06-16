import mongoose from "mongoose";
async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log("loi r");
    process.exit(1);
  }
}
export default connectDB;
