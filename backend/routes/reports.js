const express = require('express');
const Report = require('../models/Report');
const { uploadImage, uploadVideo } = require('../middleware/upload');
const {
  sendReportConfirmationEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail
} = require('../config/emailConfig');
const { handleReportUploads, handleUploadErrors } = require('../middleware/upload');

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
router.post(
  '/report-street-dog',
  handleReportUploads,
  handleUploadErrors,
  async (req, res) => {
    try {
      console.log('Received files:', req.files);
      console.log('Received body:', req.body);

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
      const requiredFields = {
        reporterName,
        reporterEmail,
        reporterContact,
        reportLocation,
        description
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || value.trim() === '')
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          missingFields: missingFields
        });
      }

      // Process uploaded files
      const imageFiles = req.files?.images || [];
      const videoFiles = req.files?.videos || [];

      // Create new report
      const report = new Report({
        reporterName: reporterName.trim(),
        reporterEmail: reporterEmail.trim(),
        reporterContact: reporterContact.trim(),
        reporterAddress: reporterAddress ? reporterAddress.trim() : '',
        reportLocation: reportLocation.trim(),
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        description: description.trim(),
        dogCount: dogCount ? parseInt(dogCount) : 1,
        dogCondition: dogCondition || 'unknown',
        urgencyLevel: urgencyLevel || 'medium',
        additionalNotes: additionalNotes ? additionalNotes.trim() : '',
        images: imageFiles.map(file => file.filename),
        videos: videoFiles.map(file => file.filename)
      });

      await report.save();

      // Send confirmation email to user
      let userEmailSent = false;
      try {
        userEmailSent = await sendReportConfirmationEmail(
          reporterEmail,
          reporterName,
          report.reportNumber
        );
      } catch (emailError) {
        console.error('User email sending failed:', emailError);
      }

      // Send notification email to admin
      let adminEmailSent = false;
      try {
        adminEmailSent = await sendAdminNotificationEmail(report);
      } catch (adminEmailError) {
        console.error('Admin email sending failed:', adminEmailError);
      }

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
            createdAt: report.createdAt,
            imagesCount: imageFiles.length,
            videosCount: videoFiles.length
          },
          emailSent: {
            user: userEmailSent,
            admin: adminEmailSent
          }
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
        message: 'Internal server error while submitting report',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

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

// Update report status (Admin API)
router.patch('/admin/update-status/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status value
    const validStatuses = [
      'pending', 
      'under_review', 
      'rescue_dispatched', 
      'rescue_completed', 
      'medical_care', 
      'rehabilitation', 
      'released', 
      'closed'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        validStatuses: validStatuses
      });
    }

    // Find the report
    const report = await Report.findById(reportId);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const oldStatus = report.status;
    
    // Update report status
    report.status = status;
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }
    report.updatedAt = new Date();

    await report.save();

    // Send status update email to user
    let emailSent = false;
    try {
      emailSent = await sendStatusUpdateEmail(
        report.reporterEmail,
        report.reporterName,
        report.reportNumber,
        oldStatus,
        status,
        adminNotes
      );
    } catch (emailError) {
      console.error('Status update email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        report: {
          id: report._id,
          reportNumber: report.reportNumber,
          oldStatus,
          newStatus: status,
          adminNotes: adminNotes || null
        },
        emailSent: emailSent
      }
    });

  } catch (error) {
    console.error('Status update error:', error);

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
      message: 'Internal server error while updating status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all reports for admin (optional)
router.get('/admin/reports', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;