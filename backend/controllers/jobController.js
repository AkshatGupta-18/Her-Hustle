const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, description, details, type, payment } = req.body;

    if (!title || !description || !details || !payment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newJob = new Job({
      title,
      description,
      details,
      type,
      payment,
      organizer: req.user.id, // ✅ assign during request, NOT in schema
    });

    await newJob.save();

    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('❌ Job post error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ organizer: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ jobs });
  } catch (err) {
    console.error('Fetch jobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs
getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('organizer', 'name email') // optional, safe to remove
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};


module.exports = {
  createJob,
  getMyJobs,
  getAllJobs
};