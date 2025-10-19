const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const reportsDir = path.join(uploadsDir, 'reports');

[uploadsDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for all files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reportsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Determine file type prefix
    let prefix = 'file';
    if (file.mimetype.startsWith('image/')) {
      prefix = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      prefix = 'video';
    }
    
    cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for both images and videos
const fileFilter = (req, file, cb) => {
  // Check if it's an image
  if (file.fieldname === 'images') {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);

    if (mimetype && extname && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed for images'), false);
    }
  }
  
  // Check if it's a video
  else if (file.fieldname === 'videos') {
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedVideoTypes.test(file.mimetype);

    if (mimetype && extname && file.mimetype.startsWith('video/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only video files (MP4, AVI, MOV, WMV, FLV, WEBM) are allowed for videos'), false);
    }
  }
  
  // If it's neither images nor videos field, reject it
  else {
    return cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// Create multer instance with multiple fields
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size (for videos)
    files: 15 // Maximum 15 files total
  },
  fileFilter: fileFilter
});

// Middleware for handling report uploads
const handleReportUploads = upload.fields([
  { 
    name: 'images', 
    maxCount: 10 
  },
  { 
    name: 'videos', 
    maxCount: 5 
  }
]);

// Error handling middleware for multer
const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB for videos and 5MB for images'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 images and 5 videos allowed'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Only "images" and "videos" fields are allowed'
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
  handleUploadErrors
};