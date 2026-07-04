require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('./models/User');
const LeaveRequest = require('./models/LeaveRequest');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const runTests = async () => {
  console.log("Setting up integrated server environment for Leaves...");
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/leaves', leaveRoutes);

  const PORT = 5098;
  const server = app.listen(PORT);

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not defined in .env file.");
    server.close();
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB cluster...");
    await mongoose.connect(MONGO_URI);

    // Clean prior test artifacts
    await User.deleteMany({ email: /test-leaves-.*@example\.com/ });
    await LeaveRequest.deleteMany({});

    // Create seed accounts
    const employee = new User({
      employeeId: 'TESTEMP001',
      email: 'test-leaves-emp@example.com',
      password: 'password123',
      role: 'employee',
      mustChangePassword: false,
      isVerified: true
    });
    await employee.save();

    const employee2 = new User({
      employeeId: 'TESTEMP002',
      email: 'test-leaves-emp2@example.com',
      password: 'password123',
      role: 'employee',
      mustChangePassword: false,
      isVerified: true
    });
    await employee2.save();

    const hr = new User({
      employeeId: 'TESTHR001',
      email: 'test-leaves-hr@example.com',
      password: 'password123',
      role: 'hr',
      mustChangePassword: false,
      isVerified: true
    });
    await hr.save();

    const jwtSecret = process.env.JWT_SECRET || 'temporary_hackathon_jwt_secret_key_12345';
    const empToken = jwt.sign({ userId: employee._id }, jwtSecret, { expiresIn: '1h' });
    const emp2Token = jwt.sign({ userId: employee2._id }, jwtSecret, { expiresIn: '1h' });
    const hrToken = jwt.sign({ userId: hr._id }, jwtSecret, { expiresIn: '1h' });

    console.log('\n==================================================');
    console.log('🚀 RUNNING INTEGRATED LEAVES TEST SUITE');
    console.log('==================================================\n');

    // 1. Unauthenticated leave application -> 401
    const res1 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leaveType: 'sick',
        startDate: '2026-08-01',
        endDate: '2026-08-05',
        reason: 'Flu symptoms'
      })
    });
    console.log(`[TEST 1] Unauthenticated leave: Status ${res1.status} (Expected: 401)`);
    if (res1.status !== 401) throw new Error('Test 1 failed');

    // 2. Employee applies successfully -> 201
    const res2 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({
        leaveType: 'sick',
        startDate: '2026-08-01',
        endDate: '2026-08-05',
        reason: 'Flu symptoms'
      })
    });
    const data2 = await res2.json();
    console.log(`[TEST 2] Employee applies successfully: Status ${res2.status} (Expected: 201)`);
    if (res2.status !== 201 || !data2.success) throw new Error('Test 2 failed');
    const createdRequestId = data2.data._id;

    // 3. Invalid date range -> 400
    const res3 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({
        leaveType: 'casual',
        startDate: '2026-08-10',
        endDate: '2026-08-05', // end before start
        reason: 'Vacation'
      })
    });
    console.log(`[TEST 3] Invalid date range check: Status ${res3.status} (Expected: 400)`);
    if (res3.status !== 400) throw new Error('Test 3 failed');

    // 4. Overlapping leave request -> 400
    const res4 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({
        leaveType: 'casual',
        startDate: '2026-08-03', // overlap 1-5
        endDate: '2026-08-08',
        reason: 'Family gathering'
      })
    });
    console.log(`[TEST 4] Overlapping leave request: Status ${res4.status} (Expected: 400)`);
    if (res4.status !== 400) throw new Error('Test 4 failed');

    // 5. Employee sees own leave history -> 200 and count = 1
    const res5 = await fetch(`http://localhost:${PORT}/api/leaves/my`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${empToken}` }
    });
    const data5 = await res5.json();
    console.log(`[TEST 5] Employee sees personal logs: Count ${data5.data?.length} (Expected: 1), Status ${res5.status}`);
    if (res5.status !== 200 || data5.data?.length !== 1) throw new Error('Test 5 failed');

    // 6. Employee cannot see all requests -> 403
    const res6 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${empToken}` }
    });
    console.log(`[TEST 6] Block employee from all requests audit: Status ${res6.status} (Expected: 403)`);
    if (res6.status !== 403) throw new Error('Test 6 failed');

    // 7. Employee cannot cancel someone else's request -> 403
    const res7 = await fetch(`http://localhost:${PORT}/api/leaves/${createdRequestId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${emp2Token}` }
    });
    console.log(`[TEST 7] Cancel request not owned: Status ${res7.status} (Expected: 403)`);
    if (res7.status !== 403) throw new Error('Test 7 failed');

    // 8. Employee cannot approve/reject -> 403
    const res8 = await fetch(`http://localhost:${PORT}/api/leaves/${createdRequestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({ reviewComment: 'Nice' })
    });
    console.log(`[TEST 8] Employee tries to approve request: Status ${res8.status} (Expected: 403)`);
    if (res8.status !== 403) throw new Error('Test 8 failed');

    // 9. HR sees all requests -> 200
    const res9 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    const data9 = await res9.json();
    console.log(`[TEST 9] HR audits all records: Count ${data9.data?.length} (Expected: 1), Status ${res9.status}`);
    if (res9.status !== 200 || data9.data?.length === 0) throw new Error('Test 9 failed');

    // 10. HR approves pending request -> 200
    const res10 = await fetch(`http://localhost:${PORT}/api/leaves/${createdRequestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({ reviewComment: 'Approved, get well soon!' })
    });
    const data10 = await res10.json();
    console.log(`[TEST 10] HR approves request: Status ${res10.status} (Expected: 200), New Status: ${data10.data?.status}`);
    if (res10.status !== 200 || data10.data?.status !== 'approved') throw new Error('Test 10 failed');

    // 11. Already reviewed request cannot be reviewed again -> 400
    const res11 = await fetch(`http://localhost:${PORT}/api/leaves/${createdRequestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({ reviewComment: 'Rejecting already approved' })
    });
    console.log(`[TEST 11] Review already reviewed request: Status ${res11.status} (Expected: 400)`);
    if (res11.status !== 400) throw new Error('Test 11 failed');

    // 12. Employee cannot cancel approved request -> 400
    const res12 = await fetch(`http://localhost:${PORT}/api/leaves/${createdRequestId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${empToken}` }
    });
    console.log(`[TEST 12] Cancel approved request: Status ${res12.status} (Expected: 400)`);
    if (res12.status !== 400) throw new Error('Test 12 failed');

    // 13. Cancel pending request successfully -> 200
    // Create new pending request first
    const setupRes = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({
        leaveType: 'earned',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        reason: 'Annual trip'
      })
    });
    const setupData = await setupRes.json();
    const newPendingId = setupData.data._id;

    const res13 = await fetch(`http://localhost:${PORT}/api/leaves/${newPendingId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${empToken}` }
    });
    console.log(`[TEST 13] Cancel pending request: Status ${res13.status} (Expected: 200)`);
    if (res13.status !== 200) throw new Error('Test 13 failed');

    // 14. HR rejects pending request -> 200
    // Create another pending request first
    const setupRes2 = await fetch(`http://localhost:${PORT}/api/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${empToken}`
      },
      body: JSON.stringify({
        leaveType: 'unpaid',
        startDate: '2026-10-01',
        endDate: '2026-10-05',
        reason: 'Personal work'
      })
    });
    const setupData2 = await setupRes2.json();
    const newPendingId2 = setupData2.data._id;

    const res14 = await fetch(`http://localhost:${PORT}/api/leaves/${newPendingId2}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({ reviewComment: 'Not allowed during project delivery' })
    });
    const data14 = await res14.json();
    console.log(`[TEST 14] HR rejects pending request: Status ${res14.status} (Expected: 200), New Status: ${data14.data?.status}`);
    if (res14.status !== 200 || data14.data?.status !== 'rejected') throw new Error('Test 14 failed');

    console.log('\n==================================================');
    console.log('🎉 ALL 14 LEAVE MANAGEMENT TEST CASES PASSED!');
    console.log('==================================================\n');

  } catch (err) {
    console.error('\n❌ TEST RUNNER EXCEPTION:', err.message);
    process.exit(1);
  } finally {
    // Purge test logs and close database
    await User.deleteMany({ email: /test-leaves-.*@example\.com/ });
    await LeaveRequest.deleteMany({});
    server.close();
    await mongoose.connection.close();
    console.log("Database connection closed. Test environment cleaned.");
  }
};

runTests();
