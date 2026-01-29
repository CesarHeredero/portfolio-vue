import mongoose from "mongoose";

const secondaryExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    description: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SecondaryExperience", secondaryExperienceSchema);
