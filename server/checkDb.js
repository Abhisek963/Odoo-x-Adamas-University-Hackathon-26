require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon_db');
    const users = await User.find({}, 'employeeId email role');
    console.log(`==================================================`);
    console.log(`📊 Current Users in DB (${users.length} total):`);
    console.log(`==================================================`);
    users.forEach(u => {
      console.log(`- ID: ${u.employeeId} | Email: ${u.email} | Role: ${u.role}`);
    });
    console.log(`==================================================`);
  } catch (err) {
    console.error(`❌ Error checking DB: ${err.message}`);
  } finally {
    mongoose.connection.close();
  }
};

check();
