import Application from "../models/Application.js";
import Job from "../models/Job.js";

// POST /api/applications/:jobId
export const applyToJob = async (req, res) => {
  const user = req.user;

  if (user.role !== "job-seeker") {
    return res.status(403).json({ message: "Only job seekers can apply to jobs" });
  }

  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = new Application({
      job: job._id,
      applicant: user._id,
    });

    await application.save();
    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "You already applied to this job" });
    } else {
      res.status(500).json({ message: "Failed to apply", error: error.message });
    }
  }
};

// GET /api/applications/mine
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate("job");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// GET /api/applications/job/:jobId
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.poster.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view applicants for this job" });
    }

    // Fetch all applications for this job, populate applicant info
    const applications = await Application.find({ job: job._id })
      .populate("applicant", "firstName lastName email location skills githubLink phone education experience bio cvUrl");


    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    // Validate status
    const allowedStatuses = ["pending", "shortlisted", "rejected", "accepted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only job poster who owns the job can update status
    if (application.job.poster.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Status updated successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};
