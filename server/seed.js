require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon_db');
    console.log(`🍀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // 1. Clear existing database collections
    console.log('🧹 Clearing existing Users and Employees...');
    await User.deleteMany({});
    await Employee.deleteMany({});

    // 2. Create Default Employee Account
    console.log('👤 Creating default Employee account...');
    const employeeUser = new User({
      employeeId: 'EMP001',
      email: 'employee@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'employee',
      mustChangePassword: false,
      isVerified: true
    });
    await employeeUser.save();

    const employeeProfile = new Employee({
      employeeId: 'EMP001',
      firstName: 'Abhisek',
      lastName: 'Roy',
      phone: '+91 9876543210',
      personalEmail: 'employee@example.com',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      company: 'Adamas University',
      manager: 'HR Manager',
      location: 'Kolkata, India',
      about: 'I am a passionate software developer specializing in React and Node.js.',
      whatILoveAboutMyJob: 'Solving complex engineering challenges and creating modern web applications.',
      interestsHobbies: 'Chess, guitar, reading tech publications.',
      skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'CSS'],
      certifications: ['AWS Certified Developer', 'MongoDB Professional'],
      dateOfBirth: new Date('1999-08-20'),
      residingAddress: 'Barasat Road, Kolkata, West Bengal, 700124',
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Single',
      bankDetails: {
        accountNumber: '50100432109876',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0000123',
        panNo: 'BPRPR1234K',
        uanNo: '100543210987'
      },
      salaryDetails: {
        monthWage: 50000,
        workingDaysPerWeek: 5,
        breakTimeHours: 1
      }
    });
    await employeeProfile.save();

    // 3. Create Default HR Manager Account
    console.log('👑 Creating default HR Manager account...');
    const hrUser = new User({
      employeeId: 'HR001',
      email: 'hr@example.com',
      password: 'password123',
      role: 'hr',
      mustChangePassword: false,
      isVerified: true
    });
    await hrUser.save();

    const hrProfile = new Employee({
      employeeId: 'HR001',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91 9830098300',
      personalEmail: 'hr@example.com',
      jobTitle: 'HR Lead Manager',
      department: 'Human Resources',
      company: 'Adamas University',
      manager: 'Director of Operations',
      location: 'Kolkata, India',
      about: 'Experienced human resource professional passionate about talent management.',
      whatILoveAboutMyJob: 'Fostering a productive, friendly workspace and supporting professional growth.',
      interestsHobbies: 'Photography, travel, baking.',
      skills: ['Talent Acquisition', 'Payroll Management', 'Conflict Resolution', 'Odoo ERP'],
      certifications: ['SHRM Certified Professional', 'Excel Advanced Expert'],
      dateOfBirth: new Date('1995-04-12'),
      residingAddress: 'Salt Lake Sector V, Kolkata, West Bengal, 700091',
      nationality: 'Indian',
      gender: 'Female',
      maritalStatus: 'Married',
      bankDetails: {
        accountNumber: '30200987654321',
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0000456',
        panNo: 'CPQPS5678L',
        uanNo: '100789012345'
      },
      salaryDetails: {
        monthWage: 80000,
        workingDaysPerWeek: 5,
        breakTimeHours: 1
      }
    });
    await hrProfile.save();

    console.log(`
==================================================
🎉 Database Seeding Complete!
==================================================
Login Credentials:
-----------------
1. Standard Employee:
   - Login (ID or Email): EMP001   or  employee@example.com
   - Password:            password123

2. HR / Admin Manager:
   - Login (ID or Email): HR001    or  hr@example.com
   - Password:            password123
==================================================
    `);
  } catch (error) {
    console.error(`❌ Seeding Failed: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
