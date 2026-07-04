const crypto = require('crypto');

/**
 * Generates a cryptographically secure random temporary password.
 * 
 * @param {number} length - Desired length of the password (minimum 8, default 12)
 * @returns {string} The securely generated and shuffled temporary password
 */
function generateTemporaryPassword(length = 12) {
  // 1. Validate length
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // 2. Guarantee at least one character from each required set
  const passwordArray = [
    uppercaseChars[crypto.randomInt(uppercaseChars.length)],
    lowercaseChars[crypto.randomInt(lowercaseChars.length)],
    numberChars[crypto.randomInt(numberChars.length)],
    specialChars[crypto.randomInt(specialChars.length)]
  ];

  // 3. Fill the rest of the password length with random characters from the combined set
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  const remainingLength = length - passwordArray.length;

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = crypto.randomInt(allChars.length);
    passwordArray.push(allChars[randomIndex]);
  }

  // 4. Securely shuffle the password characters using Fisher-Yates algorithm
  // We use crypto.randomInt to avoid predictability
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    const temp = passwordArray[i];
    passwordArray[i] = passwordArray[j];
    passwordArray[j] = temp;
  }

  return passwordArray.join('');
}

module.exports = { generateTemporaryPassword };
