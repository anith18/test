const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://anith:anith123@cluster0.jrhtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Use 127.0.0.1 instead of localhost to avoid IPv6 issues.

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectToMongo;
