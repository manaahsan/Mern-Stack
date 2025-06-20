import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connection.on("connectd", () =>
      console.log("Connected to DB")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/mern`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
