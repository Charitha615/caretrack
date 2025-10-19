const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB for seeding');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with proper name and password
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: 'admin123', // Changed to 6+ characters
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();