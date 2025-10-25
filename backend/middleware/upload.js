const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create all required upload directories
const createUploadDirs = () => {
  const dirs = [
    'uploads/reports',
    'uploads/images',
    'uploads/videos', 
    'uploads/after-images',
    'uploads/after-videos'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// ===== STORAGE CONFIGURATIONS =====

// Storage for report files
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/reports/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    let prefix = 'file';
    if (file.mimetype.startsWith('image/')) {
      prefix = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      prefix = 'video';
    }
    
    cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for AFTER media (fixed version)
const afterMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'afterImages') {
      cb(null, 'uploads/after-images/');
    } else if (file.fieldname === 'afterVideos') {
      cb(null, 'uploads/after-videos/');
    } else {
      cb(null, 'uploads/other/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ===== FILE FILTERS =====

// File filter for report uploads
const reportFileFilter = (req, file, cb) => {
  if (file.fieldname === 'images') {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed for images'), false);
    }
  }
  
  else if (file.fieldname === 'videos') {
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only video files (MP4, AVI, MOV, WMV, FLV, WEBM) are allowed for videos'), false);
    }
  }
  
  else {
    return cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// File filter for after media
const afterMediaFilter = (req, file, cb) => {
  if (file.fieldname === 'afterImages') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for afterImages!'), false);
    }
  }
  else if (file.fieldname === 'afterVideos') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for afterVideos!'), false);
    }
  }
  else {
    // Allow other fields (text fields like status, adminNotes)
    cb(null, true);
  }
};

// ===== MULTER INSTANCES =====

// Report upload
const reportUpload = multer({
  storage: reportStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 15
  },
  fileFilter: reportFileFilter
});

// After media upload (FIXED - single instance)
const afterMediaUpload = multer({
  storage: afterMediaStorage,
  fileFilter: afterMediaFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 7 // 5 images + 2 videos
  }
});

// ===== MIDDLEWARE =====

// Middleware for handling report uploads
const handleReportUploads = reportUpload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

// FIXED: Middleware for handling after media uploads
const handleAfterMediaUploads = afterMediaUpload.fields([
  { name: 'afterImages', maxCount: 5 },
  { name: 'afterVideos', maxCount: 2 }
]);

// Error handling middleware
const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

module.exports = {
  handleReportUploads,
  handleUploadErrors,
  handleAfterMediaUploads
};