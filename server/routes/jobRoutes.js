// routes/jobs.js
import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobsByPoster,
  updateJob,
} from "../controller/jobController.js";
import protect from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

router.get("/", getAllJobs);
router.get("/my-jobs", protect, getJobsByPoster); // <-- this MUST come first
router.get("/:id", getJobById);

router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);
router.put("/:id", protect, updateJob);

export default router;