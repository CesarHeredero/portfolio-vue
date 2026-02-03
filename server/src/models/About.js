import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleEn: { type: String, required: true },
    description: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);
