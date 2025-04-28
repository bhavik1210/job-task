const mongoose = require('mongoose');


const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // URL from Cloudinary
    required: true,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('Application', applicationSchema);

