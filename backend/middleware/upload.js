// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');

// // // Create uploads directory if it doesn't exist
// // const uploadsDir = path.join(__dirname, '../uploads');
// // const reportsDir = path.join(uploadsDir, 'reports');

// // [uploadsDir, reportsDir].forEach(dir => {
// //   if (!fs.existsSync(dir)) {
// //     fs.mkdirSync(dir, { recursive: true });
// //   }
// // });

// // // Configure storage for all files
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, reportsDir);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
// //     // Determine file type prefix
// //     let prefix = 'file';
// //     if (file.mimetype.startsWith('image/')) {
// //       prefix = 'image';
// //     } else if (file.mimetype.startsWith('video/')) {
// //       prefix = 'video';
// //     }
    
// //     cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
// //   }
// // });

// // // File filter for both images and videos
// // const fileFilter = (req, file, cb) => {
// //   // Check if it's an image
// //   if (file.fieldname === 'images') {
// //     const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
// //     const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
// //     const mimetype = allowedImageTypes.test(file.mimetype);

// //     if (mimetype && extname && file.mimetype.startsWith('image/')) {
// //       return cb(null, true);
// //     } else {
// //       return cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed for images'), false);
// //     }
// //   }
  
// //   // Check if it's a video
// //   else if (file.fieldname === 'videos') {
// //     const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm/;
// //     const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
// //     const mimetype = allowedVideoTypes.test(file.mimetype);

// //     if (mimetype && extname && file.mimetype.startsWith('video/')) {
// //       return cb(null, true);
// //     } else {
// //       return cb(new Error('Only video files (MP4, AVI, MOV, WMV, FLV, WEBM) are allowed for videos'), false);
// //     }
// //   }
  
// //   // If it's neither images nor videos field, reject it
// //   else {
// //     return cb(new Error(`Unexpected field: ${file.fieldname}`), false);
// //   }
// // };

// // // Create multer instance with multiple fields
// // const upload = multer({
// //   storage: storage,
// //   limits: {
// //     fileSize: 50 * 1024 * 1024, // 50MB max file size (for videos)
// //     files: 15 // Maximum 15 files total
// //   },
// //   fileFilter: fileFilter
// // });

// // // Middleware for handling report uploads
// // const handleReportUploads = upload.fields([
// //   { 
// //     name: 'images', 
// //     maxCount: 10 
// //   },
// //   { 
// //     name: 'videos', 
// //     maxCount: 5 
// //   }
// // ]);

// // // Error handling middleware for multer
// // const handleUploadErrors = (error, req, res, next) => {
// //   if (error instanceof multer.MulterError) {
// //     if (error.code === 'LIMIT_FILE_SIZE') {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'File too large. Maximum size is 50MB for videos and 5MB for images'
// //       });
// //     }
// //     if (error.code === 'LIMIT_FILE_COUNT') {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Too many files. Maximum 10 images and 5 videos allowed'
// //       });
// //     }
// //     if (error.code === 'LIMIT_UNEXPECTED_FILE') {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Unexpected file field. Only "images" and "videos" fields are allowed'
// //       });
// //     }
// //   }
  
// //   if (error) {
// //     return res.status(400).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
  
// //   next();
// // };

// // module.exports = {
// //   handleReportUploads,
// //   handleUploadErrors
// // };




// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Create uploads directories if they don't exist
// const createUploadDirs = () => {
//   const dirs = [
//     'uploads/images',
//     'uploads/videos', 
//     'uploads/after-images',
//     'uploads/after-videos'
//   ];
  
//   dirs.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//   });
// };

// createUploadDirs();

// // Storage configuration for report images
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/images/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });


// // Storage configuration for report videos
// const videoStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/videos/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // Storage configuration for AFTER images
// const afterImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/after-images/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'after-image-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // Storage configuration for AFTER videos
// const afterVideoStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/after-videos/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'after-video-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter for images
// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// // File filter for videos
// const videoFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('video/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only video files are allowed!'), false);
//   }
// };

// // Multer configurations
// const uploadImage = multer({
//   storage: imageStorage,
//   fileFilter: imageFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit for images
//   }
// });

// const uploadVideo = multer({
//   storage: videoStorage,
//   fileFilter: videoFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024 // 50MB limit for videos
//   }
// });

// // After media upload configurations
// const uploadAfterImage = multer({
//   storage: afterImageStorage,
//   fileFilter: imageFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit for after images
//   }
// });

// const uploadAfterVideo = multer({
//   storage: afterVideoStorage,
//   fileFilter: videoFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024 // 50MB limit for after videos
//   }
// });

// // Middleware for handling after media uploads
// const handleAfterMediaUploads = (req, res, next) => {
//   // Upload up to 5 after images
//   const afterImageUpload = uploadAfterImage.array('afterImages', 5);
//   // Upload up to 2 after videos
//   const afterVideoUpload = uploadAfterVideo.array('afterVideos', 2);

//   afterImageUpload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({
//         success: false,
//         message: err.message
//       });
//     }

//     afterVideoUpload(req, res, (videoErr) => {
//       if (videoErr) {
//         return res.status(400).json({
//           success: false,
//           message: videoErr.message
//         });
//       }
//       next();
//     });
//   });
// };

// module.exports = {
//   uploadImage,
//   uploadVideo,
//   uploadAfterImage,
//   uploadAfterVideo,
//   handleReportUploads, // Your existing middleware
//   handleUploadErrors,  // Your existing middleware
//   handleAfterMediaUploads
// };




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

// Storage for report files (original commented code)
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/reports/');
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

// Storage for regular images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for regular videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for AFTER images
const afterImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/after-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'after-image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for AFTER videos
const afterVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/after-videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'after-video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ===== FILE FILTERS =====

// File filter for report uploads (from original code)
const reportFileFilter = (req, file, cb) => {
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

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// ===== MULTER INSTANCES =====

// Report upload (from original code)
const reportUpload = multer({
  storage: reportStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size (for videos)
    files: 15 // Maximum 15 files total
  },
  fileFilter: reportFileFilter
});

// Regular image upload
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  }
});

// Regular video upload
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  }
});

// After image upload
const uploadAfterImage = multer({
  storage: afterImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for after images
  }
});

// After video upload
const uploadAfterVideo = multer({
  storage: afterVideoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for after videos
  }
});

// ===== MIDDLEWARE =====

// Middleware for handling report uploads (from original code)
const handleReportUploads = reportUpload.fields([
  { 
    name: 'images', 
    maxCount: 10 
  },
  { 
    name: 'videos', 
    maxCount: 5 
  }
]);

// Middleware for handling after media uploads
const handleAfterMediaUploads = (req, res, next) => {
  // Upload up to 5 after images
  const afterImageUpload = uploadAfterImage.array('afterImages', 5);
  // Upload up to 2 after videos
  const afterVideoUpload = uploadAfterVideo.array('afterVideos', 2);

  afterImageUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    afterVideoUpload(req, res, (videoErr) => {
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

// Error handling middleware for multer (from original code)
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
  // Report upload functionality (original)
  handleReportUploads,
  handleUploadErrors,
  
  // Individual upload middlewares
  uploadImage,
  uploadVideo,
  uploadAfterImage,
  uploadAfterVideo,
  
  // After media upload functionality (new)
  handleAfterMediaUploads,
  
  // Combined export for convenience
  uploadUtils: {
    report: {
      handleReportUploads,
      handleUploadErrors
    },
    regular: {
      uploadImage,
      uploadVideo
    },
    after: {
      uploadAfterImage,
      uploadAfterVideo,
      handleAfterMediaUploads
    }
  }
};