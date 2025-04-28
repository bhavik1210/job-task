





const express = require('express');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Application = require('../model/application');
const Job = require('../model/job');

const router = express.Router();
require('dotenv').config();

// Cloudinary configuration (use environment variables for sensitive info)
// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dwsb3pmxs',  // replace with your Cloudinary cloud name
  api_key: '313339969372339',        // replace with your Cloudinary API key
  api_secret: 'odDYYUeLVENsGza_Kld1jQ0NEW4',   // replace with your Cloudinary API secret
});
// Validate file size
const validateFileSize = (file) => {
  return file.size <= 5 * 1024 * 1024; // 5MB
};

// Validate file type
const validateFileType = (file) => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return validTypes.includes(file.mimetype);
};

// Save application to DB
const saveApplication = async (data) => {
  const newApp = new Application(data);
  return await newApp.save();
};

// Upload resume and save application
router.post('/upload-resume', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ success: false, message: 'No resume uploaded.' });
    }

    const resumeFile = req.files.resume;

    if (!validateFileType(resumeFile)) {
      return res.status(400).json({ success: false, message: 'Only PDF or Word files allowed.' });
    }

    if (!validateFileSize(resumeFile)) {
      return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
    }

    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Cloudinary upload error.', error: error.message });
        }

        const resumeUrl = result.secure_url;
        const { userId, coverLetter ,jobId } = req.body;

        console.log(req.body,"from vabecked")

        if (!userId || !coverLetter) {
          return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const applicationData = {
          jobId,
          userId,
          coverLetter,
          resume: resumeUrl,
          appliedDate: new Date().toISOString(),
          status: 'pending',
        };

        const savedApp = await saveApplication(applicationData);

        return res.status(200).json({
          success: true,
          message: 'Application submitted successfully!',
          fileUrl: resumeUrl,
          data: savedApp,
        });
      }
    ).end(resumeFile.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// Get all applications (applicants)
router.get('/get-all-applicants', async (req, res) => {
  try {
    // Find all applications and populate job and user details
    const applications = await Application.find()
      .populate('jobId', 'title company location type salary description postedDate category')  // Populate job details
      .populate('userId', 'name email')  // Populate applicant details
      .exec();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: 'No applicants found.' });
    }

    // Format response
    const applicants = applications.map(application => ({
      id: application._id,
      userId: {
        name: application.userId.name,
        email: application.userId.email,
      },
      job: {
        _id: application.jobId._id,
        title: application.jobId.title,
        company: application.jobId.company,
        location: application.jobId.location,
        type: application.jobId.type,
        salary: application.jobId.salary,
        description: application.jobId.description,
        postedDate: application.jobId.postedDate,
        category: application.jobId.category,
      },
      coverLetter: application.coverLetter,
      resume: application.resume,
      appliedDate: application.appliedDate,
      status: application.status,
    }));

    res.status(200).json({
      success: true,
      applicants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});


// Update application status
router.put('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status value
  const validStatuses = ['pending', 'reviewed', 'rejected', 'accepted'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value.',
    });
  }

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title');

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully.',
      data: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application status.',
      error: error.message,
    });
  }
});




module.exports = router;
