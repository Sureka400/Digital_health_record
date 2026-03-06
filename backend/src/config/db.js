const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set in env');
  }
  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  });
  console.log('MongoDB connected');
}

module.exports = { connectDB };
