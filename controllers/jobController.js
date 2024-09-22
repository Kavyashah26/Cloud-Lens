const Job = require('../models/Job');
const { scheduleJob, cancelJob } = require('../services/jobService');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const userId = req.user.userId; // Get userId from auth middleware
    const roleArn = req.user.roleArn; // Get roleArn from auth middleware

    // Add userId and roleArn to jobData
    jobData.userId = userId;
    jobData.roleArn = roleArn;
    console.log("jobData", jobData);
    
    // Create and save the job
    const job = new Job(jobData);
    await job.save();
    const user=req.user
    // Schedule the job using the service
    scheduleJob(job,user);
    res.status(201).json({ message: 'Job created and scheduled successfully', jobId: job._id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating job', details: error.message });
  }
};

// Stop and delete a job
exports.stopJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Cancel the job using the service
    cancelJob(jobId);

    // Delete the job from the database
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: 'Job stopped and deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error stopping job', details: error.message });
  }
};

// Get all jobs for the authenticated user
exports.getAllJobsForUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from auth middleware
    const jobs = await Job.find({ userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
