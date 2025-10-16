import Job from "../models/Job.js";

// POST /api/jobs
export const createJob = async (req, res) => {
  const {
    jobTitle,
    company,
    location,
    description,
    skillsRequired,
    salaryRange,
    jobType,
  } = req.body;
  const userId = req.user.id; // From auth middleware
  const userRole = req.user.role;
  // Reject if not a job-poster
  if (userRole !== "job-poster") {
    return res.status(403).json({ message: "Only job posters can post jobs" });
  }
  try {
    const newJob = new Job({
      jobTitle,
      company,
      location,
      description,
      skillsRequired,
      salaryRange,
      jobType,
      poster: userId,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create job", error: error.message });
  }
};

// GET /api/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch job", error: error.message });
  }
};

// GET /api/jobs/my-jobs
export const getJobsByPoster = async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "job-poster") {
    return res.status(403).json({ message: "You are a job seeker...." });
  }
  try {
    const jobs = await Job.find({ poster: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posted jobs", error: error.message });
  }
};

//updatejob
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.poster.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update job", error: error.message });
  }
};

//delete
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.poster.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete job", error: error.message });
  }
};
