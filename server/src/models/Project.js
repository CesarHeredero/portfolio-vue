import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    mainImage: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    link: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
