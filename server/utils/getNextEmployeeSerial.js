const User = require('../models/User');

/**
 * Finds the latest created employee and extracts the next serial number.
 * Starts at 1 if no employees exist yet.
 * 
 * @returns {Promise<number>} The next serial number (1-9999)
 */
async function getNextEmployeeSerial() {
  try {
    // Find the latest user by sorting by creation timestamp in descending order
    const latestUser = await User.findOne({}, { employeeId: 1 }).sort({ createdAt: -1 });

    if (!latestUser || !latestUser.employeeId) {
      return 1;
    }

    const empId = latestUser.employeeId;
    
    // Extract the final 4 characters (serial number part) of the employeeId
    const serialStr = empId.slice(-4);
    const serialNum = parseInt(serialStr, 10);

    if (isNaN(serialNum)) {
      // Fallback if the employeeId format is unexpected
      return 1;
    }

    return serialNum + 1;
  } catch (error) {
    console.error('Error in getNextEmployeeSerial:', error);
    throw error;
  }
}

module.exports = getNextEmployeeSerial;
