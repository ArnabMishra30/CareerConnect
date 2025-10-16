import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    skillsRequired: {
      type: [String], // Array of skill names
      required: true,
    },
    salaryRange: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote"],
      required: true,
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
