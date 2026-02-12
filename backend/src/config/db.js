const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in env');
    return;
  }
  try {
    await mongoose.connect(uri, { 
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000,       // Give up initial connection after 10 seconds
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err.message);
    console.warn('WARNING: Running server without database. Check MONGO_URI and Atlas credentials.');
  }
}

module.exports = { connectDB };
