const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportNumber: {
    type: String,
    unique: true,
    default: function() {
      // Generate a temporary ID, will be replaced in pre-save hook
      return 'temp-' + Date.now();
    }
  },
  reporterName: {
    type: String,
    required: true,
    trim: true
  },
  reporterEmail: {
    type: String,
    required: true,
    trim: true
  },
  reporterContact: {
    type: String,
    required: true,
    trim: true
  },
  reporterAddress: {
    type: String,
    required: true,
    trim: true
  },
  reportLocation: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String, // Store file paths
    default: []
  }],
  videos: [{
    type: String, // Store file paths
    default: []
  }],
  dogCount: {
    type: Number,
    default: 1,
    min: 1
  },
  dogCondition: {
    type: String,
    enum: ['healthy', 'injured', 'sick', 'aggressive', 'unknown'],
    default: 'unknown'
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'rejected'],
    default: 'pending'
  },
  additionalNotes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate report number before saving
reportSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    try {
      // Count today's reports to generate sequential number
      const todayStart = new Date(date.setHours(0, 0, 0, 0));
      const todayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const todaysReportsCount = await mongoose.model('Report').countDocuments({
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd
        }
      });
      
      const sequentialNumber = String(todaysReportsCount + 1).padStart(4, '0');
      this.reportNumber = `CT-${year}${month}${day}-${sequentialNumber}`;
    } catch (error) {
      // Fallback if counting fails
      const sequentialNumber = String(Date.now()).slice(-4);
      this.reportNumber = `CT-${year}${month}${day}-${sequentialNumber}`;
    }
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);