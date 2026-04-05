import mongoose from "mongoose";

const userScehma = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String,
    default: "",
  },
  clerkId: {
    type: String,
    required: true,
    unique: true
  }
},{timestamps: true});

const User = mongoose.model("User", userScehma);

export default User;