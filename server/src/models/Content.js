import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    locale: { type: String, required: true, unique: true, lowercase: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Content", contentSchema);