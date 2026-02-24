// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    resumeUrl: {
      type: String,
      default: ''
    }
    ,
    contact: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Job Seeker', 'Organizer'],
      default: 'Job Seeker'
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  },
  {
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
