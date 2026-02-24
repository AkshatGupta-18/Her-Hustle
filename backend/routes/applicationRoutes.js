const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const protect = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Applicant routes
router.post('/apply', applicationController.applyForJob);
router.get('/my-applied-jobs', applicationController.getMyAppliedJobs);
router.get('/my-applications', applicationController.getMyApplications);
router.delete('/:applicationId/withdraw', applicationController.withdrawApplication);

// Organizer routes

router.get('/job/:jobId/applicants', applicationController.getJobApplicantsWithProfile);
router.patch('/:applicationId/status', applicationController.updateApplicationStatus);

module.exports = router;