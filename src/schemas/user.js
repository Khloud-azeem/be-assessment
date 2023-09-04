import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    max: 100,
    min: 5,
  },
  first_name: {
    type: String,
    required: true,
    max: 100,
    min: 5,
  },
  last_name: {
    type: String,
    required: true,
    max: 100,
    min: 5,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    min: 7,
  },
  create_time: {
    type: Date,
    default: Date.now,
  },
  hashed_password: {
    type: String,
    required: true,
    max: 1000,
    min: 5,
  },
  verification_code: {
    type: Number,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("User", UserSchema);
