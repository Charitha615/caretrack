const express = require('express');
const Report = require('../models/Report');
const ReportAfterMedia = require('../models/ReportAfterMedia');
const {
  handleReportUploads,
  handleUploadErrors,
  handleAfterMediaUploads
} = require('../middleware/upload');
const {
  sendReportConfirmationEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail
} = require('../config/emailConfig');

const router = express.Router();

// ===== EXISTING REPORT FUNCTIONALITY =====

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

// Public route to get all released and closed reports
router.get('/public/reports', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Only fetch reports with status 'released' or 'closed'
    const query = {
      status: {
        $in: ['released', 'closed']
      }
    };

    const reports = await Report.find(query)
      .select('-__v -updatedAt -reporterEmail -reporterContact -reporterAddress -adminNotes')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Report.countDocuments(query);

    // Get after media for each report
    const reportsWithAfterMedia = await Promise.all(
      reports.map(async (report) => {
        const afterMedia = await ReportAfterMedia.find({
          reportNumber: report.reportNumber
        })
          .sort({ createdAt: -1 })
          .select('images videos status createdAt')
          .lean();

        return {
          ...report,
          afterMedia: afterMedia.length > 0 ? afterMedia : null
        };
      })
    );

    res.json({
      success: true,
      data: {
        reports: reportsWithAfterMedia,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });

  } catch (error) {
    console.error('Get public reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching public reports'
    });
  }
});

// Update report status (Admin API) - Original without media
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
    const validStatuses = ['pending', 'under_review', 'released', 'closed'];

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

// ===== UPDATED AFTER MEDIA FUNCTIONALITY =====

// Update report status with after media (Admin API) - FIXED VERSION
router.patch(
  '/admin/update-status-with-media/:reportId',
  handleAfterMediaUploads,
  handleUploadErrors,
  async (req, res) => {
    try {
      const { reportId } = req.params;

      // Enhanced logging to debug the issue
      console.log('=== STATUS UPDATE WITH MEDIA REQUEST ===');
      console.log('Report ID:', reportId);
      console.log('Request body:', req);
      console.log('Request files:', req.files);
      console.log('Content-Type:', req.get('Content-Type'));

      // Extract fields from body - handle both string and object formats
      let { status, adminNotes } = req.body;

      // If status is an object (can happen with some FormData parsers), extract the value
      if (status && typeof status === 'object') {
        status = status.value || status.toString();
      }

      console.log('Extracted status:', status);
      console.log('Extracted adminNotes:', adminNotes);

      // Validate required fields with better error message
      if (!status || status.trim() === '') {
        console.log('Status validation failed - status is empty or missing');
        return res.status(400).json({
          success: false,
          message: 'Status is required and cannot be empty',
          receivedStatus: status,
          receivedBody: req.body
        });
      }

      // Validate status value - only allow released and closed for media upload
      const validFinalStatuses = ['released', 'closed'];

      if (!validFinalStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Media upload only allowed for released or closed status',
          validStatuses: validFinalStatuses,
          receivedStatus: status
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

      // Process uploaded after media files
      const afterImageFiles = req.files?.afterImages || [];
      const afterVideoFiles = req.files?.afterVideos || [];

      console.log('After images count:', afterImageFiles.length);
      console.log('After videos count:', afterVideoFiles.length);

      // Update report status
      report.status = status;
      if (adminNotes) {
        report.adminNotes = adminNotes;
      }
      report.updatedAt = new Date();

      await report.save();

      // Save after media to separate collection if files were uploaded
      let afterMediaSaved = false;
      let afterMediaDoc = null;

      if (afterImageFiles.length > 0 || afterVideoFiles.length > 0) {
        afterMediaDoc = new ReportAfterMedia({
          reportId: report._id,
          reportNumber: report.reportNumber,
          images: afterImageFiles.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
          })),
          videos: afterVideoFiles.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
          })),
          status: status,
          adminNotes: adminNotes || ''
        });

        await afterMediaDoc.save();
        afterMediaSaved = true;
        console.log('After media saved successfully');
      }

      // Send status update email to user (enhanced with after media info)
      let emailSent = false;
      try {
        emailSent = await sendStatusUpdateEmail(
          report.reporterEmail,
          report.reporterName,
          report.reportNumber,
          oldStatus,
          status,
          adminNotes,
          afterMediaSaved // Pass whether after media was uploaded
        );
        console.log('Status update email sent:', emailSent);
      } catch (emailError) {
        console.error('Status update email sending failed:', emailError);
      }

      const response = {
        success: true,
        message: 'Report status updated successfully' + (afterMediaSaved ? ' with after media' : ''),
        data: {
          report: {
            id: report._id,
            reportNumber: report.reportNumber,
            oldStatus,
            newStatus: status,
            adminNotes: adminNotes || null
          },
          afterMedia: afterMediaSaved ? {
            id: afterMediaDoc._id,
            imagesCount: afterImageFiles.length,
            videosCount: afterVideoFiles.length,
            createdAt: afterMediaDoc.createdAt
          } : null,
          emailSent: emailSent
        }
      };

      console.log('=== SENDING SUCCESS RESPONSE ===');
      res.json(response);

    } catch (error) {
      console.error('Status update with media error:', error);

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
  }
);

// Alternative endpoint that accepts both JSON and FormData
router.patch('/admin/update-status-flexible/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    console.log('=== FLEXIBLE STATUS UPDATE ===');
    console.log('Report ID:', reportId);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.get('Content-Type'));

    let { status, adminNotes } = req.body;

    // If no status in body, try to get from query (fallback)
    if (!status) {
      status = req.query.status;
    }

    console.log('Final extracted status:', status);

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required. Provide it in request body or as query parameter.',
        receivedBody: req.body,
        receivedQuery: req.query
      });
    }

    // Rest of the function remains the same as the fixed version above...
    // [Copy the same logic from the fixed version above]

    // Find the report
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const oldStatus = report.status;

    // Process uploaded after media files if any
    const afterImageFiles = req.files?.afterImages || [];
    const afterVideoFiles = req.files?.afterVideos || [];

    // Update report status
    report.status = status;
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }
    report.updatedAt = new Date();

    await report.save();

    // Save after media if files were uploaded
    let afterMediaSaved = false;
    if (afterImageFiles.length > 0 || afterVideoFiles.length > 0) {
      const afterMedia = new ReportAfterMedia({
        reportId: report._id,
        reportNumber: report.reportNumber,
        images: afterImageFiles.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path
        })),
        videos: afterVideoFiles.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path
        })),
        status: status,
        adminNotes: adminNotes || ''
      });

      await afterMedia.save();
      afterMediaSaved = true;
    }

    // Send email
    let emailSent = false;
    try {
      emailSent = await sendStatusUpdateEmail(
        report.reporterEmail,
        report.reporterName,
        report.reportNumber,
        oldStatus,
        status,
        adminNotes,
        afterMediaSaved
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Report status updated successfully' + (afterMediaSaved ? ' with after media' : ''),
      data: {
        report: {
          id: report._id,
          reportNumber: report.reportNumber,
          oldStatus,
          newStatus: status,
          adminNotes: adminNotes || null
        },
        afterMedia: afterMediaSaved ? {
          imagesCount: afterImageFiles.length,
          videosCount: afterVideoFiles.length
        } : null,
        emailSent: emailSent
      }
    });

  } catch (error) {
    console.error('Flexible status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get after media for a report
router.get('/after-media/:reportNumber', async (req, res) => {
  try {
    const { reportNumber } = req.params;

    const afterMedia = await ReportAfterMedia.find({ reportNumber })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: {
        afterMedia
      }
    });

  } catch (error) {
    console.error('Get after media error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get complete report with before and after media
router.get('/complete-report/:reportNumber', async (req, res) => {
  try {
    const { reportNumber } = req.params;

    const report = await Report.findOne({ reportNumber })
      .select('-__v -updatedAt');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const afterMedia = await ReportAfterMedia.find({ reportNumber })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: {
        report,
        afterMedia
      }
    });

  } catch (error) {
    console.error('Get complete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ===== ADMIN REPORTS MANAGEMENT =====

// Get all reports for admin
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