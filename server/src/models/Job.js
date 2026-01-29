import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    notableClients: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
