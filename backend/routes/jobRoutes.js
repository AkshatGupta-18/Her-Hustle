const express = require('express');
const { getAllJobs } = require('../controllers/jobController');

const router = express.Router();

const auth = require('../middleware/auth');
const { createJob, getMyJobs } = require('../controllers/jobController');

// POST job
// /api/jobs
router.post('/', auth, createJob);

// GET logged-in organizer jobs
// /api/jobs/my
router.get('/my', auth, getMyJobs);

router.get('/getjobs', getAllJobs);


module.exports = router;
