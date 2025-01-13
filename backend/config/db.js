import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://priyanshuranjan232:alpha123@cluster0.jq4co.mongodb.net/kumar-fertilizer"
    )
    .then(() => console.log("DataBase Connected"));
};
