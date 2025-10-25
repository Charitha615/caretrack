const mongoose = require('mongoose');

const reportAfterMediaSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  reportNumber: {
    type: String,
    required: true
  },
  images: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['released', 'closed'],
    required: true
  },
  adminNotes: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: String,
    default: 'doctor'
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
reportAfterMediaSchema.index({ reportId: 1, status: 1 });

module.exports = mongoose.model('ReportAfterMedia', reportAfterMediaSchema);