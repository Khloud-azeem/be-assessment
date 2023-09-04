import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  check_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Check",
    required: true,
  },
  status: {
    type: Number,
  },
  availability: {
    type: Number,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  response_time: {
    type: Number,
    default: 0,
  },
  history: {
    type: [Object],
    default: [],
  },
});
export default mongoose.model("Report", ReportSchema);
