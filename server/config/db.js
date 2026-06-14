const mongoose = require('mongoose');

global.isMockDb = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ No MONGO_URI specified in environment. Switching to LOCAL MOCK DATABASE (CRAFT_DB.json)');
    global.isMockDb = true;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.isMockDb = false;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️ MongoDB failed to connect. Falling back to LOCAL MOCK DATABASE (CRAFT_DB.json)');
    global.isMockDb = true;
  }
};

module.exports = connectDB;
