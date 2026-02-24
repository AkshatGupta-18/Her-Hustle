// middleware/upload.js - UPDATED WITH SEPARATE CONFIGS

const multer = require('multer');

// ==================== AVATAR UPLOAD (Images Only) ====================
const avatarStorage = multer.memoryStorage();

const avatarFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB for avatars
});

// ==================== RESUME UPLOAD (PDF/Word Only) ====================
const resumeStorage = multer.memoryStorage();

const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents allowed'), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB for resumes
});

// ==================== EXPORTS ====================
module.exports = {
  uploadAvatar,
  uploadResume
};