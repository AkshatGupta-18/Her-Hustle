// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const createTokenAndCookie = require('../utils/createTokenAndCookie.cjs');
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const supabase = require('../utils/supabaseClient');
const { uploadAvatar, uploadResume } = require('../middleware/upload'); // ✅ Import both



// ----------------- REGISTER -----------------
router.post('/register', async (req, res) => {
  const { name, email, password, location, contact, role } = req.body;

  if (!name || !email || !password || !location || !contact || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      contact,
      role,
    });

    const { getJobsByUser } = require('../controllers/jobController');

    router.get('/user/:id', getJobsByUser);


    // Create JWT cookie
    createTokenAndCookie(res, newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
});

// ----------------- LOGIN -----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT cookie
    createTokenAndCookie(res, user);

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
});

// ----------------- GET USER PROFILE -----------------
// Update the existing GET /profile route (around line 94)
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      'name email role location contact skills avatarUrl resumeUrl savedJobs' // ✅ ADD savedJobs
    );
    console.log('🧠 BACKEND profile avatarUrl:', user?.avatarUrl);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || '',
      contact: user.contact || '',
      skills: user.skills || [],
      avatarUrl: user.avatarUrl || '',
      resumeUrl: user.resumeUrl || '',
      savedJobs: user.savedJobs || [] // ✅ ADD THIS
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- UPDATE USER PROFILE -----------------
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location, contact, skills, resumeUrl } = req.body;

    const updateObj = { name, location, contact, skills };
    if (resumeUrl !== undefined) updateObj.resumeUrl = resumeUrl;

    const user = await User.findByIdAndUpdate(
      userId,
      updateObj,
      { new: true, runValidators: true } // Returns updated doc
    ).select('name email role location contact skills resumeUrl');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        contact: user.contact,
        skills: user.skills,
        resumeUrl: user.resumeUrl || ''
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/user.js
// ==================== AVATAR UPLOAD (Uses uploadAvatar) ====================
router.post('/upload-avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    console.log('📤 Avatar upload started');

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📄 Avatar file received:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'her-hustle/avatars',
        public_id: req.user.id,
        overwrite: true,
        transformation: [{ width: 300, height: 300, crop: 'fill' }],
      }
    );

    console.log('✅ Avatar uploaded to Cloudinary:', result.secure_url);

    // Update user in database
    await User.findByIdAndUpdate(req.user.id, {
      avatarUrl: result.secure_url,
    });

    res.json({ avatarUrl: result.secure_url });
  } catch (err) {
    console.error('❌ Avatar upload error:', err);
    res.status(500).json({ message: 'Avatar upload failed', error: err.message });
  }
});

// ==================== RESUME UPLOAD (Uses uploadResume) ====================
router.post('/upload-resume', auth, uploadResume.single('resume'), async (req, res) => {
  try {
    console.log('📤 Resume upload started');

    const file = req.file;
    if (!file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📄 Resume file received:', {
      name: file.originalname,
      size: file.size,
      type: file.mimetype
    });

    // Check Supabase config
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase not configured');
      return res.status(500).json({ message: 'Storage service not configured' });
    }

    const fileExt = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${req.user.id}/resume_${timestamp}.${fileExt}`;

    console.log('📂 Uploading to Supabase path:', filePath);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      return res.status(500).json({
        message: 'Failed to upload resume to storage',
        error: uploadError.message
      });
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      console.error('❌ Failed to get public URL');
      return res.status(500).json({ message: 'Failed to generate public URL' });
    }

    console.log('🔗 Public URL:', publicUrl);

    // Update user in MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: publicUrl },
      { new: true }
    );

    if (!user) {
      console.error('❌ User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User updated with resume URL');

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: publicUrl,
      resumeName: file.originalname
    });

  } catch (err) {
    console.error('❌ Resume upload error:', err);
    res.status(500).json({
      message: 'Resume upload failed',
      error: err.message
    });
  }
});

// routes/user.js - ADD DELETE RESUME ENDPOINT

// ==================== DELETE RESUME ====================
router.delete('/delete-resume', auth, async (req, res) => {
  try {
    console.log('🗑️ Delete resume request for user:', req.user.id);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resumeUrl) {
      return res.status(404).json({ message: 'No resume to delete' });
    }

    // ✅ Extract file path from URL
    // Example URL: https://xxx.supabase.co/storage/v1/object/public/resumes/userId/resume_123.pdf
    // We need: userId/resume_123.pdf
    try {
      const url = new URL(user.resumeUrl);
      const pathParts = url.pathname.split('/resumes/');

      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        console.log('📂 Deleting file from Supabase:', filePath);

        // Delete from Supabase
        const { error } = await supabase.storage
          .from('resumes')
          .remove([filePath]);

        if (error) {
          console.error('❌ Supabase delete error:', error);
          // Continue anyway to clear DB even if file delete fails
        } else {
          console.log('✅ File deleted from Supabase');
        }
      }
    } catch (err) {
      console.error('⚠️ Error parsing resume URL:', err);
      // Continue to clear DB even if we can't delete the file
    }

    // ✅ Clear resume from database
    user.resumeUrl = '';
    await user.save();

    console.log('✅ Resume cleared from database');

    res.json({
      message: 'Resume deleted successfully'
    });

  } catch (err) {
    console.error('❌ Delete resume error:', err);
    res.status(500).json({
      message: 'Failed to delete resume',
      error: err.message
    });
  }
});

// ==================== UPDATED PROFILE UPDATE (handles resume removal) ====================
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location, contact, skills, resumeUrl } = req.body;

    // ✅ Get current user to check if resume is being removed
    const currentUser = await User.findById(userId);

    // If user had a resume and now it's being cleared
    if (currentUser.resumeUrl && resumeUrl === '') {
      console.log('🗑️ Resume is being removed, deleting from Supabase...');

      try {
        const url = new URL(currentUser.resumeUrl);
        const pathParts = url.pathname.split('/resumes/');

        if (pathParts.length > 1) {
          const filePath = pathParts[1];

          const { error } = await supabase.storage
            .from('resumes')
            .remove([filePath]);

          if (error) {
            console.error('❌ Failed to delete from Supabase:', error);
          } else {
            console.log('✅ Resume deleted from Supabase');
          }
        }
      } catch (err) {
        console.error('⚠️ Error deleting resume:', err);
      }
    }

    const updateObj = { name, location, contact, skills };
    if (resumeUrl !== undefined) updateObj.resumeUrl = resumeUrl;

    const user = await User.findByIdAndUpdate(
      userId,
      updateObj,
      { new: true, runValidators: true }
    ).select('name email role location contact skills resumeUrl');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        contact: user.contact,
        skills: user.skills,
        resumeUrl: user.resumeUrl || ''
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== UPDATED RESUME UPLOAD (deletes old resume) ====================
router.post('/upload-resume', auth, uploadResume.single('resume'), async (req, res) => {
  try {
    console.log('📤 Resume upload started');

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📄 Resume file received:', {
      name: file.originalname,
      size: file.size,
      type: file.mimetype
    });

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase not configured');
      return res.status(500).json({ message: 'Storage service not configured' });
    }

    const fileExt = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${req.user.id}/resume_${timestamp}.${fileExt}`;

    console.log('📂 Uploading to Supabase path:', filePath);

    // ✅ Delete old resume before uploading new one
    const user = await User.findById(req.user.id);
    if (user && user.resumeUrl) {
      console.log('🗑️ Deleting old resume...');
      try {
        const url = new URL(user.resumeUrl);
        const pathParts = url.pathname.split('/resumes/');

        if (pathParts.length > 1) {
          const oldFilePath = pathParts[1];
          await supabase.storage.from('resumes').remove([oldFilePath]);
          console.log('✅ Old resume deleted');
        }
      } catch (err) {
        console.log('⚠️ Could not delete old resume:', err.message);
      }
    }

    // Upload new resume to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      return res.status(500).json({
        message: 'Failed to upload resume to storage',
        error: uploadError.message
      });
    }

    console.log('✅ Upload successful');

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      console.error('❌ Failed to get public URL');
      return res.status(500).json({ message: 'Failed to generate public URL' });
    }

    console.log('🔗 Public URL generated');

    // Update user in MongoDB
    await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: publicUrl },
      { new: true }
    );

    console.log('✅ User updated with resume URL');

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: publicUrl,
      resumeName: file.originalname
    });

  } catch (err) {
    console.error('❌ Resume upload error:', err);
    res.status(500).json({
      message: 'Resume upload failed',
      error: err.message
    });
  }
});

// ==================== SAVE JOB ====================
router.post('/save-job/:jobId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Add to saved jobs
    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ 
      message: 'Job saved successfully',
      savedJobs: user.savedJobs 
    });
  } catch (err) {
    console.error('Save job error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== UNSAVE JOB ====================
router.delete('/unsave-job/:jobId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from saved jobs
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ 
      message: 'Job unsaved successfully',
      savedJobs: user.savedJobs 
    });
  } catch (err) {
    console.error('Unsave job error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== GET SAVED JOBS ====================
router.get('/saved-jobs', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('savedJobs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedJobs);
  } catch (err) {
    console.error('Get saved jobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/me/skills
router.get('/me/skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('skills');
    res.json({ skills: user.skills || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
