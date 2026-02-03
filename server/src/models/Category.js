import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
  name: { type: String, required: true, trim: true },
  nameEn: { type: String, default: "" },
  description: { type: String, required: true },
  descriptionEn: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
