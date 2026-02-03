import mongoose from "mongoose";

const specialSectionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true },
  titleEn: { type: String, default: "" },
  description: { type: String, required: true },
  descriptionEn: { type: String, default: "" },
  longDescription: { type: String, default: "" },
  longDescriptionEn: { type: String, default: "" },
    image: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SpecialSection", specialSectionSchema);
