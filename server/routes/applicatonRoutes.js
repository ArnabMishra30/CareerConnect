import express from "express";
import { applyToJob, getApplicantsForJob, getMyApplications, updateApplicationStatus } from "../controller/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, applyToJob);
router.get("/mine", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob);
router.put("/:applicationId/status", protect, updateApplicationStatus);


export default router;
