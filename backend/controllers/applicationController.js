// controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user.id; // Using id

    console.log('Apply for job - User ID:', applicantId);
    console.log('Apply for job - Job ID:', jobId);

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      organizer: job.organizer,
      status: 'pending',
    });

    console.log('Application created:', application);

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ 
      message: 'Failed to submit application',
      error: error.message 
    });
  }
};

// Get jobs the current user has applied to (returns array of job IDs)
exports.getMyAppliedJobs = async (req, res) => {
  try {
    const applicantId = req.user.id;

    console.log('Getting applied jobs for user:', applicantId);

    const applications = await Application.find({ 
      applicant: applicantId 
    }).select('job');

    // Return array of job IDs
    const jobIds = applications.map(app => app.job.toString());

    console.log('Applied job IDs:', jobIds);

    res.status(200).json(jobIds);
  } catch (error) {
    console.error('Fetch applied jobs error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch applied jobs',
      error: error.message 
    });
  }
};

// Get detailed applications for current user
exports.getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user.id;

    const applications = await Application.find({ 
      applicant: applicantId 
    })
      .populate('job', 'title company location type payment postedAt')
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch applications',
      error: error.message 
    });
  }
};

// Get applications for jobs posted by organizer (for job organizers)
exports.getJobApplications = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { jobId } = req.params;

    console.log('Getting job applications - Organizer ID:', organizerId);
    console.log('Getting job applications - Job ID:', jobId);

    // Verify the job belongs to this organizer
    const job = await Job.findOne({ 
      _id: jobId,
      organizer: organizerId 
    });

    if (!job) {
      console.log('Job not found or unauthorized');
      return res.status(404).json({ 
        message: 'Job not found or unauthorized' 
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email contact skills')
      .sort({ createdAt: -1 });

    console.log('Found applications:', applications.length);

    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch job applications error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch applications',
      error: error.message 
    });
  }
};

// Update application status (for organizers)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const organizerId = req.user.id;

    console.log('Update status - Application ID:', applicationId);
    console.log('Update status - New status:', status);
    console.log('Update status - Organizer ID:', organizerId);

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value' 
      });
    }

    // Find application and verify organizer
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.organizer.toString() !== organizerId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this application' 
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: 'Application status updated',
      application,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      message: 'Failed to update application status',
      error: error.message 
    });
  }
};

// Delete/withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const applicantId = req.user.id;

    const application = await Application.findOneAndDelete({
      _id: applicationId,
      applicant: applicantId,
    });

    if (!application) {
      return res.status(404).json({ 
        message: 'Application not found' 
      });
    }

    res.status(200).json({ 
      message: 'Application withdrawn successfully' 
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ 
      message: 'Failed to withdraw application',
      error: error.message 
    });
  }
};

// Get applicants with full profile details for a specific job
exports.getJobApplicantsWithProfile = async (req, res) => {
  try {
    const organizerId = req.user.id; // Using id
    const { jobId } = req.params;

    console.log('=== GET APPLICANTS WITH PROFILE ===');
    console.log('Organizer ID:', organizerId);
    console.log('Job ID:', jobId);

    // Verify the job belongs to this organizer
    const job = await Job.findOne({ 
      _id: jobId, 
      organizer: organizerId 
    });

    console.log('Job found:', job ? 'Yes' : 'No');
    if (job) {
      console.log('Job title:', job.title);
      console.log('Job organizer:', job.organizer);
    }

    if (!job) {
      console.log('Job not found or unauthorized');
      return res.status(404).json({ 
        message: 'Job not found or unauthorized' 
      });
    }

    // Fetch applications with full applicant details
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'applicant',
        select: 'name email contact location skills avatarUrl resumeUrl createdAt bio experience education portfolio linkedin github'
      })
      .sort({ createdAt: -1 });

    console.log('Applications found:', applications.length);
    
    if (applications.length > 0) {
      console.log('First application:', {
        id: applications[0]._id,
        applicantName: applications[0].applicant?.name,
        status: applications[0].status
      });
    }

    // Transform data to flatten applicant info
    const applicantsWithProfile = applications.map(app => {
      const applicant = app.applicant;
      
      if (!applicant) {
        console.log('Warning: Application has no applicant data:', app._id);
        return null;
      }

      return {
        // Application metadata
        applicationId: app._id,
        applicationStatus: app.status,
        appliedAt: app.createdAt,
        
        // Basic Info
        applicantId: applicant._id,
        seekerName: applicant.name,
        seekerEmail: applicant.email,
        seekerContact: applicant.contact,
        seekerLocation: applicant.location,
        seekerSkills: applicant.skills || [],
        
        // Profile assets
        avatarUrl: applicant.avatarUrl,
        seekerAvatarUrl: applicant.avatarUrl,
        resume: applicant.resumeUrl,
        seekerResumeUrl: applicant.resumeUrl,
        
        // Additional profile data
        bio: applicant.bio,
        about: applicant.bio,
        experience: applicant.experience || [],
        education: applicant.education || [],
        
        // Social links
        portfolio: applicant.portfolio,
        website: applicant.portfolio,
        linkedin: applicant.linkedin,
        github: applicant.github,
        
        // Timestamps
        memberSince: applicant.createdAt,
        createdAt: app.createdAt
      };
    }).filter(Boolean); // Remove null entries

    console.log('Transformed applicants:', applicantsWithProfile.length);
    console.log('Response data:', JSON.stringify(applicantsWithProfile, null, 2));

    res.status(200).json(applicantsWithProfile);
  } catch (error) {
    console.error('Fetch job applicants error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch applicants',
      error: error.message 
    });
  }
};