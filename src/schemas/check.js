import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    max: 100,
    min: 3,
  },
  url: {
    type: String,
    required: true,
    max: 1000,
    min: 7,
  },
  protocol: {
    type: String,
    required: true,
    enum: ["HTTP", "HTTPS", "TCP"],
  },
  path: {
    type: String,
    default: "/",
    max: 1000,
    min: 7,
  },
  webhook: {
    type: String,
    max: 1000,
    min: 5,
  },
  port: {
    type: Number,
    default: "",
    max: 50,
  },
  timeout: {
    type: Number,
    default: 5000,
  },
  interval: {
    type: Number,
    default: 10,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    type: Object,
  },
  http_headers: {
    type: Object,
  },
  tags: {
    type: [String],
    default: [],
  },
  assert: {
    type: Object,
  },
  ignore_ssl: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("Check", CheckSchema);
