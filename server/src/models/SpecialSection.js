import mongoose from "mongoose";

const specialSectionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    image: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SpecialSection", specialSectionSchema);
