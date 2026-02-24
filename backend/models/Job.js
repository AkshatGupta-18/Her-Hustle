// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: String,
  description: String,
  type: String,
  location: String,
  payment: Number,
  skills: [String],
  tags: [String],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postedAt: { 
    type: Date, 
    default: Date.now 
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);