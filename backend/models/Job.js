const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  type: { type: String, enum: ['Remote', 'Offline', 'Hybrid'], default: 'Remote' },
  payment: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ just define type
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
