/**
 * Generates a standardized employee login ID.
 * Format: OI + first 2 letters of first name + first 2 letters of last name + 4-digit joining year + 4-digit serial number.
 * Example: OIJODO20220001
 * 
 * @param {string} firstName - Employee's first name
 * @param {string} lastName - Employee's last name
 * @param {number|string} joiningYear - The year the employee joined (4-digit)
 * @param {number|string} serialNumber - The sequence serial number (1 to 9999)
 * @returns {string} The generated employee login ID
 */
function generateEmployeeId(firstName, lastName, joiningYear, serialNumber) {
  // 1. Validation of names
  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    throw new Error('First name and last name must be valid strings');
  }

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();

  if (trimmedFirst.length < 2) {
    throw new Error('First name must contain at least 2 characters after trimming');
  }
  if (trimmedLast.length < 2) {
    throw new Error('Last name must contain at least 2 characters after trimming');
  }

  // 2. Validation of joiningYear
  const yearString = String(joiningYear).trim();
  const yearNum = Number(yearString);
  if (!Number.isInteger(yearNum) || yearString.length !== 4 || yearNum < 1000 || yearNum > 9999) {
    throw new Error('Joining year must be a valid 4-digit integer (1000-9999)');
  }

  // 3. Validation of serialNumber
  const serialNum = Number(serialNumber);
  if (!Number.isInteger(serialNum) || serialNum < 1 || serialNum > 9999) {
    throw new Error('Serial number must be a positive integer between 1 and 9999');
  }

  // 4. Formulate parts
  const firstPart = trimmedFirst.slice(0, 2).toUpperCase();
  const lastPart = trimmedLast.slice(0, 2).toUpperCase();
  const paddedSerial = String(serialNum).padStart(4, '0');

  // 5. Construct and return final ID
  return `OI${firstPart}${lastPart}${yearNum}${paddedSerial}`;
}

module.exports = { generateEmployeeId };
