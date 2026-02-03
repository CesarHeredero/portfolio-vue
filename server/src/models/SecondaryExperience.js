import mongoose from "mongoose";

const secondaryExperienceSchema = new mongoose.Schema(
  {
  title: { type: String, required: true, trim: true },
  titleEn: { type: String, default: "" },
  role: { type: String, required: true, trim: true },
  roleEn: { type: String, default: "" },
  date: { type: String, required: true },
  description: { type: String, default: "" },
  descriptionEn: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SecondaryExperience", secondaryExperienceSchema);
