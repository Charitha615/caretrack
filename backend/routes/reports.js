const express = require('express');
const Report = require('../models/Report');
const { uploadImage, uploadVideo } = require('../middleware/upload');
const { sendReportConfirmationEmail } = require('../config/emailConfig');

const router = express.Router();

// Handle multiple file uploads
const handleUploads = (req, res, next) => {
  // Upload up to 5 images
  const imageUpload = uploadImage.array('images', 5);
  // Upload up to 2 videos
  const videoUpload = uploadVideo.array('videos', 2);

  imageUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    videoUpload(req, res, (videoErr) => {
      if (videoErr) {
        return res.status(400).json({
          success: false,
          message: videoErr.message
        });
      }
      next();
    });
  });
};

// Create new street dog report (Public API - no authentication required)
router.post('/report-street-dog', handleUploads, async (req, res) => {
  try {
    const {
      reporterName,
      reporterEmail,
      reporterContact,
      reporterAddress,
      reportLocation,
      latitude,
      longitude,
      description,
      dogCount,
      dogCondition,
      urgencyLevel,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!reporterName || !reporterEmail || !reporterContact || !reporterAddress || 
        !reportLocation || !latitude || !longitude || !description) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new report
    const report = new Report({
      reporterName,
      reporterEmail,
      reporterContact,
      reporterAddress,
      reportLocation,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description,
      dogCount: dogCount ? parseInt(dogCount) : 1,
      dogCondition: dogCondition || 'unknown',
      urgencyLevel: urgencyLevel || 'medium',
      additionalNotes: additionalNotes || '',
      images: req.files?.filter(file => file.fieldname === 'images').map(file => file.path) || [],
      videos: req.files?.filter(file => file.fieldname === 'videos').map(file => file.path) || []
    });

    await report.save();

    // Send confirmation email
    const emailSent = await sendReportConfirmationEmail(
      reporterEmail, 
      reporterName, 
      report.reportNumber
    );

    res.status(201).json({
      success: true,
      message: 'Street dog report submitted successfully',
      data: {
        report: {
          id: report._id,
          reportNumber: report.reportNumber,
          reporterName: report.reporterName,
          reporterEmail: report.reporterEmail,
          reportLocation: report.reportLocation,
          status: report.status,
          createdAt: report.createdAt
        },
        emailSent: emailSent
      }
    });

  } catch (error) {
    console.error('Report submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while submitting report'
    });
  }
});

// Get report by reference number (Public API)
router.get('/track-report/:reportNumber', async (req, res) => {
  try {
    const { reportNumber } = req.params;

    const report = await Report.findOne({ reportNumber })
      .select('-__v -updatedAt');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found with the provided reference number'
      });
    }

    res.json({
      success: true,
      data: {
        report
      }
    });

  } catch (error) {
    console.error('Track report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Public route to get report status
router.get('/public/reports', async (req, res) => {
  res.json({
    success: true,
    message: 'Public reports endpoint - use POST /api/reports/report-street-dog to submit reports'
  });
});

module.exports = router;